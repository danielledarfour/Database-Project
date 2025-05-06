import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Loader from '../../ui/Loader';

const TopCrimesByCityChart = ({ selectedState, selectedYear }) => {
  const [crimeData, setCrimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCrimeData = async () => {
      if (!selectedState || !selectedYear) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${serverBaseUrl}/crime/${selectedState}/${selectedYear}`);
        
        if (response.data && response.data.length > 0) {
          // Sort by total incidents in descending order
          const sortedData = [...response.data].sort((a, b) => b.totalincidents - a.totalincidents);
          setCrimeData(sortedData);
        } else {
          setCrimeData([]);
        }
      } catch (err) {
        console.error(`Error fetching crime data:`, err);
        setError(err.message || 'Failed to load crime data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrimeData();
  }, [selectedState, selectedYear]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!crimeData || crimeData.length === 0) {
    return (
      <div className="text-center text-gray-400 p-4">
        <p>No crime data available for {selectedState} in {selectedYear}</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: crimeData.map(item => item.city),
    datasets: [
      {
        label: 'Total Crime Incidents',
        data: crimeData.map(item => item.totalincidents),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',  // Horizontal bar chart
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `Incidents: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: 'white',
          precision: 0 // Ensure we get integer values only
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        title: {
          display: true,
          text: 'Total Reported Incidents',
          color: 'white',
          font: {
            size: 12
          }
        }
      },
      y: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-mint mb-1">Top Cities by Crime Rate</h3>
      <p className="text-gray-400 mb-4">
        Cities in {selectedState} with the highest reported crime incidents in {selectedYear}
      </p>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Crime statistics table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-eerie-black/60">
            <tr>
              <th scope="col" className="px-4 py-3">Rank</th>
              <th scope="col" className="px-4 py-3">City</th>
              <th scope="col" className="px-4 py-3">Total Incidents</th>
              <th scope="col" className="px-4 py-3">Safety Score [Relative to State]</th>
            </tr>
          </thead>
          <tbody>
            {crimeData.map((city, index) => {
              // Calculate a mock safety score (inverse of crime incidents, normalized)
              const maxIncidents = crimeData[0].totalincidents;
              const safetyScore = Math.round((1 - (city.totalincidents / maxIncidents)) * 100);
              
              return (
                <tr key={index} className="border-b border-eerie-black/50 hover:bg-eerie-black/40">
                  <td className="px-4 py-3 font-medium">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{city.city}</td>
                  <td className="px-4 py-3">{city.totalincidents.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            safetyScore > 70 ? 'bg-green-500' : 
                            safetyScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${safetyScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs w-8">{safetyScore}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopCrimesByCityChart; 