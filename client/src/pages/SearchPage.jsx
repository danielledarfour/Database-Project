import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [yearRange, setYearRange] = useState([2010, 2023]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = generateMockResults(searchTerm, filterType, yearRange);
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };

  const generateMockResults = (term, type, years) => {
    // Mock data generation based on search parameters
    const results = [];
    const types = type === 'all' ? ['crime', 'employment'] : [type];
    
    for (let i = 0; i < 5; i++) {
      for (const dataType of types) {
        const year = Math.floor(Math.random() * (years[1] - years[0] + 1)) + years[0];
        
        if (dataType === 'crime') {
          results.push({
            id: `crime-${i}`,
            type: 'crime',
            title: `${term ? term + ' related ' : ''}Crime Statistics ${year}`,
            description: `Comprehensive crime data analysis from ${year} showing trends across multiple states.`,
            states: ['California', 'Texas', 'New York'].slice(0, Math.floor(Math.random() * 3) + 1),
            year,
            metrics: {
              violentCrime: Math.floor(Math.random() * 1000),
              propertyCrime: Math.floor(Math.random() * 5000),
              arrests: Math.floor(Math.random() * 800)
            }
          });
        } else {
          results.push({
            id: `emp-${i}`,
            type: 'employment',
            title: `${term ? term + ' sector ' : ''}Employment Data ${year}`,
            description: `Detailed employment statistics from ${year} analyzing job growth and workforce trends.`,
            states: ['Florida', 'Michigan', 'Washington'].slice(0, Math.floor(Math.random() * 3) + 1),
            year,
            metrics: {
              employmentRate: (Math.random() * 10 + 90).toFixed(1) + '%',
              newJobs: Math.floor(Math.random() * 50000),
              averageSalary: '$' + (Math.floor(Math.random() * 50) + 50) + 'k'
            }
          });
        }
      }
    }
    
    return results;
  };

  // Update year range handler
  const handleYearChange = (e, index) => {
    const newYearRange = [...yearRange];
    newYearRange[index] = parseInt(e.target.value);
    setYearRange(newYearRange);
  };

  return (
    <div className="min-h-screen bg-eerie-black/5 pb-12">
      {/* Search Header */}
      <div className="bg-cambridge-blue text-white py-20 px-4 relative">
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Search Data Insights
          </motion.h1>
          <motion.p 
            className="text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Dummy Data Search Page
          </motion.p>
        </div>
      </div>

      {/* Search Form */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div 
          className="backdrop-blur-md bg-eerie-black/70 p-6 rounded-lg shadow-lg border border-white/20 max-w-4xl mx-auto -mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <form onSubmit={handleSearch}>
            <div className="mb-6">
              <label htmlFor="search" className="block text-sm font-medium text-white mb-1">Search Term</label>
              <input
                type="text"
                id="search"
                className="w-full px-4 py-3 border border-gray-300 bg-white/80 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent text-eerie-black"
                placeholder="Enter keywords, state names, or data types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-eerie-black/50 backdrop-blur-sm p-4 rounded-md">
                <label className="block text-sm font-medium text-white mb-2">Data Type</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="filterType"
                      value="all"
                      checked={filterType === 'all'}
                      onChange={() => setFilterType('all')}
                      className="text-mint focus:ring-mint h-4 w-4"
                    />
                    <span className="ml-2 text-white">All Data</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="filterType"
                      value="crime"
                      checked={filterType === 'crime'}
                      onChange={() => setFilterType('crime')}
                      className="text-mint focus:ring-mint h-4 w-4"
                    />
                    <span className="ml-2 text-white">Crime</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="filterType"
                      value="employment"
                      checked={filterType === 'employment'}
                      onChange={() => setFilterType('employment')}
                      className="text-mint focus:ring-mint h-4 w-4"
                    />
                    <span className="ml-2 text-white">Employment</span>
                  </label>
                </div>
              </div>
              
              <div className="bg-eerie-black/50 backdrop-blur-sm p-4 rounded-md">
                <label className="block text-sm font-medium text-white mb-2">Year Range: {yearRange[0]} - {yearRange[1]}</label>
                <div className="px-1 py-4">
                  <input
                    type="range"
                    min="2010"
                    max="2023"
                    value={yearRange[0]}
                    onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
                    className="w-full accent-mint"
                  />
                  <input
                    type="range"
                    min="2010"
                    max="2023"
                    value={yearRange[1]}
                    onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
                    className="w-full accent-mint"
                  />
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className="bg-mint/90 backdrop-blur-sm hover:bg-mint text-white font-medium py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint shadow-sm"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : 'Search'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-white">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.map((result) => (
              <motion.div 
                key={result.id}
                className="mouse-position-border bg-eerie-black rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`p-1 ${result.type === 'crime' ? 'bg-cambridge-blue/20' : 'bg-mint/20'}`}>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{result.title}</h3>
                        <p className="text-sm text-gray-600">{result.location}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        result.type === 'crime' ? 'bg-cambridge-blue/20 text-cambridge-blue' : 'bg-mint/20 text-mint'
                      }`}>
                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-white/70 mb-4">{result.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70">Year: {result.year}</span>
                      <Link
                        to={`/details/${result.type}/${result.id}`}
                        className="text-mint hover:text-cambridge-blue font-medium text-sm flex items-center transition-colors"
                      >
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Initial state - no search performed yet */}
      {!isLoading && searchResults.length === 0 && (
        <div className="mt-16 text-center">
          <div className="flex justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Ready to search</h3>
          <p className="text-white/70 max-w-md mx-auto">
            Enter search terms and apply filters to explore our comprehensive database of crime and employment statistics.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage; 