import React from 'react';

const checkWarnings = (temp, humidity) => {
    let warning = {
        warnings: [],
        isWarned: false,
    }
    if ( temp < 21 ){
        warning = {
            warnings: [...warning.warnings, "Temperature is below 21"],
            isWarned: true,
        };
    } else if( temp > 25){
        warning = {
            warnings: [...warning.warnings, "Temperature is above 25"],
            isWarned: true,
        };
    }
    
    if ( humidity < 40 ){
        warning = {
            warnings: [...warning.warnings, "Humidity is below 40"],
            isWarned: true,
        };
    } else if( humidity > 60){
        warning = {
            warnings: [...warning.warnings, "Humidity is above 60"],
            isWarned: true,
        };
    }
    return warning;
};

const Warning = ({ temp, humidity }) => {
    let warnings = checkWarnings(temp, humidity)
    if(warnings.isWarned){
        return (
            <>
            {warnings.warnings.map((warn, idx)=>(
                <div className="warning-item" key={idx}>
                    <i className="fa fa-circle" />
                    <p>{warn}</p>
                </div>
            ))}
            </>
        );
    } else return null;
};

export default Warning;