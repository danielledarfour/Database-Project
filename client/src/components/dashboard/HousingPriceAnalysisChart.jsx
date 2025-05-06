import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Loader from '../../ui/Loader';

const HousingPriceAnalysisChart = ({ selectedState, selectedCity }) => {
  const [housingData, setHousingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Property types to fetch and display
  const propertyTypes = [
    'Single Family Residential',
    'All Residential',
    'Condo/Co-op',
    'Multi-Family (2-4 Unit)'
  ];
  
  useEffect(() => {
    const fetchHousingData = async () => {
      // Skip if no city is selected
      if (!selectedState || !selectedCity) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api';
        
        // First try to fetch from specific housing endpoint with property type
        const requests = propertyTypes.map(propertyType => 
          axios.get(`${serverBaseUrl}/housing/${selectedState}/${selectedCity}/${encodeURIComponent(propertyType)}`)
            .catch(err => {
              console.log(`No data for ${propertyType}`);
              return { data: [] }; // Return empty data on error
            })
        );
        
        const responses = await Promise.all(requests);
        let combinedData = responses.map((response, index) => {
          if (response.data && response.data.length > 0) {
            const data = response.data[0];
            return {
              propertyType: propertyTypes[index],
              listPrice: data.medianlistprice || 0,
              salePrice: data.mediansaleprice || 0,
              priceDifference: data.pricedifference || 0
            };
          }
          return {
            propertyType: propertyTypes[index],
            listPrice: 0,
            salePrice: 0,
            priceDifference: 0,
          };
        });
        
        // If we didn't get good data from the first endpoint, try the state endpoint
        if (combinedData.every(item => item.listPrice === 0 && item.salePrice === 0)) {
          try {
            const stateResponse = await axios.get(`${serverBaseUrl}/state/${selectedState}`);
            
            if (stateResponse.data && stateResponse.data.length > 0) {
              // Filter for the selected city
              const cityData = stateResponse.data.filter(
                item => item.city.toLowerCase() === selectedCity.toLowerCase()
              );
              
              if (cityData.length > 0) {
                combinedData = propertyTypes.map(type => {
                  // Find matching property type in the data
                  const match = cityData.find(
                    item => item.propertytype.toLowerCase() === type.toLowerCase()
                  );
                  
                  if (match) {
                    return {
                      propertyType: type,
                      listPrice: parseFloat(match.avgsaleprice) * 1.05, // Estimate list price as 5% above sale
                      salePrice: parseFloat(match.avgsaleprice),
                      priceDifference: -parseFloat(match.avgsaleprice) * 0.05, // Negative means below list
                      homesSold: parseInt(match.totalhomessold)
                    };
                  }
                  
                  return {
                    propertyType: type,
                    listPrice: 0,
                    salePrice: 0,
                    priceDifference: 0,
                    homesSold: 0
                  };
                });
              }
            }
          } catch (stateErr) {
            console.error(`Error fetching state housing data:`, stateErr);
            // Continue with the original data if this fails
          }
        }
        
        setHousingData(combinedData.filter(item => item.listPrice > 0 || item.salePrice > 0));
      } catch (err) {
        console.error(`Error fetching housing data:`, err);
        setError(err.message || 'Failed to load housing data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHousingData();
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

  if (!housingData || housingData.length === 0) {
    return (
      <div className="text-center text-gray-400 p-4">
        <p>{selectedCity ? `No housing data available for ${selectedCity}, ${selectedState}` : 'Select a city to view housing price analysis'}</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: housingData.map(item => item.propertyType),
    datasets: [
      {
        label: 'Median List Price',
        data: housingData.map(item => item.listPrice),
        backgroundColor: 'rgba(0, 46, 250, 0.7)',
        borderColor: 'rgb(53, 162, 58)',
        borderWidth: 1,
      },
      {
        label: 'Median Sale Price',
        data: housingData.map(item => item.salePrice),
        backgroundColor: 'rgba(75, 192, 79, 0.4)',
        borderColor: 'rgb(252, 252, 252)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
            const value = context.raw;
            return `${context.dataset.label}: $${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white',
          callback: (value) => {
            return '$' + value.toLocaleString();
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
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
      <h3 className="text-lg font-medium text-mint mb-1">Property Price Analysis</h3>
      <p className="text-gray-400 mb-4">
        Compare listing vs. sale prices across property types in {selectedCity}, {selectedState}
      </p>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Additional statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {housingData.map((item, index) => (
          <div key={index} className="bg-eerie-black/50 p-3 rounded-lg border border-white/10">
            <h4 className="text-xs font-semibold text-mint truncate">{item.propertyType}</h4>
            <p className="text-xs text-gray-400 mt-1">Price Difference</p>
            <p className={`text-lg font-bold ${item.priceDifference >= 0 ? 'text-red-400' : 'text-green-400'}`}>
              ${Math.abs(item.priceDifference).toLocaleString()}
              <span className="text-xs ml-1">
                ({item.priceDifference >= 0 ? 'above' : 'below'} list)
              </span>
            </p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default HousingPriceAnalysisChart; 