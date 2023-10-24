import React, { useState, useEffect } from 'react';


function Timer(props) {
    const [hours, setHours] = useState(NaN);
    const [minutes, setMinutes] = useState(NaN);
    const [seconds, setSeconds] = useState(NaN);

    const getTime = () => {
        const time = new Date(props.untilTime) - new Date().getTime();

        setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));

        if (props.onTimeReached) {
            const specificTime = props.onTimeReached.time;

            if (hours <= specificTime.hours && minutes <= specificTime.minutes && seconds <= specificTime.seconds) {
                props.onTimeReached.func();
            }
        }

        if (hours <= 0 && minutes <= 0 && seconds <= 0) {
            if (props.onTimerEnd) {
                props.onTimerEnd();
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => getTime(), 1000);
        return () => clearInterval(interval);
    });

    return (
        <p>Time left: {hours}h {minutes}m {seconds}s</p>
    )
}

export default Timer;
