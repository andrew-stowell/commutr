import React, { Component } from 'react';
// import '../App.css';
import firebase, { auth, provider } from '../resources/firebase.js';
import ReportsMonthly from './ReportsMonthly';

const dateFormat = require('dateformat');
const moment = require('moment');
const today = new Date();

class ReportsScreen extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      groupedData: null,
    }
    this.getData = this.getData.bind(this);
  }

  // keeps the local store in sync with the firebase db
  getData() {
    const itemsRef = firebase.database().ref('items/' + this.state.user.uid);
  
    itemsRef.on('value', (snap) => {
      const latestData = snap.val();

      this.setState({
        groupedData: this.groupedDataFunction(latestData),
      });
      // console.log(this.state.groupedData);
    });
  }

  // parses out date keys - YYYYMMDD
  // the month has to be parsed as an int and then 
  // minused one since months are 0 based and our data is 1 based
  // because js
  // https://stackoverflow.com/questions/1507619/javascript-date-utc-function-is-off-by-a-month
  getDateObject(partial) {
    return new Date(partial.slice(0, 4), parseInt(partial.slice(4, 6), 10) - 1, partial.slice(6, 9))
  }

  groupedDataFunction(data) {
    const groupedDataScoped = {};
    
    Object.keys(data).forEach(key => {
        const year = key.slice(0, 4);
        const month = parseInt(key.slice(4, 6), 10);
        const day = parseInt(key.slice(6, 9), 10);
        
        // check year
        if (!(year in groupedDataScoped)) {
          groupedDataScoped[year] = {};
        }

        // check month
        if (!(month in groupedDataScoped[year])) {
          groupedDataScoped[year][month] = {};
        }

        // add day
        groupedDataScoped[year][month][day] = data[key];
    })
    return groupedDataScoped;
  }

  createGraph(data) {
    let totalDays = 0;
    let totalToTime = 0;
    let totalFromTime = 0;
    const allData = {
      months: {},
    };
    Object.keys(data).forEach(month => {

      Object.keys(data[month]).forEach(day => {
        const startTo = new Date('June 17, 2015 '+ data[month][day].leaveHome);
        const endTo = new Date('June 17, 2015 '+ data[month][day].arriveWork);
        const diffTo = endTo - startTo;
        totalToTime += diffTo;

        const startFrom = new Date('June 17, 2015 '+ data[month][day].leaveWork);
        const endFrom = new Date('June 17, 2015 '+ data[month][day].arriveHome);
        const diffFrom = endFrom - startFrom;
        totalFromTime += diffFrom;

        totalDays++;
      })

      allData['months'][month] = {
        totalDays,
        totalToTime,
        totalFromTime,
      }

      if (allData['shortest'] == null || Math.min(totalToTime / totalDays, totalFromTime / totalDays) < allData['shortest']){
        allData['shortest'] = Math.min(totalToTime / totalDays, totalFromTime / totalDays);
      }

      if (allData['longest'] == null ||  Math.max(totalToTime / totalDays, totalFromTime / totalDays) > allData['longest']){
        allData['longest'] = Math.max(totalToTime / totalDays, totalFromTime / totalDays);
      }

    })

    return allData;
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        this.getData();
      } else {
        // send user to login page if not logged in
        this.props.history.push("/login");
      }
    });
  }

  render() {
    return (
      <div className="report-time">
        {this.state.user ?
          <div>
          { this.state.groupedData !== null ?

            Object.keys(this.state.groupedData).map(year => {
              return <ReportsMonthly key={year} graphData={this.createGraph(this.state.groupedData[year])} />;
            })
            :
            <div>Loading Data...</div>
          }
          </div>
          :
          <div>Validating login</div>
        }
      </div>
    );
  }
}

export default ReportsScreen;