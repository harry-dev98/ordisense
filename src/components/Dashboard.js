import React, { Component } from "react";
import Line from "./LineGraph";
import Notes from './Notes';
import Warning from './Warning';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import GoogleLogin from 'react-google-login';
import ReCAPTCHA from "react-google-recaptcha";

import './style.css';

import { fetchData, verifyCaptcha, verifyLogin } from '../service/api';

export default class Dashboard extends Component {
    state = {
        startDate: new Date(),
        endDate: new Date(),
        humidity: [],
        temperature: [],
        labels: [],
        isLoggedIn: true,
        isCaptcha: false,
    }
    handleDateChange(dates){
        const [startDate, endDate] = dates;
        this.setState({startDate, endDate});
    }
    loggedin(response){
        console.log(response);
        verifyLogin(response.tokenId)false
        .then(()=>{this.setState({...this.state, isLoggedIn: true});})
        .catch(()=>{this.setState({...this.state, isLoggedIn: false})})
    }
    loginFail(){
        this.setState({...this.state, isLoggedIn: false});
    }

    captchaChange(value){
        verifyCaptcha(value)
        .then(()=>{this.setState({...this.state, isCaptcha: true});})
        .catch(()=>{this.setState({...this.state, isCaptcha: false})})
    }

    componentDidUpdate(prevprops, prevState){
        if(prevState.startDate === this.state.startDate && prevState.endDate === this.state.endDate){
            return;
        }
        if(this.state.startDate !== null && this.state.endDate !== null && this.state.isLoggedIn && this.state.isCaptcha){
            fetchData(this.state.startDate, this.state.endDate)
            .then((data)=>{
                this.setState({...this.state, ...data});
            });
        }
    }
    render() {
        const humidity = (this.state.humidity.reduce((acc, cur)=>acc+cur, 0)/this.state.humidity.length).toFixed(2);
        const temperature = (this.state.temperature.reduce((acc, cur)=>acc+cur, 0)/this.state.temperature.length).toFixed(2);
        return (
            <>
                {!(this.state.isLoggedIn && this.state.isCaptcha)? <div className="google">
//                         <GoogleLogin
//                             clientId="11561370885-11a2tmqpupr6hc1lvrqnvfrp9mpkpdoh.apps.googleusercontent.com"
//                             buttonText="Login"
//                             onSuccess={this.loggedin.bind(this)}
//                             onFailure={this.loginFail.bind(this)}
//                             cookiePolicy={'single_host_origin'}
//                         />
                        <ReCAPTCHA
                            sitekey="6Le9kywaAAAAAP0o4UAChlioECJeN50LN1YBE3S_"
                            onChange={this.captchaChange.bind(this)}
                        />
                    </div>
                :
                <div className="container">
                    <div className="information">
                        <div className="datepicker">
                            <h3 className="heading">Pick a range of dates</h3>
                            <DatePicker
                                minDate={new Date('Dec 1, 2020')}
                                maxDate={new Date('Jan 28, 2021')} 
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onChange={this.handleDateChange.bind(this)}
                                selectsRange
                                inline
                            />
                        <div className="warning">
                            <Warning temp={temperature} humidity={humidity} />
                        </div>
                        </div>
                        <div className="notes">
                            <Notes />
                        </div>
                    </div>
                    <div className="graph-container">
                        <div className="graph">
                            <Line labels={this.state.labels} data={this.state.temperature} label={"Temperature"} />
                            <p className="graph-text"> Temperature: {temperature}</p>
                        </div>
                        <div className="graph">
                            <Line labels={this.state.labels} data={this.state.humidity} label={"Humidity"} />
                            <p className="graph-text">Humidity: {humidity}</p>
                        </div>
                    </div>
                </div>}
            </>
        );
    }
}
