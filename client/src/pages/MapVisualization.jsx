import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import USAMap from "../components/USAMap";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Note: React Router warnings about future changes in v7 can be safely ignored for now
// They're just letting us know about upcoming changes in React Router v7
// When upgrading to React Router v7, we'll need to update our code accordingly

const MapVisualization = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [dataType, setDataType] = useState("crime");
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState("2023");
  const [stateData, setStateData] = useState({});
  const [housingData, setHousingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapDataType, setMapDataType] = useState('housing');
  const location = useLocation();

  // Note about Google Maps API key
  const hasApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY !== undefined;

  // Fetch state data when component mounts or when filters change
  useEffect(() => {
    fetchStateData();
  }, [dataType, timeframe]);

  // Parse query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const state = queryParams.get('state');
    const city = queryParams.get('city');
    const propertyType = queryParams.get('type');

    if (state && city && propertyType) {
      setSelectedState(state);
      fetchHousingData(state, city, propertyType);
    }
  }, [location]);

  // TODO: Replace with actual API call
  const fetchStateData = async () => {
    setLoading(true);
    try {
      // TODO: Implement API fetch for state data
      const serverBaseUrl =
        import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

      // TODO: Uncomment and implement once backend is ready
      // let endpoint = dataType === 'crime' ? 'crime-data' : 'employment-data';
      // const response = await fetch(`${serverBaseUrl}/api/${endpoint}/by-state?year=${year}`);
      // const data = await response.json();
      // setStateData(data);

      // Temporary empty placeholder data
      setStateData({
        California: {
          crimeRate: 0,
          employmentRate: 0,
          topCrimes: [],
          topJobs: [],
        },
        Texas: {
          crimeRate: 0,
          employmentRate: 0,
          topCrimes: [],
          topJobs: [],
        },
        "New York": {
          crimeRate: 0,
          employmentRate: 0,
          topCrimes: [],
          topJobs: [],
        },
        Florida: {
          crimeRate: 0,
          employmentRate: 0,
          topCrimes: [],
          topJobs: [],
        },
      });

      setTimeout(() => setLoading(false), 500); // Simulate API delay
    } catch (error) {
      console.error("Error fetching state data:", error);
      setLoading(false);
    }
  };

  // Function to fetch housing data
  const fetchHousingData = async (state, city, propertyType) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/housing/${state}/${city}/${encodeURIComponent(propertyType)}`);
      setHousingData(response.data);
    } catch (err) {
      console.error('Error fetching housing data:', err);
      setError('Failed to load housing data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle state click - Moved to USAMap component
  const handleStateSelection = async (state) => {
    setLoading(true);
    try {
      // TODO: Implement API fetch for detailed state data
      setSelectedState(state);
    } catch (error) {
      console.error(`Error fetching details for ${state}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Change data type (crime or employment)
  const handleDataTypeChange = (type) => {
    setDataType(type);
    // Data will be fetched in useEffect when dataType changes
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!housingData || housingData.length === 0) return null;

    const result = housingData[0];
    
    return {
      labels: ['Median List Price', 'Median Sale Price', 'Price Difference'],
      datasets: [
        {
          label: `${result.city} ${result.propertytype} Housing Prices`,
          data: [
            result.medianlistprice,
            result.mediansaleprice,
            result.pricedifference
          ],
          backgroundColor: [
            'rgba(16, 185, 129, 0.6)', // mint
            'rgba(25, 93, 48, 0.6)',   // hunter green
            'rgba(59, 130, 246, 0.6)'  // blue
          ],
          borderColor: [
            'rgb(16, 185, 129)',
            'rgb(25, 93, 48)',
            'rgb(59, 130, 246)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return '$' + context.raw.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-eerie-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Interactive Housing Data Map</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore housing prices across different states and cities. Click on a state to view details.
            </p>
          </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Column */}
          <div className="lg:col-span-2">
            <div className="bg-eerie-black/50 rounded-lg p-6 shadow-lg border border-mint/20">
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-mint/30 pb-2">
                {selectedState ? `${selectedState} - Housing Data` : 'United States'}
              </h2>
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        mapDataType === 'housing' 
                          ? 'bg-mint text-white' 
                          : 'bg-eerie-black/70 text-white/70 hover:bg-eerie-black hover:text-white'
                      }`}
                      onClick={() => setMapDataType('housing')}
                    >
                      Housing Prices
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        mapDataType === 'sales' 
                          ? 'bg-mint text-white' 
                          : 'bg-eerie-black/70 text-white/70 hover:bg-eerie-black hover:text-white'
                      }`}
                      onClick={() => setMapDataType('sales')}
                    >
                      Sales Activity
                    </button>
            </div>
                  <div className="text-white/70 text-sm">
                    {selectedState ? `Showing data for ${selectedState}` : 'Click on a state to view details'}
            </div>
          </div>
        </div>

              {/* Map Component */}
              <USAMap setSelectedState={handleStateSelection} dataType={mapDataType === 'housing' ? 'housing' : 'crime'} />
              </div>
          </div>

          {/* Data Detail Column */}
          <div className="lg:col-span-1">
            <div className="bg-eerie-black/50 rounded-lg p-6 shadow-lg border border-mint/20 h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mint"></div>
                </div>
              ) : error ? (
                <div className="text-red-400 p-4 bg-red-900/20 rounded-md">
                  {error}
        </div>
              ) : housingData && housingData.length > 0 ? (
              <div>
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-mint/30 pb-2">
                    {housingData[0].city}, {selectedState}
                </h2>
                  <div className="mb-6">
                    <div className="bg-eerie-black/70 p-4 rounded-md mb-4 border border-mint/20">
                      <h3 className="text-white text-lg font-medium mb-1">{housingData[0].propertytype}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                          <p className="text-gray-400 text-sm">Median List Price</p>
                          <p className="text-xl font-bold text-mint">${housingData[0].medianlistprice.toLocaleString()}</p>
                      </div>
                      <div>
                          <p className="text-gray-400 text-sm">Median Sale Price</p>
                          <p className="text-xl font-bold text-mint">${housingData[0].mediansaleprice.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-gray-400 text-sm">Price Difference</p>
                        <p className="text-xl font-bold text-mint">${housingData[0].pricedifference.toLocaleString()}</p>
                </div>
              </div>

                    <div className="h-64 mb-6">
                      <Bar data={prepareChartData()} options={chartOptions} />
              </div>

                    <div className="bg-eerie-black/70 p-4 rounded-md border border-mint/20">
                      <h3 className="text-white text-md font-medium mb-2">Market Analysis</h3>
                      <p className="text-gray-300 text-sm">
                        The difference between list and sale prices indicates 
                        {housingData[0].pricedifference > 0 
                          ? ' a seller\'s market where properties are selling below asking price.'
                          : ' a buyer\'s market where properties are selling above asking price.'}
                      </p>
                      <div className="mt-4 flex justify-between text-mint text-sm">
                        <button 
                          className="hover:underline"
                          onClick={() => window.open(`https://www.zillow.com/homes/${housingData[0].city}-${selectedState}`, '_blank')}
                        >
                          View on Zillow
                        </button>
                        <button 
                          className="hover:underline"
                          onClick={() => window.open(`https://www.realtor.com/realestateandhomes-search/${housingData[0].city}_${selectedState}`, '_blank')}
                        >
                          View on Realtor.com
                        </button>
                        </div>
                    </div>
                  </div>
                </div>
              ) : selectedState ? (
                <div className="text-center p-6">
                  <h3 className="text-xl font-medium text-white mb-3">
                    {selectedState}
              </h3>
                  <p className="text-gray-300 mb-4">
                    No housing data available for this selection. Try selecting a different city or property type.
                  </p>
                  <button
                    className="px-4 py-2 bg-mint text-white rounded-md hover:bg-mint/90 transition-colors"
                    onClick={() => window.history.back()}
                  >
                    Go Back to Search
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-mint/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <h3 className="text-xl font-medium text-white mb-2">Select a State</h3>
                  <p className="text-gray-400">
                    Click on any state on the map to view housing data and market analysis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapVisualization;
