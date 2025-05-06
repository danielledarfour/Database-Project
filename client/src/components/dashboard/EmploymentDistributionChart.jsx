import React, { useState, useEffect } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import Loader from '../../ui/Loader';

/**
 * EmploymentDistributionChart - Shows top occupations by percentage of workforce
 * 
 * @param {Object} props - Component props
 * @param {string} props.selectedState - The selected state
 * @returns {JSX.Element} Pie chart of employment distribution
 */
const EmploymentDistributionChart = ({ selectedState }) => {
  const [occupationData, setOccupationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('pie'); // 'pie' or 'doughnut'

  // Fetch data using Route 9: /jobs/:state
  useEffect(() => {
    const fetchOccupationData = async () => {
      if (!selectedState) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${serverBaseUrl}/jobs/${selectedState}`);
        
        if (response.data && response.data.length > 0) {
          // Filter out occupations with very small percentages for better visualization
          const significantOccupations = response.data.filter(
            job => parseFloat(job.pctoftotalemployment) >= 0.5
          );
          
          // If we have more than 8 occupations, limit to top 8 and combine the rest
          let processedData = significantOccupations;
          
          if (significantOccupations.length > 8) {
            const topOccupations = significantOccupations.slice(0, 8);
            const otherOccupations = significantOccupations.slice(8);
            
            const otherTotal = otherOccupations.reduce(
              (sum, job) => sum + parseFloat(job.pctoftotalemployment || 0), 
              0
            );
            
            if (otherTotal > 0) {
              processedData = [
                ...topOccupations,
                {
                  occupationtitle: 'Other Occupations',
                  pctoftotalemployment: otherTotal.toFixed(2)
                }
              ];
            } else {
              processedData = topOccupations;
            }
          }
          
          setOccupationData(processedData);
        } else {
          setOccupationData([]);
        }
      } catch (err) {
        console.error(`Error fetching occupation data:`, err);
        setError(err.message || 'Failed to load occupation data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOccupationData();
  }, [selectedState]);

  // Generate chart colors with a vibrant palette
  const generateChartColors = (count) => {
    const baseColors = [
      { bg: 'rgba(61, 217, 214, 0.7)', border: 'rgba(61, 217, 214, 1)' },  // Turquoise
      { bg: 'rgba(61, 170, 101, 0.7)', border: 'rgba(61, 170, 101, 1)' },  // Green
      { bg: 'rgba(43, 107, 57, 0.7)', border: 'rgba(43, 107, 57, 1)' },    // Dark Green
      { bg: 'rgba(75, 192, 192, 0.7)', border: 'rgba(75, 192, 192, 1)' },  // Teal
      { bg: 'rgba(54, 162, 235, 0.7)', border: 'rgba(54, 162, 235, 1)' },  // Blue
      { bg: 'rgba(102, 51, 153, 0.7)', border: 'rgba(102, 51, 153, 1)' },  // Purple
      { bg: 'rgba(255, 159, 64, 0.7)', border: 'rgba(255, 159, 64, 1)' },  // Orange
      { bg: 'rgba(255, 99, 132, 0.7)', border: 'rgba(255, 99, 132, 1)' },  // Red
      { bg: 'rgba(100, 100, 100, 0.7)', border: 'rgba(100, 100, 100, 1)' } // Grey (for "Other")
    ];
    
    // Return colors, repeating if needed
    return Array(count).fill(0).map((_, i) => baseColors[i % baseColors.length]);
  };

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!occupationData || occupationData.length === 0) {
      return {
        labels: ['No Data Available'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['rgba(200, 200, 200, 0.3)'],
            borderColor: ['rgba(200, 200, 200, 1)'],
            borderWidth: 1,
          },
        ],
      };
    }
    
    const colors = generateChartColors(occupationData.length);
    
    return {
      labels: occupationData.map(job => {
        // Truncate long titles for better display
        const title = job.occupationtitle;
        return title.length > 25 ? title.substring(0, 22) + '...' : title;
      }),
      datasets: [
        {
          label: 'Workforce Percentage',
          data: occupationData.map(job => parseFloat(job.pctoftotalemployment || 0)),
          backgroundColor: colors.map(c => c.bg),
          borderColor: colors.map(c => c.border),
          borderWidth: 1,
        },
      ],
    };
  }, [occupationData]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: 'white',
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${value.toFixed(1)}% of workforce`;
          }
        }
      }
    },
  };

  if (isLoading) {
    return (
      <div className="h-64 flex justify-center items-center">
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

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-medium text-mint">Employment by Sector</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 text-xs rounded ${
              chartType === 'pie' ? 'bg-mint/20 text-mint border border-mint' : 'bg-eerie-black/50 text-gray-400 border border-gray-700'
            }`}
          >
            Pie
          </button>
          <button 
            onClick={() => setChartType('doughnut')}
            className={`px-3 py-1 text-xs rounded ${
              chartType === 'doughnut' ? 'bg-mint/20 text-mint border border-mint' : 'bg-eerie-black/50 text-gray-400 border border-gray-700'
            }`}
          >
            Doughnut
          </button>
        </div>
      </div>
      <p className="text-gray-400 mb-4">Distribution of employment across major occupations for {selectedState}</p>
      
      <div className="h-64">
        {occupationData && occupationData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No employment data available for {selectedState}</p>
          </div>
        ) : (
          <>
            {chartType === 'pie' ? (
              <Pie data={chartData} options={chartOptions} />
            ) : (
              <Doughnut data={chartData} options={chartOptions} />
            )}
          </>
        )}
      </div>
      
      {/* Show percentage table for clarity */}
      {occupationData && occupationData.length > 0 && (
        <div className="mt-6 bg-eerie-black/40 rounded-md border border-gray-800 p-3">
          <h4 className="text-sm font-medium text-mint mb-2">Top Occupations by Workforce Percentage</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-gray-300">
              <thead className="text-xs uppercase bg-eerie-black/60">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left">Occupation</th>
                  <th scope="col" className="px-3 py-2 text-right">Workforce %</th>
                </tr>
              </thead>
              <tbody>
                {occupationData.map((job, index) => (
                  <tr key={index} className="border-b border-eerie-black/30">
                    <td className="px-3 py-2 whitespace-normal">{job.occupationtitle}</td>
                    <td className="px-3 py-2 text-right font-medium text-mint">
                      {parseFloat(job.pctoftotalemployment).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmploymentDistributionChart; 