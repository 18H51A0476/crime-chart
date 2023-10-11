import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CrimeChart from './CrimeChart';
import "./App.css"

const App = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [offenseKeys, setOffenseKeys] = useState([]);
  const [selectedOffenseKey, setSelectedOffenseKey] = useState(null);

  useEffect(() => {
    axios
      .get(
        'https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv'
      )
      .then(response => {
        setCrimeData(response.data.data);
        const keys = Object.keys(response.data.data[0]).filter(key => key !== 'data_year');
        setOffenseKeys(keys);
        setSelectedOffenseKey(keys[0]);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleOffenseChange = (event) => {
    setSelectedOffenseKey(event.target.value);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Crime Statistics</h1>
      {offenseKeys.length > 0 ? (
        <div className="chart-container">
          <label className="select-label">Select Offense: </label>
          <select
            className="select-offense"
            value={selectedOffenseKey}
            onChange={handleOffenseChange}
          >
            {offenseKeys.map(key => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <CrimeChart
            data={crimeData}
            selectedOffenseKey={selectedOffenseKey}
            offenseKeys={offenseKeys}
          />
        </div>
      ) : (
        <p className="loading-message">Loading...</p>
      )}
    </div>
  );
};

export default App;
