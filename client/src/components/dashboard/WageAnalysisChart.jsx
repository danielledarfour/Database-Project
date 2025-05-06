import React, { useState, useEffect } from 'react';
import { Bar, Scatter } from 'react-chartjs-2';
import axios from 'axios';
import Loader from '../../ui/Loader';

const WageAnalysisChart = ({ selectedState, selectedYear }) => {
  const [jobData, setJobData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('top'); // 'top' or 'scatter'
  const [stateAverage, setStateAverage] = useState(0);
  
  useEffect(() => {
    const fetchJobData = async () => {
      if (!selectedState || !selectedYear) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api';
        
        // Use state/:state/:year endpoint to get wage data
        const response = await axios.get(`${serverBaseUrl}/state/${selectedState}/${selectedYear}`);
        
        if (response.data && response.data.length > 0) {
          // Calculate the state average wage across all occupations
          const allJobs = response.data;
          const totalWages = allJobs.reduce((sum, job) => sum + parseFloat(job.avgwage || 0), 0);
          const calculatedStateAverage = totalWages / allJobs.length;
          setStateAverage(calculatedStateAverage);
          
          // Get the top 10 highest paying jobs
          const jobsWithHighestWages = [...allJobs]
            .sort((a, b) => parseFloat(b.avgwage || 0) - parseFloat(a.avgwage || 0))
            .slice(0, 10);
          
          setJobData(jobsWithHighestWages);
        } else {
          setJobData([]);
          setStateAverage(0);
        }
      } catch (err) {
        console.error(`Error fetching wage data:`, err);
        setError(err.message || 'Failed to load wage data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [selectedState, selectedYear]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
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

  if (!jobData || jobData.length === 0) {
    return (
      <div className="text-center text-gray-400 p-4">
        <p>No wage data available for {selectedState} in {selectedYear}</p>
        <p className="mt-2 text-sm">Try a different year or state to see wage analysis.</p>
      </div>
    );
  }

  // Calculate the top 10 average (separate from state average)
  const topJobsAverage = jobData.reduce((sum, job) => sum + parseFloat(job.avgwage || 0), 0) / jobData.length;

  // Prepare bar chart data for top jobs by wage
  const barChartData = {
    labels: jobData.map(job => {
      // Truncate long occupation titles
      const title = job.occupationtitle;
      return title.length > 20 ? title.substring(0, 20) + '...' : title;
    }),
    datasets: [
      {
        label: 'State Average Wage',
        data: jobData.map(() => stateAverage),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        type: 'line',
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderDash: [5, 5],
      },
      {
        label: 'Average Annual Wage ($)',
        data: jobData.map(job => job.avgwage),
        backgroundColor: 'rgba(53, 162, 235, 0.7)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'white',
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            // Show full title on tooltip
            const index = tooltipItems[0].dataIndex;
            return jobData[index].occupationtitle;
          },
          label: (context) => {
            const value = context.raw;
            return `${context.dataset.label}: $${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: 'white',
          callback: (value) => {
            return '$' + (value/1000).toFixed(0) + 'k';
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        title: {
          display: true,
          text: 'Average Annual Wage',
          color: 'white'
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
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-medium text-mint">Top 10 Highest Paying Jobs</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('top')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === 'top' ? 'bg-mint/20 text-mint border border-mint' : 'bg-eerie-black/50 text-gray-400 border border-gray-700'
            }`}
          >
            Top Paying Jobs
          </button>
          <button 
            onClick={() => setViewMode('stat')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === 'stat' ? 'bg-mint/20 text-mint border border-mint' : 'bg-eerie-black/50 text-gray-400 border border-gray-700'
            }`}
          >
            Wage Statistics
          </button>
        </div>
      </div>
      <p className="text-gray-400 mb-4">
        {viewMode === 'top' 
          ? `Highest paying occupations in ${selectedState} (${selectedYear})`
          : `Wage distribution analysis for ${selectedState} (${selectedYear})`
        }
      </p>
      
      <div className="h-80">
        {viewMode === 'top' ? (
          <Bar data={barChartData} options={barChartOptions} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Wage Statistics */}
            <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-eerie-black/30 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm text-gray-400">State Average Wage</h4>
                  <p className="text-2xl font-bold text-mint mt-1">
                    ${Math.round(stateAverage).toLocaleString()}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Based on all occupations
                </p>
              </div>
              
              <div className="bg-eerie-black/30 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm text-gray-400">Highest Paying Job</h4>
                  <p className="text-lg font-bold text-white mt-1 line-clamp-2" title={jobData[0].occupationtitle}>
                    {jobData[0].occupationtitle}
                  </p>
                  <p className="text-mint font-semibold mt-1">
                    ${Math.round(jobData[0].avgwage).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="bg-eerie-black/30 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm text-gray-400">Top 10</h4>
                  <p className="text-lg font-bold text-white mt-1">
                    {(((topJobsAverage / stateAverage) - 1) * 100).toFixed(1)}% Above Average
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    Top 10 avg: ${Math.round(topJobsAverage).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Additional wage data table */}
            <div className="col-span-1 md:col-span-3 overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-eerie-black/60">
                  <tr>
                    <th scope="col" className="px-4 py-3">Rank</th>
                    <th scope="col" className="px-4 py-3">Occupation</th>
                    <th scope="col" className="px-4 py-3">Average Wage</th>
                    <th scope="col" className="px-4 py-3">% Above State Average</th>
                  </tr>
                </thead>
                <tbody>
                  {jobData.map((job, index) => {
                    // Calculate percentage above state average (not top 10 average)
                    const percentAboveAvg = ((parseFloat(job.avgwage) / stateAverage) - 1) * 100;
                    
                    return (
                      <tr key={index} className="border-b border-eerie-black/50 hover:bg-eerie-black/40">
                        <td className="px-4 py-3 font-medium">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{job.occupationtitle}</td>
                        <td className="px-4 py-3">${Math.round(job.avgwage).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={percentAboveAvg >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {percentAboveAvg >= 0 ? '+' : ''}{percentAboveAvg.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WageAnalysisChart; 