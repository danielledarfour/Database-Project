import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Loader from '../../ui/Loader';

const PopularCitiesChart = ({ selectedState }) => {
  const [citiesData, setCitiesData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCitiesData = async () => {
      if (!selectedState) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${serverBaseUrl}/state/${selectedState}`);
        
        if (response.data && response.data.length > 0) {
          // Group data by city and aggregate total homes sold
          const cityMap = new Map();
          
          response.data.forEach(item => {
            const city = item.city;
            const homesCount = parseInt(item.totalhomessold) || 0;
            const avgPrice = parseFloat(item.avgsaleprice) || 0;
            
            if (city && homesCount > 0) {
              if (cityMap.has(city)) {
                const current = cityMap.get(city);
                cityMap.set(city, {
                  totalHomes: current.totalHomes + homesCount,
                  prices: [...current.prices, avgPrice],
                  propertyTypes: [...current.propertyTypes, item.propertytype]
                });
              } else {
                cityMap.set(city, {
                  totalHomes: homesCount,
                  prices: [avgPrice],
                  propertyTypes: [item.propertytype]
                });
              }
            }
          });
          
          // Convert map to array and sort by total homes sold
          const sortedCities = Array.from(cityMap.entries())
            .map(([city, data]) => ({
              city,
              totalHomes: data.totalHomes,
              avgPrice: data.prices.reduce((a, b) => a + b, 0) / data.prices.length,
              propertyTypes: data.propertyTypes
            }))
            .sort((a, b) => b.totalHomes - a.totalHomes);
          
          // Take top 10 cities
          setCitiesData(sortedCities.slice(0, 10));
        } else {
          setCitiesData([]);
        }
      } catch (err) {
        console.error(`Error fetching cities data:`, err);
        setError(err.message || 'Failed to load cities data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCitiesData();
  }, [selectedState]);

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

  if (!citiesData || citiesData.length === 0) {
    return (
      <div className="text-center text-gray-400 p-4">
        <p>No cities data available for {selectedState}</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: citiesData.map(item => item.city),
    datasets: [
      {
        label: 'Total Homes Sold',
        data: citiesData.map(item => item.totalHomes),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
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
            const city = citiesData[index];
            return [
              `Total Homes Sold: ${city.totalHomes.toLocaleString()}`,
              `Avg. Price: $${Math.round(city.avgPrice).toLocaleString()}`
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
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'K';
            }
            return value;
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        title: {
          display: true,
          text: 'Total Homes Sold',
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
      <h3 className="text-lg font-medium text-mint mb-1">Most Popular Residential Cities in {selectedState}</h3>
      <p className="text-gray-400 mb-4">
        Ranking cities by total number of home sales
      </p>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Additional statistics */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-eerie-black/60">
            <tr>
              <th scope="col" className="px-4 py-3">Rank</th>
              <th scope="col" className="px-4 py-3">City</th>
              <th scope="col" className="px-4 py-3">Total Homes Sold</th>
              <th scope="col" className="px-4 py-3">Average Price</th>
            </tr>
          </thead>
          <tbody>
            {citiesData.map((city, index) => (
              <tr key={index} className={`border-b ${index === 0 ? 'border-t' : 'border-eerie-black/50'} hover:bg-eerie-black/40`}>
                <td className={`px-4 py-3 font-medium ${index === 0 ? 'text-mint' : 'text-white/80'}`}>{index + 1}</td>
                <td className={`px-4 py-3 font-medium ${index === 0 ? 'text-mint' : 'text-white/80'}`}>{city.city}</td>
                <td className={`px-4 py-3 ${index === 0 ? 'text-mint' : 'text-white/80'}`}>{city.totalHomes.toLocaleString()}</td>
                <td className={`px-4 py-3 ${index === 0 ? 'text-mint' : 'text-white/80'}`}>${Math.round(city.avgPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PopularCitiesChart; 