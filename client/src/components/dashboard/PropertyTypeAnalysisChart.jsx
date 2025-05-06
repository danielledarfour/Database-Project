import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import Loader from '../../ui/Loader';

const PropertyTypeAnalysisChart = ({ selectedState, selectedCity }) => {
  const [propertyData, setPropertyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('bar'); // 'bar' or 'doughnut'
  
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!selectedState || !selectedCity) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${serverBaseUrl}/state/${selectedState}`);
        
        if (response.data && response.data.length > 0) {
          // Filter for the selected city
          const cityData = response.data.filter(
            item => item.city.toLowerCase() === selectedCity.toLowerCase()
          );
          
          if (cityData.length > 0) {
            // Create property type analysis
            const propertyTypes = cityData.map(item => ({
              type: item.propertytype,
              price: parseFloat(item.avgsaleprice) || 0,
              homesSold: parseInt(item.totalhomessold) || 0,
              popularity: parseInt(item.totalhomessold) || 0 // Initial value, will be adjusted based on market share
            })).filter(item => item.price > 0 && item.homesSold > 0);
            
            // Calculate total homes sold to determine market share
            const totalHomesSold = propertyTypes.reduce((sum, item) => sum + item.homesSold, 0);
            
            // Add market share and sort by price (cheapest first)
            const processedData = propertyTypes.map(item => ({
              ...item,
              marketShare: (item.homesSold / totalHomesSold) * 100,
              // Adjust popularity score based on market share and inverse of price (higher for cheaper homes)
              popularityScore: (item.homesSold / totalHomesSold) * (1000000 / item.price)
            })).sort((a, b) => a.price - b.price);
            
            setPropertyData(processedData);
          } else {
            setPropertyData([]);
          }
        } else {
          setPropertyData([]);
        }
      } catch (err) {
        console.error(`Error fetching property type data:`, err);
        setError(err.message || 'Failed to load property type data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [selectedState, selectedCity]);

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

  if (!propertyData || propertyData.length === 0) {
    return (
      <div className="text-center text-gray-400 p-4">
        <p>No property type data available for {selectedCity}, {selectedState}</p>
      </div>
    );
  }

  // Find most popular property type (highest popularity score)
  const mostPopular = [...propertyData].sort((a, b) => b.popularityScore - a.popularityScore)[0];

  // Colors for chart
  const barColors = [
    'rgba(75, 192, 192, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(255, 205, 86, 0.7)',
  ];
  
  const doughnutColors = [
    'rgba(75, 192, 192, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(255, 205, 86, 0.7)',
  ];

  // Prepare chart data
  const barChartData = {
    labels: propertyData.map(item => item.type),
    datasets: [
      {
        label: 'Average Sale Price',
        data: propertyData.map(item => item.price),
        backgroundColor: propertyData.map((_, index) => barColors[index % barColors.length]),
        borderColor: propertyData.map((_, index) => barColors[index % barColors.length].replace('0.7', '1')),
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const doughnutChartData = {
    labels: propertyData.map(item => item.type),
    datasets: [
      {
        label: 'Market Share',
        data: propertyData.map(item => item.marketShare),
        backgroundColor: propertyData.map((_, index) => doughnutColors[index % doughnutColors.length]),
        borderColor: 'rgba(26, 34, 38, 0.8)',
        borderWidth: 1,
        hoverOffset: 10
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const property = propertyData[index];
            return [
              `Price: $${property.price.toLocaleString()}`,
              `Market Share: ${property.marketShare.toFixed(1)}%`,
              `Homes Sold: ${property.homesSold.toLocaleString()}`
            ];
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
          text: 'Average Sale Price',
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

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const property = propertyData[index];
            return [
              `${property.type}: ${property.marketShare.toFixed(1)}%`,
              `Avg. Price: $${property.price.toLocaleString()}`,
              `Homes Sold: ${property.homesSold.toLocaleString()}`
            ];
          }
        }
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-medium text-mint">Property Type Analysis</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('bar')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === 'bar' ? 'bg-mint/20 text-mint border border-mint' : 'bg-eerie-black/50 text-gray-400 border border-gray-700'
            }`}
          >
            Price Comparison
          </button>
          <button 
            onClick={() => setViewMode('doughnut')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === 'doughnut' ? 'bg-mint/20 text-mint border border-mint' : 'bg-eerie-black/50 text-gray-400 border border-gray-700'
            }`}
          >
            Market Share
          </button>
        </div>
      </div>
      <p className="text-gray-400 mb-4">
        {viewMode === 'bar' 
          ? `Property types in ${selectedCity} sorted by price (cheapest first)`
          : `Market share of property types in ${selectedCity}`
        }
      </p>
      
      <div className="h-80">
        {viewMode === 'bar' ? (
          <Bar data={barChartData} options={barOptions} />
        ) : (
          <Doughnut data={doughnutChartData} options={doughnutOptions} />
        )}
      </div>
      
      {/* Most popular property type highlight */}
      {mostPopular && (
        <div className="mt-6 bg-eerie-black/30 p-4 rounded-lg border border-mint/40">
          <h3 className="text-base font-medium text-mint mb-2">Most Popular Property Type</h3>
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <p className="text-lg font-bold text-white">{mostPopular.type}</p>
              <p className="text-sm text-gray-300 mt-1">
                With {mostPopular.marketShare.toFixed(1)}% market share and {mostPopular.homesSold.toLocaleString()} homes sold
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <p className="text-sm text-gray-400">Average Price</p>
              <p className="text-lg font-bold text-mint">${mostPopular.price.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Data table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-eerie-black/60">
            <tr>
              <th scope="col" className="px-4 py-3">Property Type</th>
              <th scope="col" className="px-4 py-3">Price</th>
              <th scope="col" className="px-4 py-3">Homes Sold</th>
              <th scope="col" className="px-4 py-3">Market Share</th>
            </tr>
          </thead>
          <tbody>
            {propertyData.map((property, index) => (
              <tr key={index} className="border-b border-eerie-black/50 hover:bg-eerie-black/40">
                <td className="px-4 py-3 font-medium">{property.type}</td>
                <td className="px-4 py-3">${property.price.toLocaleString()}</td>
                <td className="px-4 py-3">{property.homesSold.toLocaleString()}</td>
                <td className="px-4 py-3">{property.marketShare.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyTypeAnalysisChart; 