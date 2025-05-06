import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usStates } from '../../utils/cityData';

const DashboardFilters = ({ 
  filters, 
  availableCities,
  onFilterChange, 
  onSearch, 
  isSearching, 
  searchError,
  isCityPickerOpen,
  isYearPickerOpen,
  setIsCityPickerOpen,
  setIsYearPickerOpen,
  decades,
  availableYears
}) => {
  const yearPickerRef = useRef(null);
  const cityPickerRef = useRef(null);
  const yearSliderRef = useRef(null);

  // Handle city selection
  const handleCityChange = (city) => {
    onFilterChange('city', city);
    setIsCityPickerOpen(false);
  };
  
  // Handle state change
  const handleStateChange = (e) => {
    onFilterChange('state', e.target.value);
  };
  
  // Handle year selection
  const handleYearClick = (year) => {
    onFilterChange('year', parseInt(year.toString()));
    setIsYearPickerOpen(false);
  };
  
  // Scroll to a specific decade
  const scrollToDecade = (decade) => {
    if (yearSliderRef.current) {
      const yearButton = document.getElementById(`year-${decades[decade].start}`);
      if (yearButton) {
        const slider = yearSliderRef.current;
        const buttonLeft = yearButton.offsetLeft;
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

  return (
    <div className="py-6 px-4 relative z-10">
      <div className="container mx-auto">
        <motion.div 
          className="backdrop-blur-md bg-eerie-black rounded-lg shadow-lg border border-white/40 p-6 -mt-16 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* State Selector */}
              <div className="w-full sm:w-36">
                <label htmlFor="stateFilter" className="block text-sm font-medium text-white mb-1">
                  State
                </label>
                <select
                  id="stateFilter"
                  className="block w-full px-3 py-2 border border-gray-700 bg-eerie-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent"
                  value={filters.state}
                  onChange={handleStateChange}
                >
                  {usStates.map((state) => (
                    <option key={state.id} value={state.name}>{state.name}</option>
                  ))}
                </select>
              </div>
              
              {/* City Selector */}
              <div className="w-full sm:w-48 relative" ref={cityPickerRef}>
                <label htmlFor="cityFilter" className="block text-sm font-medium text-white mb-1">
                  City (Optional)
                </label>
                <button
                  onClick={() => setIsCityPickerOpen(!isCityPickerOpen)}
                  className="block w-full px-3 py-2 border border-gray-700 bg-eerie-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent text-left flex justify-between items-center"
                >
                  <span>{filters.city || "All Cities"}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 transition-transform duration-300 ${isCityPickerOpen ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* City Picker Dropdown */}
                <AnimatePresence>
                  {isCityPickerOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 w-64 mt-1 bg-eerie-black border border-mint/30 rounded-md shadow-lg overflow-hidden max-h-60 overflow-y-auto"
                    >
                      <div className="p-2">
                        <button
                          onClick={() => handleCityChange('')}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${!filters.city ? 'bg-mint/30 text-mint' : 'hover:bg-eerie-black/80 text-white'}`}
                        >
                          All Cities
                        </button>
                        {availableCities.map(city => (
                          <button
                            key={city}
                            onClick={() => handleCityChange(city)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${filters.city === city ? 'bg-mint/30 text-mint' : 'hover:bg-eerie-black/80 text-white'}`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Year Selector */}
              <div className="w-full sm:w-48 relative" ref={yearPickerRef}>
                <label htmlFor="yearFilter" className="block text-sm font-medium text-white mb-1">
                  Year
                </label>
                <button
                  onClick={() => setIsYearPickerOpen(!isYearPickerOpen)}
                  className="block w-full px-3 py-2 border border-gray-700 bg-eerie-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent text-left flex justify-between items-center"
                >
                  <span>{filters.year}</span>
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
                      className="absolute z-50 w-64 mt-1 bg-eerie-black border border-mint/30 rounded-md shadow-lg overflow-hidden"
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
                                          ${filters.year === year
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
            </div>
          </div>
          
          {/* Add error message display */}
          {searchError && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200">
              <p className="text-sm">{searchError}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardFilters; 