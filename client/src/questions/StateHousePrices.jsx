import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../ui/Input";
import axios from "axios";
import styled from "styled-components";
import { usStates } from "../utils/cityData";
import Loader from "../ui/Loader";
// Property type images (these are placeholders - replace with actual images)
const propertyTypeImages = {
  "Single Family Residential": "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  "Condo/Co-op": "https://images.unsplash.com/photo-1628133287836-40bd5453bed1?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Townhouse": "https://images.unsplash.com/photo-1577593980495-6e7f66a54ee6?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Multi-Family (2-4 Unit)": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "All Residential": "https://plus.unsplash.com/premium_photo-1680185462024-449a2abaec28?q=80&w=3864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const StateHousePrices = ({ showMap = true, setShowMap }) => {
  // States for the component
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);
  const [housingData, setHousingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // City filter states
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [minHomeSold, setMinHomeSold] = useState("");
  const [maxHomeSold, setMaxHomeSold] = useState("");

  // Unique property types from the housing data
  const propertyTypes = useMemo(() => {
    if (!housingData.length) return [];
    
    const types = new Set();
    housingData.forEach(item => {
      types.add(item.propertytype);
    });
    
    return Array.from(types);
  }, [housingData]);

  // Filter states based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = usStates
        .filter((state) => 
          state.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 results
      setFilteredStates(filtered);
      setShowSearchResults(filtered.length > 0);
    } else {
      setFilteredStates([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Fetch housing data when state is selected
  useEffect(() => {
    if (selectedState) {
      fetchHousingData(selectedState);
    }
  }, [selectedState]);

  // Group housing data by city
  const groupedByCity = useMemo(() => {
    const grouped = {};
    
    housingData.forEach(item => {
      if (!grouped[item.city]) {
        grouped[item.city] = {
          city: item.city,
          totalHomesSold: 0,
          properties: []
        };
      }
      
      grouped[item.city].properties.push(item);
      grouped[item.city].totalHomesSold += parseInt(item.totalhomessold, 10);
    });
    
    // Convert to array and sort by total homes sold
    return Object.values(grouped).sort((a, b) => b.totalHomesSold - a.totalHomesSold);
  }, [housingData]);

  // Filter cities based on search query and filters
  const filteredCities = useMemo(() => {
    if (!citySearchQuery && !selectedPropertyType && !minHomeSold && !maxHomeSold) {
      return groupedByCity;
    }
    
    return groupedByCity.filter(city => {
      // Filter by city name
      const matchesName = !citySearchQuery || 
        city.city.toLowerCase().includes(citySearchQuery.toLowerCase());
      
      // Filter by property type
      const matchesPropertyType = !selectedPropertyType || 
        city.properties.some(p => p.propertytype === selectedPropertyType);
      
      // Filter by min homes sold
      const matchesMinHomes = !minHomeSold || 
        city.totalHomesSold >= parseInt(minHomeSold, 10);
      
      // Filter by max homes sold
      const matchesMaxHomes = !maxHomeSold || 
        city.totalHomesSold <= parseInt(maxHomeSold, 10);
      
      return matchesName && matchesPropertyType && matchesMinHomes && matchesMaxHomes;
    });
  }, [groupedByCity, citySearchQuery, selectedPropertyType, minHomeSold, maxHomeSold]);

  // Fetch housing data from API
  const fetchHousingData = async (state) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace spaces with underscores for URL safety
      const formattedState = state.toLowerCase().replace(/ /g, '_');
      console.log("Fetching state data for:", state, "Formatted as:", formattedState);
      const response = await axios.get(`/api/state/${formattedState}`);
      console.log("Response data:", response.data);
      setHousingData(response.data);
      setSelectedCity(null); // Reset selected city
      setCitySearchQuery(""); // Reset city search
      setSelectedPropertyType(""); // Reset property type filter
      setMinHomeSold(""); // Reset min homes filter
      setMaxHomeSold(""); // Reset max homes filter
    } catch (err) {
      console.error("Error fetching housing data:", err);
      setError("Failed to fetch housing data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle state selection from search results
  const handleStateSelect = (state) => {
    setSelectedState(state.name);
    setSearchQuery(state.name);
    setShowSearchResults(false);
  };

  // Handle input change
  const handleInputChange = (value) => {
    setSearchQuery(value);
    if (!value) {
      setSelectedState("");
    }
  };

  // Handle city search input change
  const handleCitySearchChange = (value) => {
    setCitySearchQuery(value);
  };

  // Handle city selection
  const handleCityClick = (city) => {
    setSelectedCity(city === selectedCity ? null : city);
  };

  // Handle filter icon click
  const handleFilterClick = () => {
    setShowFilterModal(!showFilterModal);
  };

  // Handle property type selection in filter
  const handlePropertyTypeChange = (e) => {
    setSelectedPropertyType(e.target.value);
  };

  // Handle min homes sold input change
  const handleMinHomesChange = (e) => {
    setMinHomeSold(e.target.value);
  };

  // Handle max homes sold input change
  const handleMaxHomesChange = (e) => {
    setMaxHomeSold(e.target.value);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setCitySearchQuery("");
    setSelectedPropertyType("");
    setMinHomeSold("");
    setMaxHomeSold("");
    setShowFilterModal(false);
  };

  // Apply filters and close modal
  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };

  // Format price to USD
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-0 -mt-4">
      {/* Search Section */}
      <div className="relative">
        <div className="w-auto">
            <div className="mb-2">
            <Input onChange={handleInputChange} />
            </div>
            
            {/* Search Results Dropdown */}
            <AnimatePresence>
            {showSearchResults && (
                <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full bg-eerie-black border border-mint/30 rounded-md shadow-lg"
                >
                <ul>
                    {filteredStates.map((state) => (
                    <li 
                        key={state.id}
                        className="px-4 py-2.5 hover:bg-mint/10 cursor-pointer border-b border-mint/20 flex items-center"
                        onClick={() => handleStateSelect(state)}
                    >
                        <div className="text-mint mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        </div>
                        <span className="text-white">{state.name}</span>
                    </li>
                    ))}
                </ul>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>

      {/* Map Toggle Button */}
      {housingData.length > 0 && (
        <div className="flex justify-end">
          <button
            className="px-3 py-2 bg-eerie-black border border-mint text-mint text-sm rounded-md hover:bg-mint hover:text-white transition-colors"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? "Hide Map" : "Show Map"}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200">
          {error}
        </div>
      )}

      {/* Results Section */}
      {isLoading ? (
        <div className="flex justify-center items-center -mt-4 w-full h-full">
          <Loader />
        </div>
      ) : housingData.length > 0 ? (
        <div className="bg-eerie-black/90 rounded-lg shadow-lg border border-mint/30 p-6">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-mint/30 pb-2">
            Housing Data for {selectedState}
          </h2>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Section */}
            {showMap && (
              <div className="lg:order-2">
                <div className="h-[500px] bg-eerie-black/50 rounded-lg border border-mint/20 p-4 relative overflow-hidden">
                  {selectedState && (
                    <iframe
                      title="Housing Map"
                      className="w-full h-full rounded-lg"
                      src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                        selectedCity ? `${selectedCity.city},${selectedState}` : selectedState
                      )}&zoom=${selectedCity ? 10 : 6}`}
                      allowFullScreen
                    ></iframe>
                  )}
                </div>

                {/* Selected City Stats */}
                <AnimatePresence>
                  {selectedCity && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="mt-4 bg-eerie-black/70 rounded-lg border border-mint p-4"
                    >
                      <h3 className="text-xl font-bold text-mint mb-2">{selectedCity.city} Overview</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-white/70 text-sm">Total Homes Sold</p>
                          <p className="text-2xl font-bold text-white">{formatNumber(selectedCity.totalHomesSold)}</p>
                        </div>
                        <div>
                          <p className="text-white/70 text-sm">Property Types</p>
                          <p className="text-lg text-white">{selectedCity.properties.length}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Cities List */}
            <div className={`lg:order-1 ${showMap ? '' : 'lg:col-span-2'}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-mint">Cities by Home Sales</h3>
                <div className="text-white text-sm">
                  Showing {filteredCities.length} of {groupedByCity.length} cities
                </div>
              </div>
              
              {/* City Search */}
              <div className="relative mb-4">
                <div className="mb-2">
                  <Input onChange={handleCitySearchChange} onFilterClick={handleFilterClick} />
                </div>
                
                {/* Filter Modal */}
                <AnimatePresence>
                  {showFilterModal && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-1 z-30 w-64 bg-eerie-black/95 border border-mint/30 rounded-md shadow-lg p-4"
                    >
                      <h4 className="text-mint font-medium mb-3">Filter Options</h4>
                      
                      {/* Property Type Filter */}
                      <div className="mb-3">
                        <label className="block text-white text-sm mb-1">Property Type</label>
                        <select 
                          value={selectedPropertyType}
                          onChange={handlePropertyTypeChange}
                          className="w-full p-2 rounded bg-eerie-black/80 border border-mint/30 text-white text-sm"
                        >
                          <option value="">All Property Types</option>
                          {propertyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Min/Max Homes Sold */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <label className="block text-white text-sm mb-1">Min Homes</label>
                          <input 
                            type="number"
                            value={minHomeSold}
                            onChange={handleMinHomesChange}
                            placeholder="Min"
                            className="w-full p-2 rounded bg-eerie-black/80 border border-mint/30 text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-white text-sm mb-1">Max Homes</label>
                          <input 
                            type="number"
                            value={maxHomeSold}
                            onChange={handleMaxHomesChange}
                            placeholder="Max"
                            className="w-full p-2 rounded bg-eerie-black/80 border border-mint/30 text-white text-sm"
                          />
                        </div>
                      </div>
                      
                      {/* Filter Actions */}
                      <div className="flex justify-between">
                        <button 
                          onClick={handleResetFilters}
                          className="px-3 py-1.5 text-sm bg-eerie-black border border-mint/30 text-mint rounded hover:bg-mint/10"
                        >
                          Reset
                        </button>
                        <button 
                          onClick={handleApplyFilters}
                          className="px-3 py-1.5 text-sm bg-mint text-eerie-black rounded hover:bg-mint/90"
                        >
                          Apply
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Scrollable Cities List */}
              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredCities.length > 0 ? (
                  filteredCities.map((cityData) => (
                    <motion.div
                      key={cityData.city}
                      onClick={() => handleCityClick(cityData)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`cursor-pointer ${
                        selectedCity && selectedCity.city === cityData.city
                          ? 'bg-mint text-eerie-black'
                          : 'bg-eerie-black/50 text-white hover:bg-eerie-black/70'
                      } rounded-lg border border-mint/20 p-4 transition-colors`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xl font-bold">{cityData.city}</h4>
                        <span className={`text-sm px-2 py-1 rounded ${
                          selectedCity && selectedCity.city === cityData.city
                            ? 'bg-eerie-black text-mint'
                            : 'bg-mint text-eerie-black'
                        }`}>
                          {formatNumber(cityData.totalHomesSold)} homes
                        </span>
                      </div>
                      
                      {/* Property Types Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
                        {cityData.properties.map((property, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded ${
                              selectedCity && selectedCity.city === cityData.city
                                ? 'bg-eerie-black/80'
                                : 'bg-mint/5'
                            }`}
                          >
                            <div className="aspect-video rounded overflow-hidden mb-2">
                              <img
                                src={propertyTypeImages[property.propertytype] || propertyTypeImages["All Residential"]}
                                alt={property.propertytype}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className={`text-xs font-medium ${
                              selectedCity && selectedCity.city === cityData.city
                                ? 'text-mint'
                                : 'text-white/90'
                            }`}>
                              {property.propertytype}
                            </div>
                            <div className={`text-base font-bold ${
                              selectedCity && selectedCity.city === cityData.city
                                ? 'text-white'
                                : 'text-mint'
                            }`}>
                              {formatPrice(property.avgsaleprice)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-eerie-black/30 rounded-lg border border-mint/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-mint/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-white/60">No cities match your filters</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 px-3 py-1.5 text-sm bg-mint/10 text-mint rounded hover:bg-mint/20"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        !isLoading && (
          <div className="bg-eerie-black/50 rounded-lg border border-mint/20 p-6">
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-mint/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h2 className="text-xl font-medium text-white mb-2">No Housing Data Selected</h2>
              <p className="text-white/70 max-w-lg mx-auto mb-6">
                Search for a state using the search bar above to view housing prices and trends.
              </p>
            </div>
          </div>
        )
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(16, 185, 129, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default StateHousePrices;
