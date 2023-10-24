import './WorldEvents.css';
import React, { useState, useEffect } from 'react';
import Timer from './Timer';

import WorldBossSound from './sounds/worldboss_warning.mp3';
import HelltideSound from './sounds/helltide_warning.mp3';
import LegionSound from './sounds/legion_warning.mp3';


function WorldEvents(props) {
  const [data, setData] = useState({});
  const [requiresUpdate, setRequiresUpdate] = useState(false);

  useEffect(() => {
    fetch('https://planners.maxroll.gg/d4/events')
      .then(response => response.json())
      .then((response) => {
        setData(response);
        setRequiresUpdate(false);
      });
  }, [requiresUpdate]);

  const handleSetRequiresUpdate = (val) => {
    setRequiresUpdate(val);
  };

  return (
    <div className="eventContainer">
      <EventWorldBoss data={data.worldboss} setRequiresUpdate={handleSetRequiresUpdate} />
      <EventHelltide data={data.helltide} setRequiresUpdate={handleSetRequiresUpdate} />
      <EventLegion data={data.legion} setRequiresUpdate={handleSetRequiresUpdate} />
    </div>
  )
}


function WorldEvent(props) {
  return (
    <div className="event">
      <h1>{props.name}</h1>
      {props.data}
    </div>
  )
}

function EventWorldBoss(props) {
  const [warningTriggered, setWarningTriggered] = useState(false);

  if (!props.data)
    return;

  const data = props.data;
  const onTimeReached = {
    time: {
      hours: 0,
      minutes: 10,
      seconds: 0
    },
    func: () => {
      if (warningTriggered)
        return;

      new Audio(WorldBossSound).play();
      setWarningTriggered(true);
    }
  };
  return WorldEvent({
    name: "World Boss",
    data: (
      <div>
        <p>Name: {data.name}</p>
        <p>Location: "{data.territory}" in "{data.zone}"</p>
        <Timer untilTime={data.expected * 1000} onTimeReached={onTimeReached} onTimerEnd={() => props.setRequiresUpdate(true)} />
      </div>
    )
  });
}

function EventHelltide(props) {
  const [warningTriggered, setWarningTriggered] = useState(false);

  if (!props.data)
    return;

  const data = props.data;
  const zoneDict = {
    "frac": "Fractured Peaks",
    "scog": "Scogslen",
    "kehj": "Kehjistan"
  };
  const timeLeft = () => {
    const now = new Date().getTime();
    const time = data.isActive ? data.remainingTime : data.timeUntilNext;

    return now + (time.minutes * 60 * 1000) + (time.seconds * 1000);
  };
  const onTimeReached = {
    time: {
      hours: 0,
      minutes: 5,
      seconds: 0
    },
    func: () => {
      if (warningTriggered)
        return;
      
      if (data.isActive)
        return;

      new Audio(HelltideSound).play();
      props.setRequiresUpdate(true);
      setWarningTriggered(true);
    }
  };
  return WorldEvent({
    name: "Helltide",
    data: (
      <div>
        <p>Is active: {data.isActive.toString()}</p>
        <p>Zone: {zoneDict[data.coordinates.zone]}</p>
        <Timer untilTime={timeLeft()} onTimeReached={onTimeReached} onTimerEnd={() => props.setRequiresUpdate(true)} />
      </div>
    )
  });
}

function EventLegion(props) {
  const [warningTriggered, setWarningTriggered] = useState(false);

  if (!props.data)
    return;

  const data = props.data;
  const onTimeReached = {
    time: {
      hours: 0,
      minutes: 5,
      seconds: 0
    },
    func: () => {
      if (warningTriggered)
        return;

      new Audio(LegionSound).play();
      props.setRequiresUpdate(true);
      setWarningTriggered(true);
    }
  };
  return WorldEvent({
    name: "Legion",
    data: (
      <div>
        <p>Zone: "{data.territory}" in "{data.zone}"</p>
        <Timer untilTime={data.expected * 1000} onTimeReached={onTimeReached} onTimerEnd={() => props.setRequiresUpdate(true)} />
      </div>
    )
  });
}

export default WorldEvents;
