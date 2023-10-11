import React from 'react';
import Plot from 'react-plotly.js';

const CrimeChart = ({ data, selectedOffenseKey, offenseKeys }) => {
  const years = data.map(item => item.data_year);
  const crimeData = data.map(item => item[selectedOffenseKey]);

  const chartData = [
    {
      x: years,
      y: crimeData,
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'blue' },
      name: selectedOffenseKey,
    },
  ];

  return (
    <div>
      <h2>Crime Data Line Chart</h2>
      <Plot
        data={chartData}
        layout={{
          xaxis: { title: 'Year' },
          yaxis: { title: 'Crime Count' },
          width: 800,
          height: 400,
        }}
      />
    </div>
  );
};

export default CrimeChart;
