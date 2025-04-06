import { useState } from 'react'
import { motion } from 'framer-motion'

const SearchFilterPage = () => {
  // Mock data for demonstration - in a real app, this would come from API
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia'
  ]
  
  const years = Array.from({ length: 10 }, (_, i) => 2015 + i)
  
  const crimeTypes = [
    'Assault', 'Burglary', 'Homicide', 'Larceny',
    'Motor Vehicle Theft', 'Robbery', 'Sexual Assault'
  ]
  
  const jobSectors = [
    'Healthcare', 'Technology', 'Education', 'Manufacturing',
    'Retail', 'Finance', 'Construction', 'Hospitality'
  ]
  
  // State for filters
  const [selectedStates, setSelectedStates] = useState([])
  const [selectedYears, setSelectedYears] = useState([])
  const [selectedCrimes, setSelectedCrimes] = useState([])
  const [selectedSectors, setSelectedSectors] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  
  // Mock results
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Toggle selection
  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item))
    } else {
      setSelectedItems([...selectedItems, item])
    }
  }
  
  // Handle search
  const handleSearch = () => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Mock search results based on filters
      const searchResults = [
        {
          id: 1,
          state: 'California',
          year: 2020,
          crimeType: 'Assault',
          victimCount: 1245,
          jobSector: 'Technology',
          meanWage: 112800
        },
        {
          id: 2,
          state: 'Texas',
          year: 2019,
          crimeType: 'Burglary',
          victimCount: 875,
          jobSector: 'Healthcare',
          meanWage: 86500
        },
        {
          id: 3,
          state: 'New York',
          year: 2021,
          crimeType: 'Robbery',
          victimCount: 632,
          jobSector: 'Finance',
          meanWage: 125000
        }
      ]
      
      setResults(searchResults)
      setLoading(false)
    }, 1000)
  }
  
  // Handle reset
  const handleReset = () => {
    setSelectedStates([])
    setSelectedYears([])
    setSelectedCrimes([])
    setSelectedSectors([])
    setSearchQuery('')
    setResults([])
  }
  
  // AI query suggestions
  const aiSuggestions = [
    'Show violent crimes in states with highest tech employment',
    'Compare crime rates with annual mean wages across all states',
    'Which states have the lowest crime rates and highest employment?'
  ]
  
  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="heading-lg mb-6">Search and Filter Data</h1>
        <p className="text-gray-300 mb-8">
          Filter and explore the relationships between crime statistics and employment data across the United States.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Search Input */}
          <div className="lg:col-span-4">
            <div className="relative">
              <input
                type="text"
                className="input-field w-full pr-12"
                placeholder="Search for specific terms or use natural language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary-dark text-white p-2 rounded-md"
                onClick={handleSearch}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* States Filter */}
          <div className="card">
            <h3 className="heading-md mb-4">States</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {states.map(state => (
                <div key={state} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`state-${state}`}
                    className="mr-2"
                    checked={selectedStates.includes(state)}
                    onChange={() => toggleSelection(state, selectedStates, setSelectedStates)}
                  />
                  <label htmlFor={`state-${state}`} className="text-gray-300 cursor-pointer">{state}</label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Years Filter */}
          <div className="card">
            <h3 className="heading-md mb-4">Years</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {years.map(year => (
                <div key={year} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`year-${year}`}
                    className="mr-2"
                    checked={selectedYears.includes(year)}
                    onChange={() => toggleSelection(year, selectedYears, setSelectedYears)}
                  />
                  <label htmlFor={`year-${year}`} className="text-gray-300 cursor-pointer">{year}</label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Crime Types Filter */}
          <div className="card">
            <h3 className="heading-md mb-4">Crime Types</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {crimeTypes.map(crime => (
                <div key={crime} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`crime-${crime}`}
                    className="mr-2"
                    checked={selectedCrimes.includes(crime)}
                    onChange={() => toggleSelection(crime, selectedCrimes, setSelectedCrimes)}
                  />
                  <label htmlFor={`crime-${crime}`} className="text-gray-300 cursor-pointer">{crime}</label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Job Sectors Filter */}
          <div className="card">
            <h3 className="heading-md mb-4">Job Sectors</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {jobSectors.map(sector => (
                <div key={sector} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`sector-${sector}`}
                    className="mr-2"
                    checked={selectedSectors.includes(sector)}
                    onChange={() => toggleSelection(sector, selectedSectors, setSelectedSectors)}
                  />
                  <label htmlFor={`sector-${sector}`} className="text-gray-300 cursor-pointer">{sector}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <button 
              className="btn-primary"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button 
              className="bg-dark-lighter hover:bg-dark-light text-white py-2 px-4 rounded-md transition-colors"
              onClick={handleReset}
            >
              Reset Filters
            </button>
          </div>
          
          <div className="text-sm text-gray-400">
            {selectedStates.length > 0 && <span className="mr-2">States: {selectedStates.length}</span>}
            {selectedYears.length > 0 && <span className="mr-2">Years: {selectedYears.length}</span>}
            {selectedCrimes.length > 0 && <span className="mr-2">Crimes: {selectedCrimes.length}</span>}
            {selectedSectors.length > 0 && <span>Sectors: {selectedSectors.length}</span>}
          </div>
        </div>
        
        {/* AI Suggestions */}
        <div className="mb-8">
          <h3 className="heading-md mb-4">AI Suggested Queries</h3>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="bg-dark-light hover:bg-dark-lighter text-gray-300 py-2 px-4 rounded-md text-sm transition-colors"
                onClick={() => setSearchQuery(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="mt-8">
            <h3 className="heading-md mb-4">Search Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-dark-light">
                  <tr>
                    <th className="p-4 text-left text-gray-300">State</th>
                    <th className="p-4 text-left text-gray-300">Year</th>
                    <th className="p-4 text-left text-gray-300">Crime Type</th>
                    <th className="p-4 text-left text-gray-300">Victim Count</th>
                    <th className="p-4 text-left text-gray-300">Job Sector</th>
                    <th className="p-4 text-left text-gray-300">Mean Wage</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(result => (
                    <tr key={result.id} className="border-b border-dark-lighter">
                      <td className="p-4 text-gray-300">{result.state}</td>
                      <td className="p-4 text-gray-300">{result.year}</td>
                      <td className="p-4 text-gray-300">{result.crimeType}</td>
                      <td className="p-4 text-gray-300">{result.victimCount}</td>
                      <td className="p-4 text-gray-300">{result.jobSector}</td>
                      <td className="p-4 text-gray-300">${result.meanWage.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  )
}

export default SearchFilterPage 