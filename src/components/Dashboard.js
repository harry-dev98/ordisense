import React, { Component } from "react";
import Line from "./LineGraph";
import Notes from './Notes';
import Warning from './Warning';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import './style.css';

export default class Dashboard extends Component {
    state = {
        startDate: null,
        endDate: null,
    }
    handleDateChange(dates){
        const [startDate, endDate] = dates;
        this.setState({startDate, endDate});
    }
    render() {
        return (
        <div className="container">
            <div className="information">
                <div className="datepicker">
                    <h3 className="heading">Pick a range of dates</h3>
                    <DatePicker
                        minDate={new Date('Dec 1, 2020')}
                        maxDate={new Date('Jan 31, 2021')} 
                        {...this.state}
                        onChange={this.handleDateChange.bind(this)}
                        selectsRange
                        inline
                    />
                <div className="warning">
                    <Warning temp={10} humidity={10} />
                </div>
                </div>
                <div className="notes">
                    <Notes />
                </div>
            </div>
            <div className="graph-container">
                <div className="graph">
                    <Line />
                    <p className="graph-text"> Temperature: 10</p>
                </div>
                <div className="graph">
                    <Line />
                    <p className="graph-text">Humidity: 20</p>
                </div>
            </div>
        </div>
        );
    }
}
