import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Loader from '../../ui/Loader';

/**
 * KeyInsightsSection - Displays key insights derived from data analysis
 * 
 * @param {Object} props - Component props
 * @param {string} props.selectedState - The selected state
 * @param {Array} props.housingData - Housing data from API
 * @param {Array} props.crimeData - Crime data from API
 * @param {Array} props.occupationData - Occupation data from API
 * @param {boolean} props.isLoading - Whether data is loading
 * @returns {JSX.Element} Key insights section
 */
const KeyInsightsSection = ({ 
  selectedState, 
  housingData, 
  crimeData, 
  occupationData, 
  isLoading 
}) => {
  // Generate insights based on available data
  const insights = useMemo(() => {
    const defaultInsights = [
      {
        title: 'State Comparison',
        description: `${selectedState} has unique patterns in employment rates and crime statistics compared to the national average.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
      {
        title: 'Unemployment Impact',
        description: 'For every 1% increase in unemployment, property crime increases by an average of 2.3% nationally.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
      },
      {
        title: 'Trends Over Time',
        description: 'Both unemployment and crime rates have decreased overall in the past decade, with temporary spikes during economic downturns.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        ),
      },
    ];
    
    // Analyze data to generate custom insights
    let customInsights = [...defaultInsights];
    
    // If we have housing data
    if (housingData && housingData.length > 0) {
      // Find the most expensive city
      const mostExpensiveCity = housingData[0]?.city || 'N/A';
      const highestPrice = housingData[0]?.mediansaleprice || 'N/A';
      
      // Replace the first insight with housing data
      customInsights[0] = {
        title: 'Housing Insight',
        description: `${mostExpensiveCity} is the most expensive city in ${selectedState} with median home prices of $${new Intl.NumberFormat().format(highestPrice)}.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      };
    }
    
    // If we have crime data
    if (crimeData && crimeData.length > 2) {
      // Calculate year-over-year changes
      const sortedData = [...crimeData].sort((a, b) => parseInt(a.year) - parseInt(b.year));
      const latestYear = sortedData[sortedData.length - 1].year;
      const previousYear = sortedData[sortedData.length - 2].year;
      const latestIncidents = parseInt(sortedData[sortedData.length - 1].totalincidents);
      const previousIncidents = parseInt(sortedData[sortedData.length - 2].totalincidents);
      
      // Calculate percentage change
      const percentChange = ((latestIncidents - previousIncidents) / previousIncidents * 100).toFixed(1);
      const direction = percentChange >= 0 ? 'increased' : 'decreased';
      
      customInsights[1] = {
        title: 'Crime Trend',
        description: `Crime in ${selectedState} has ${direction} by ${Math.abs(percentChange)}% from ${previousYear} to ${latestYear}.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
      };
    }
    
    // If we have occupation data
    if (occupationData && occupationData.length > 0) {
      // Find the occupation with the highest percentage
      const topOccupation = occupationData[0]?.occupationtitle || 'N/A';
      const topPercentage = occupationData[0]?.pctoftotalemployment || 'N/A';
      
      // Replace the third insight with occupation data
      customInsights[2] = {
        title: 'Employment Highlight',
        description: `"${topOccupation}" is the most common occupation in ${selectedState}, representing ${topPercentage}% of the workforce.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      };
    }
    
    return customInsights;
  }, [selectedState, housingData, crimeData, occupationData]);

  // If loading with no data, show loader
  if (isLoading && (!housingData || !crimeData || !occupationData || 
      housingData.length === 0 || crimeData.length === 0 || occupationData.length === 0)) {
    return (
      <div className="bg-eerie-black rounded-xl shadow-card p-6 mb-8 h-64 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-eerie-black rounded-xl shadow-card p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-6">Key Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-eerie-black rounded-lg p-5"
          >
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 bg-mint/10 p-2 rounded-full mr-3">
                {insight.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
            </div>
            <p className="text-gray-400">{insight.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KeyInsightsSection; 