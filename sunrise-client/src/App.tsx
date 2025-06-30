import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface SunEvent {
  date: string;
  sunrise: string;
  sunset: string;
  golden_hour: string;
}

function App() {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState<SunEvent[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3001/sunrise', {
      params: { location, date_start: startDate, date_end: endDate }
    });

    let normalizedData: SunEvent[] = [];

    if (Array.isArray(response.data)) {
      if (Array.isArray(response.data[0])) {
        normalizedData = response.data[0];
      } else {
        normalizedData = response.data.map((item: any) => ({
          date: item.date,
          sunrise: item.sunrise,
          sunset: item.sunset,
          golden_hour: item.golden_hour
        }));
      }
    }

    setData(normalizedData);
  } catch (error: any) {
    console.error('Error fetching data:', error);

    // Show backend error if available
    if (error.response && error.response.data && error.response.data.error) {
      alert(`Error: ${error.response.data.error}`);
    } else {
      alert('Error fetching data');
    }
  }
};

  const timeStringToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    let totalMinutes = (hours % 12) * 60 + minutes;
    if (modifier === 'PM') totalMinutes += 12 * 60;

    return totalMinutes;
  };

  useEffect(() => {
    const processedData = data.map((event) => {
      const sunriseMinutes = timeStringToMinutes(event.sunrise);
      const sunsetMinutes = timeStringToMinutes(event.sunset);
      const sunMinutes = sunsetMinutes - sunriseMinutes;

      return {
        date: event.date,
        sunMinutes: sunMinutes >= 0 ? sunMinutes : 0
      };
    });

    setChartData(processedData);
  }, [data]);

  return (
    <div className="container">
      <h1>🌅 Sun Event Tracker</h1>

      <div className="form">
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={fetchData}>Get Data</button>
      </div>

      {data.length > 0 && (
        <>
          <h2>📅 Results</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sunrise</th>
                <th>Sunset</th>
                <th>Golden Hour Start</th>
              </tr>
            </thead>
            <tbody>
              {data.map((event, index) => (
                <tr key={event.date + index}>
                  <td>{event.date}</td>
                  <td>{event.sunrise}</td>
                  <td>{event.sunset}</td>
                  <td>{event.golden_hour}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>☀️ Sunlight Duration (Minutes)</h2>
          <div className="chart-container">
            <LineChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sunMinutes" stroke="#8884d8" name="Sunlight Minutes" />
            </LineChart>
          </div>
        </>
      )}

      <style>{`
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    text-align: center;
  }
  h1 {
    color: #333;
  }
  .form {
    margin-bottom: 20px;
  }
  .form input, .form button {
    padding: 8px 12px;
    margin: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .form button {
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
  }
  .form button:hover {
    background-color: #45a049;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }
  table th, table td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  table th {
    background-color: #f2f2f2;
  }
  .chart-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
`}</style>

    </div>
  );
}

export default App;