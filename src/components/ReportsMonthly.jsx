import React, { Component } from 'react';

class ReportsMonthly extends Component {

  constructor() {
    super();
    this.state = {
      months: {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Aug',
        11: 'Nov',
        12: 'Dec',
      }
    }
  }

  twoDecimalRound (num) {
    return Math.round(num * 100) / 100;
  }
  
  render() {
    console.log(this.props.graphData);
    return (
      Object.keys(this.props.graphData.months).map(month => {
          return (
            <div key={month}>
              <div className='monthlyReport'>
                <h1>{this.state.months[month]}</h1>
                <div className="monthlyReport__to">
                  <div className="monthlyReport__label">To:</div>
                  <div 
                    className="monthlyReport__bar monthlyReport__bar--to" 
                    style={{ width: this.twoDecimalRound(this.props.graphData.months[month].totalToTime / this.props.graphData.months[month].totalDays / this.props.graphData.longest * 100) + '%'}}>
                      {this.twoDecimalRound(this.props.graphData.months[month].totalToTime / this.props.graphData.months[month].totalDays / 1000 / 60)} mins
                  </div>
                </div>
                <div className="monthlyReport__from">
                  <div className="monthlyReport__label">From:</div>
                  <div 
                    className="monthlyReport__bar monthlyReport__bar--from"
                    style={{ width: this.twoDecimalRound(this.props.graphData.months[month].totalFromTime / this.props.graphData.months[month].totalDays / this.props.graphData.longest * 100) + '%'}}>
                      {this.twoDecimalRound(this.props.graphData.months[month].totalFromTime / this.props.graphData.months[month].totalDays / 1000 / 60)} mins
                  </div>
                </div>
              </div>
            </div>
          );
        })
      );
  }
}

export default ReportsMonthly;