import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import cityData from "../utils/cityData";
import Loader from "../ui/Loader";

// All US states for dropdown
const usStates = Object.entries(cityData).map(([name, data]) => ({
  id: data.id,
  name: name
}));

// Years with potentially available data
const yearRange = {
  min: 1980,
  max: 2014
};

// Available years (all years in our range are available)
const availableYears = Array.from({ length: yearRange.max - yearRange.min + 1 }, (_, i) => yearRange.min + i);

// Define decades for quick scrolling
const decades = {
  "1980s": { start: 1980, end: 1989 },
  "1990s": { start: 1990, end: 1999 },
  "2000s": { start: 2000, end: 2009 },
  "2010s": { start: 2010, end: 2014 },
};

const CrimeQuestion = () => {
  // State for form inputs
  const [selectedState, setSelectedState] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const yearPickerRef = useRef(null);
  const yearSliderRef = useRef(null);
  
  // State for results
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showMap, setShowMap] = useState(true);

  // Close year picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (yearPickerRef.current && !yearPickerRef.current.contains(event.target)) {
        setIsYearPickerOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedState || !selectedYear) {
      setError("Please select both a state and year");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/crime/${selectedState}/${selectedYear}`);
      setResults(response.data);
      setSelectedCity(null); // Reset selected city when new data is loaded
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching crime data:", err);
      setError("Failed to fetch crime data. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle year selection
  const handleYearClick = (year) => {
    setSelectedYear(year.toString());
    setIsYearPickerOpen(false);
  };

  // Scroll to a specific decade
  const scrollToDecade = (decade) => {
    if (yearSliderRef.current) {
      const yearButton = document.getElementById(`year-${decades[decade].start}`);
      if (yearButton) {
        const slider = yearSliderRef.current;
        const buttonLeft = yearButton.offsetLeft;
        const sliderScrollLeft = slider.scrollLeft;
        const sliderWidth = slider.clientWidth;
        
        // Calculate the target scroll position to center the decade
        const scrollTarget = buttonLeft - (sliderWidth / 2) + (yearButton.clientWidth * 2);
        
        // Smooth scroll to position
        slider.scrollTo({
          left: scrollTarget,
          behavior: 'smooth'
        });
      }
    }
  };

  // Handle city selection
  const handleCityClick = (city) => {
    setSelectedCity(city === selectedCity ? null : city);
  };

  // Get map query string for the selected state
  const getMapQueryString = () => {
    if (!selectedState) return "";
    
    if (selectedCity) {
      return `${selectedCity.city},${selectedState}`;
    }
    
    return selectedState;
  };

  return (
    <>
      {/* Crime Search Form */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-end">
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-white mb-1">
            Select State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
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
        
        <div className="lg:col-span-3 relative" ref={yearPickerRef}>
          <label className="block text-sm font-medium text-white mb-1">
            Select Year
          </label>
          
          {/* Year Selector Button */}
          <button
            onClick={() => setIsYearPickerOpen(!isYearPickerOpen)}
            className="w-full p-2 rounded-md text-left bg-eerie-black text-white border border-mint focus:outline-none focus:ring-2 focus:ring-mint flex justify-between items-center"
          >
            <span>{selectedYear || "Select a year"}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform duration-300 ${isYearPickerOpen ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Year Picker Dropdown */}
          <AnimatePresence>
            {isYearPickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-1 bg-eerie-black border border-mint/30 rounded-md shadow-lg overflow-hidden"
                style={{ maxHeight: '300px' }}
              >
                <div className="p-2">
                  {/* Decade Quick Select */}
                  <div className="flex flex-wrap mb-2 gap-1">
                    {Object.keys(decades).map(decade => (
                      <button
                        key={decade}
                        onClick={() => scrollToDecade(decade)}
                        className="px-2 py-1 text-sm bg-eerie-black/50 hover:bg-mint/30 rounded border border-mint/20 text-white hover:text-mint transition-colors"
                      >
                        {decade}
                      </button>
                    ))}
                  </div>
                  
                  {/* Year Slider */}
                  <div 
                    ref={yearSliderRef} 
                    className="px-2 py-1 overflow-x-auto scrollbar-thin scrollbar-thumb-mint/30 scrollbar-track-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    <div className="flex space-x-2 min-w-max py-1">
                      {availableYears.map(year => (
                        <button
                          id={`year-${year}`}
                          key={year}
                          onClick={() => handleYearClick(year)}
                          className={`min-w-[3.5rem] h-14 rounded-md border transition-all
                                    ${selectedYear === year.toString()
                                      ? 'bg-mint/30 text-mint border-mint ring-2 ring-mint scale-110' 
                                      : 'bg-eerie-black/60 text-white hover:bg-eerie-black/80 border-mint/30 hover:border-mint'}
                                    `}
                        >
                          <span className="font-bold">{year}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-2">
          <button
            onClick={handleSubmit}
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
              "View Top Crime Cities"
            )}
          </button>
        </div>
      </div>

      {/* Map Toggle Button */}
      {results.length > 0 && (
        <div className="mt-4 flex justify-end">
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
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200">
          {error}
        </div>
      )}

      {/* Results Section */}
      {results.length > 0 && (
        <div className="mt-6">
          <div className="bg-eerie-black/90 rounded-lg shadow-lg border border-mint/30 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-mint/30 pb-2">
              Top Crime Cities in {selectedState} ({selectedYear})
            </h2>
            
            {/* City Cards Row */}
            <div className="flex overflow-x-auto pb-4 space-x-4 mb-6">
              {results.map((city, index) => (
                <motion.div
                  key={index}
                  onClick={() => handleCityClick(city)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 cursor-pointer ${
                    selectedCity && selectedCity.city === city.city
                      ? 'bg-mint text-eerie-black'
                      : 'bg-eerie-black/50 text-white hover:bg-eerie-black/70'
                  } rounded-lg border border-mint/20 p-4 transition-colors min-w-[180px]`}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-xl font-bold mr-2">
                      {city.city}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      selectedCity && selectedCity.city === city.city
                        ? 'bg-eerie-black text-mint'
                        : 'bg-mint text-eerie-black'
                    }`}>
                      #{index + 1}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className={`font-medium ${
                        selectedCity && selectedCity.city === city.city
                          ? 'text-eerie-black'
                          : 'text-mint'
                      }`}>
                        {city.totalincidents.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs opacity-70">
                      Total Crime Incidents
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Map View */}
            {showMap && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <div className="h-[400px] bg-eerie-black/50 rounded-lg border border-mint/20 p-4 mb-4 relative overflow-hidden">
                  <div className="h-full relative">
                    {selectedState ? (
                      <iframe
                        title="Crime Map"
                        className="w-full h-full rounded-lg relative z-10"
                        src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(getMapQueryString())}&zoom=${selectedCity ? 10 : 6}`}
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-white/60">Select a state to view the map</p>
                      </div>
                    )}
                    
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Selected City Detail */}
            <AnimatePresence>
              {selectedCity && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-eerie-black/70 rounded-lg border border-mint p-4 mt-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-mint mb-2">{selectedCity.city} Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div>
                            <p className="text-white/70 text-sm">Total Crime Incidents</p>
                            <p className="text-2xl font-bold text-mint">{selectedCity.totalincidents.toLocaleString()}</p>
                          </div>
                          
                          <div>
                            <p className="text-white/70 text-sm">State</p>
                            <p className="text-lg text-white">{selectedState}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-white/70 text-sm">Year</p>
                            <p className="text-lg text-white">{selectedYear}</p>
                          </div>
                          
                          {/* Additional metrics could be shown here */}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedCity(null)}
                      className="text-white/70 hover:text-white p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!results.length && !isLoading && !error && (
        <div className="mt-6 bg-eerie-black/50 rounded-lg border border-mint/20 p-6">
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-mint/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-medium text-white mb-2">No Crime Data Selected</h2>
            <p className="text-white/70 max-w-lg mx-auto mb-6">
              Select a state and year to view the top 5 cities with the highest crime incidents.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-6 w-full flex items-center justify-center py-12">
          <div className="text-center">
            <Loader />
          </div>
        </div>
      )}
    </>
  );
};

export default CrimeQuestion; 