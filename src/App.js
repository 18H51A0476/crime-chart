import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import CrimeChart from "./CrimeChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./App.css";

const App = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [offenseKeys, setOffenseKeys] = useState([]);
  const [selectedOffenseKey, setSelectedOffenseKey] = useState(null);
  const chartContainerRef = useRef(null);

  useEffect(() => {
    axios
      .get(
        "https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv"
      )
      .then((response) => {
        setCrimeData(response.data.data);
        const keys = Object.keys(response.data.data[0]).filter(
          (key) => key !== "data_year"
        );
        setOffenseKeys(keys);
        setSelectedOffenseKey(keys[0]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleOffenseChange = (event) => {
    setSelectedOffenseKey(event.target.value);
  };

  const handlePrint = () => {
    if (chartContainerRef.current) {
      html2canvas(chartContainerRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
        pdf.save(`${selectedOffenseKey}_crime_statistics.pdf`);
      });
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Crime Statistics {selectedOffenseKey}</h1>
      {offenseKeys.length > 0 ? (
        <div className="chart-container" ref={chartContainerRef}>
          <label className="select-label">Select Offense: </label>
          <select
            className="select-offense"
            value={selectedOffenseKey}
            onChange={handleOffenseChange}
          >
            {offenseKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <button id="dropdown-button-div" className="print-button" onClick={handlePrint}>
            Print as PDF
          </button>
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
