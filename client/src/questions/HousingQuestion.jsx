import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bar } from 'react-chartjs-2';
import axios from "axios";
import Input from "../ui/Input";
import cityData from "../utils/cityData";

// Available property types
const propertyTypes = [
  "Condo/Co-op",
  "Multi-Family (2-4 Unit)",
  "Single Family Residential",
  "Townhouse",
  "All Residential"
];

// All US states for dropdown
const usStates = Object.entries(cityData).map(([name, data]) => ({
  id: data.id,
  name: name
}));

// Adjacent/nearby states for recommendations
const nearbyStates = {
  'Alabama': ['Florida', 'Georgia', 'Tennessee', 'Mississippi'],
  'Alaska': ['Washington', 'Hawaii', 'Oregon'],
  'Arizona': ['California', 'Nevada', 'Utah', 'New Mexico'],
  // ... remaining state relationships would be here
};

const HousingQuestion = ({ showMap, setShowMap }) => {
  // Search filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  
  // Results state
  const [availableCities, setAvailableCities] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cities when state changes using our cityData utility
  useEffect(() => {
    if (selectedState && cityData[selectedState]) {
      setAvailableCities(cityData[selectedState].cities);
    } else {
      setAvailableCities([]);
    }
  }, [selectedState]);

  // Handle search
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    
    if (!selectedState || !selectedCity || !selectedPropertyType) {
      setError("Please select a state, city, and property type");
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await axios.get(`/api/housing/${selectedState}/${selectedCity}/${encodeURIComponent(selectedPropertyType)}`);
      setSearchResults(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching housing data:", err);
      setError("Error fetching housing data. Please try again.");
      setSearchResults([]);
      setIsLoading(false);
    }
  };

  // Handle custom search
  const handleCustomSearch = (value) => {
    setSearchQuery(value);
    // Additional filtering logic could be added here
  };

  // Prepare chart data when search results are available
  const prepareChartData = () => {
    if (!searchResults || searchResults.length === 0) return null;
    
    const result = searchResults[0]; // Take the first result
    
    // Determine color for price difference based on value
    const priceDifferenceColor = result.pricedifference >= 0 ? 
      'rgba(16, 185, 129, 0.6)' : // mint for positive
      'rgba(239, 68, 68, 0.6)';   // red for negative
    
    const priceDifferenceBorderColor = result.pricedifference >= 0 ? 
      'rgb(16, 185, 129)' : // mint for positive
      'rgb(239, 68, 68)';   // red for negative
    
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
            'rgba(16, 185, 129, 0.6)', // mint for list price
            'rgba(25, 93, 48, 0.6)',   // hunter green for sale price
            priceDifferenceColor       // conditional color for price difference
          ],
          borderColor: [
            'rgb(16, 185, 129)',
            'rgb(25, 93, 48)',
            priceDifferenceBorderColor // conditional border color for price difference
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

  // Helper function to get a different city from the same state
  const getDifferentCity = (state, currentCity) => {
    if (!state || !cityData[state]) return null;
    
    const cities = cityData[state].cities.filter(city => city !== currentCity);
    if (cities.length === 0) return null;
    
    // Return a random city from the filtered list
    return cities[Math.floor(Math.random() * cities.length)];
  };
  
  // Helper function to get a nearby state and a city from that state
  const getNearbyStateAndCity = (currentState) => {
    if (!currentState || !nearbyStates[currentState]) return { state: null, city: null };
    
    const possibleStates = nearbyStates[currentState];
    if (possibleStates.length === 0) return { state: null, city: null };
    
    // Get a random nearby state
    const nearbyState = possibleStates[Math.floor(Math.random() * possibleStates.length)];
    
    // Get a random city from that state
    if (!cityData[nearbyState] || cityData[nearbyState].cities.length === 0) {
      return { state: nearbyState, city: null };
    }
    
    const randomCity = cityData[nearbyState].cities[Math.floor(Math.random() * cityData[nearbyState].cities.length)];
    return { state: nearbyState, city: randomCity };
  };

  return (
    <>
      {/* Housing Search Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        {/* Custom Search Input */}
        <div className="lg:col-span-5">
          <label className="block text-sm font-medium text-white mb-1">
            Search Locations
          </label>
          <Input 
            onChange={handleCustomSearch} 
            hideGrid={true}
            className="bg-transparent border-mint/50 focus:border-mint"
            overrideStyles={true}
          />
        </div>

        {/* State Selection */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-white mb-1">
            Select State
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity(""); // Reset city when state changes
            }}
            className="w-full p-2 rounded-md bg-eerie-black text-white border border-mint focus:outline-none focus:ring-2 focus:ring-mint"
            required
          >
            <option value="">Select a state</option>
            {usStates.map((state) => (
              <option key={state.id} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Selection */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-white mb-1">
            Select City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full p-2 rounded-md bg-eerie-black text-white border border-mint focus:outline-none focus:ring-2 focus:ring-mint"
            required
            disabled={!selectedState}
          >
            <option value="">Select a city</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Selection */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-white mb-1">
            Property Type
          </label>
          <select
            value={selectedPropertyType}
            onChange={(e) => setSelectedPropertyType(e.target.value)}
            className="w-full p-2 rounded-md bg-eerie-black text-white border border-mint focus:outline-none focus:ring-2 focus:ring-mint"
            required
          >
            <option value="">Select property type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-1">
          <button
            onClick={handleSearch}
            className="w-full bg-mint hover:bg-mint/90 text-white py-3 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>

      {/* Map Toggle Button */}
      <div className="mt-4 flex justify-end">
        <button
          className="px-3 py-2 bg-eerie-black border border-mint text-mint text-sm rounded-md hover:bg-mint hover:text-white transition-colors"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? "Hide Map" : "Show Map"}
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200">
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className={`container mx-auto px-4 py-6 flex flex-col ${showMap ? 'lg:flex-row' : ''} gap-6 relative z-10`}>
        {/* Map Section */}
        {showMap && (
          <div className={`${searchResults.length > 0 ? 'lg:w-1/2' : 'w-full'} bg-eerie-black/50 rounded-lg border border-mint/20 p-4 h-[400px] lg:h-auto relative z-50`}>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-mint/30 pb-2">
              Location Map
            </h2>
            <div className="h-[300px] bg-eerie-black/70 rounded-lg border border-mint/10 flex items-center justify-center relative z-50">
              {selectedState && selectedCity ? (
                <iframe
                  title="Location Map"
                  className="w-full h-full rounded-lg relative z-50"
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(selectedCity + ", " + selectedState)}`}
                  allowFullScreen
                  style={{position: 'relative', zIndex: 999}}
                ></iframe>
              ) : (
                <div className="text-center text-white/60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-3 text-mint/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>Select a state and city to view on the map</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Results Section */}
        {searchResults && searchResults.length > 0 && (
          <div className={`${showMap ? 'lg:w-1/2' : 'w-full'} relative z-30`}>
            <div className="bg-eerie-black/90 rounded-lg shadow-lg border border-mint/30 p-6">
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-mint/30 pb-2">
                {searchResults[0].city}, {selectedState} - {searchResults[0].propertytype}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-eerie-black/50 p-4 rounded-md border border-mint/20">
                  <h3 className="text-white text-sm font-medium mb-1">Median List Price</h3>
                  <p className="text-2xl font-bold text-mint">${searchResults[0].medianlistprice.toLocaleString()}</p>
                </div>
                
                <div className="bg-eerie-black/50 p-4 rounded-md border border-mint/20">
                  <h3 className="text-white text-sm font-medium mb-1">Median Sale Price</h3>
                  <p className="text-2xl font-bold text-mint">${searchResults[0].mediansaleprice.toLocaleString()}</p>
                </div>
                
                <div className="bg-eerie-black/50 p-4 rounded-md border border-mint/20">
                  <h3 className="text-white text-sm font-medium mb-1">Price Difference</h3>
                  <p className={`text-2xl font-bold ${searchResults[0].pricedifference >= 0 ? 'text-mint' : 'text-red-500'}`}>
                    {searchResults[0].pricedifference >= 0 ? '+' : '-'}${Math.abs(searchResults[0].pricedifference).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="h-64 mb-4">
                <Bar data={prepareChartData()} options={chartOptions} />
              </div>
              
              <div className="text-sm text-white/70 mt-2">
                <p>Data analysis shows the difference between listing and sale prices, indicating market demand and negotiation trends in this area.</p>
              </div>

              {/* View Options */}
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-mint/20">
                <Link
                  to={`/map?state=${selectedState}&city=${searchResults[0].city}&type=${searchResults[0].propertytype}`}
                  className="bg-mint hover:bg-mint/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  View on Interactive Map
                </Link>
                
                <button
                  onClick={() => window.open(`https://www.zillow.com/homes/${searchResults[0].city}-${selectedState}`, '_blank')}
                  className="bg-eerie-black hover:bg-eerie-black/80 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-mint"
                >
                  Compare on Zillow
                </button>
              </div>
            </div>

            {/* Comparison Section */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-white mb-4">Compare with Similar Areas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recommendation 1: Same location, different property type */}
                {propertyTypes
                  .filter(type => type !== searchResults[0].propertytype)
                  .slice(0, 1)
                  .map((propType) => (
                    <button
                      key={`diff-type-${propType}`}
                      onClick={() => {
                        setSelectedPropertyType(propType);
                        handleSearch();
                      }}
                      className="bg-eerie-black/50 hover:bg-eerie-black/70 p-4 rounded-md border border-mint/20 text-left transition-colors"
                    >
                      <h3 className="text-white font-medium flex items-center">
                        <span className="bg-mint text-eerie-black text-xs px-2 py-1 rounded mr-2">1</span>
                        Different Property Type
                      </h3>
                      <p className="text-mint font-medium mt-2">{propType}</p>
                      <p className="text-white/70 text-sm mt-1">Same location: {searchResults[0].city}, {selectedState}</p>
                    </button>
                  ))}
                
                {/* Recommendation 2: Same state, different city */}
                {(() => {
                  const differentCity = getDifferentCity(selectedState, searchResults[0].city);
                  if (!differentCity) return null;
                  
                  return (
                    <button
                      key="diff-city"
                      onClick={() => {
                        setSelectedCity(differentCity);
                        handleSearch();
                      }}
                      className="bg-eerie-black/50 hover:bg-eerie-black/70 p-4 rounded-md border border-mint/20 text-left transition-colors"
                    >
                      <h3 className="text-white font-medium flex items-center">
                        <span className="bg-mint text-eerie-black text-xs px-2 py-1 rounded mr-2">2</span>
                        Different City
                      </h3>
                      <p className="text-mint font-medium mt-2">{differentCity}</p>
                      <p className="text-white/70 text-sm mt-1">Same state: {selectedState}, same property type: {searchResults[0].propertytype}</p>
                    </button>
                  );
                })()}
                
                {/* Recommendation 3: Nearby state */}
                {(() => {
                  const { state: nearbyState, city: nearbyCity } = getNearbyStateAndCity(selectedState);
                  if (!nearbyState || !nearbyCity) return null;
                  
                  return (
                    <button
                      key="nearby-state"
                      onClick={() => {
                        setSelectedState(nearbyState);
                        setSelectedCity(nearbyCity);
                        handleSearch();
                      }}
                      className="bg-eerie-black/50 hover:bg-eerie-black/70 p-4 rounded-md border border-mint/20 text-left transition-colors"
                    >
                      <h3 className="text-white font-medium flex items-center">
                        <span className="bg-mint text-eerie-black text-xs px-2 py-1 rounded mr-2">3</span>
                        Nearby State
                      </h3>
                      <p className="text-mint font-medium mt-2">{nearbyState}</p>
                      <p className="text-white/70 text-sm mt-1">{nearbyCity}, with same property type: {searchResults[0].propertytype}</p>
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searchResults || searchResults.length === 0 && !isLoading && !error && (
          <div className="w-full bg-eerie-black/50 rounded-lg border border-mint/20 p-6 relative z-20">
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-mint/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h2 className="text-xl font-medium text-white mb-2">No Housing Data Selected</h2>
              <p className="text-white/70 max-w-lg mx-auto mb-6">
                Use the search controls above to select a state, city, and property type to view detailed housing price analysis.
              </p>
              {selectedState && selectedCity && selectedPropertyType && (
                <button 
                  className="bg-mint hover:bg-mint/90 text-white px-5 py-2 rounded-md transition-colors inline-flex items-center"
                  onClick={handleSearch}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Now
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="w-full flex items-center justify-center py-12 relative z-20">
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-mint mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-white/80">Loading housing data...</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HousingQuestion; 