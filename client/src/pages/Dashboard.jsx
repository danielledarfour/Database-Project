import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [activeChart, setActiveChart] = useState('unemployment');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedYear, setSelectedYear] = useState(2023);
  const [isLoading, setIsLoading] = useState(false);
  
  // TODO: Fetch this data from the API endpoints
  const [unemploymentData, setUnemploymentData] = useState(null);
  const [crimeRateData, setCrimeRateData] = useState(null);
  const [crimeBySectorPieData, setCrimeBySectorPieData] = useState(null);
  const [employmentBySectorPieData, setEmploymentBySectorPieData] = useState(null);

  // Sample states - Would typically come from the API
  const states = [
    'All States', 'California', 'Texas', 'New York', 'Florida', 'Illinois', 
    'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'
  ];

  // Sample years - Would typically be determined based on the available data
  const years = Array.from({ length: 10 }, (_, i) => 2023 - i);

  useEffect(() => {
    // TODO: Implement API calls to fetch data
    fetchDashboardData();
  }, [selectedState, selectedYear]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
      
      // TODO: Fetch unemployment data
      // const unemploymentResponse = await fetch(`${serverBaseUrl}/api/employment-data?state=${selectedState}&year=${selectedYear}`);
      // const unemploymentResult = await unemploymentResponse.json();
      // setUnemploymentData(unemploymentResult);
      
      // TODO: Fetch crime rate data
      // const crimeResponse = await fetch(`${serverBaseUrl}/api/crime-data?state=${selectedState}&year=${selectedYear}`);
      // const crimeResult = await crimeResponse.json();
      // setCrimeRateData(crimeResult);
      
      // TODO: Fetch crime by sector data
      // const crimeSectorResponse = await fetch(`${serverBaseUrl}/api/crime-data/by-sector?state=${selectedState}&year=${selectedYear}`);
      // const crimeSectorResult = await crimeSectorResponse.json();
      // setCrimeBySectorPieData(crimeSectorResult);
      
      // TODO: Fetch employment by sector data
      // const employmentSectorResponse = await fetch(`${serverBaseUrl}/api/employment-data/by-sector?state=${selectedState}&year=${selectedYear}`);
      // const employmentSectorResult = await employmentSectorResponse.json();
      // setEmploymentBySectorPieData(employmentSectorResult);

      // TEMPORARY: Using placeholder data until API is connected
      setUnemploymentData({
        labels: years.reverse(),
        datasets: [
          {
            label: 'Unemployment Rate',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: '#3DD9D6',
            backgroundColor: 'rgba(61, 217, 214, 0.5)',
            tension: 0.3,
          },
          {
            label: 'Employment Growth',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: '#2B6B39',
            backgroundColor: 'rgba(43, 107, 57, 0.5)',
            tension: 0.3,
          },
        ],
      });
      
      setCrimeRateData({
        labels: years.reverse(),
        datasets: [
          {
            label: 'Violent Crime',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(61, 170, 101, 0.5)',
          },
          {
            label: 'Property Crime',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(43, 107, 57, 0.5)',
          },
        ],
      });
      
      setCrimeBySectorPieData({
        labels: ['Theft', 'Assault', 'Burglary', 'Robbery', 'Vehicle Theft', 'Other'],
        datasets: [
          {
            label: 'Crime Distribution',
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
              'rgba(61, 217, 214, 0.6)',
              'rgba(61, 170, 101, 0.6)',
              'rgba(43, 107, 57, 0.6)',
              'rgba(43, 107, 57, 0.8)',
              'rgba(20, 28, 28, 0.6)',
              'rgba(20, 28, 28, 0.8)',
            ],
            borderWidth: 1,
          },
        ],
      });
      
      setEmploymentBySectorPieData({
        labels: [
          'Healthcare', 
          'Retail', 
          'Manufacturing', 
          'Education', 
          'Professional Services', 
          'Other'
        ],
        datasets: [
          {
            label: 'Employment by Sector',
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
              'rgba(61, 217, 214, 0.6)',
              'rgba(61, 170, 101, 0.6)',
              'rgba(43, 107, 57, 0.6)',
              'rgba(43, 107, 57, 0.8)',
              'rgba(20, 28, 28, 0.6)',
              'rgba(20, 28, 28, 0.8)',
            ],
            borderWidth: 1,
          },
        ],
      });
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // TODO: Handle error states more gracefully
    } finally {
      setIsLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: false,
      },
    },
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    // The useEffect will trigger a refetch when state changes
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
    // The useEffect will trigger a refetch when year changes
  };

  const chartTabs = [
    { id: 'unemployment', label: 'Unemployment Trends' },
    { id: 'crimeRate', label: 'Crime Rate Trends' },
    { id: 'correlation', label: 'Unemployment-Crime Correlation' },
  ];

  // Show a loading state if data isn't ready yet
  if (!unemploymentData || !crimeRateData || !crimeBySectorPieData || !employmentBySectorPieData) {
    return (
      <div className="min-h-screen bg-eerie-black flex justify-center items-center">
        <p className="text-lg font-medium text-white">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-eerie-black">
      {/* Header Section */}
      <div className="bg-hunter-green text-white py-12 px-4 relative">
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-3xl font-bold mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Data Dashboard
          </motion.h1>
          <motion.p 
            className="text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Interactive visualizations of crime and employment statistics across the United States.
          </motion.p>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="py-6 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.div 
            className="backdrop-blur-md bg-eerie-black rounded-lg shadow-lg border border-white/40 p-6 -mt-16 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-48">
                  <label htmlFor="stateFilter" className="block text-sm font-medium text-white mb-1">
                    State
                  </label>
                  <select
                    id="stateFilter"
                    className="block w-full px-3 py-2 border border-gray-700 bg-eerie-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent"
                    value={selectedState}
                    onChange={handleStateChange}
                  >
                    {states.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full sm:w-32">
                  <label htmlFor="yearFilter" className="block text-sm font-medium text-white mb-1">
                    Year
                  </label>
                  <select
                    id="yearFilter"
                    className="block w-full px-3 py-2 border border-gray-700 bg-eerie-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent"
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Link
                  to="/search"
                  className="inline-flex items-center px-4 py-3 bg-hunter-green text-white font-medium rounded-md hover:bg-hunter-green/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hunter-green"
                >
                  <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                  </svg>
                  Advanced Search
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Violent Crime Rate', value: '382.5', change: '-1.2%', isPositive: true },
            { title: 'Property Crime Rate', value: '1,933.8', change: '-3.8%', isPositive: true },
            { title: 'Unemployment Rate', value: '3.7%', change: '+0.1%', isPositive: false },
            { title: 'Job Growth', value: '1.3%', change: '-0.8%', isPositive: false },
          ].map((metric, index) => (
            <motion.div
              key={index}
              className="mouse-position-border bg-eerie-black border border-white/40 rounded-lg p-6 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <h3 className="text-sm font-medium text-gray-300 mb-1">{metric.title}</h3>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <span className={`text-sm font-medium ${metric.isPositive ? 'text-mint' : 'text-red-500'} flex items-center`}>
                  {metric.change}
                  {metric.isPositive ? (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Chart Tabs */}
        <div className="bg-eerie-black rounded-lg shadow-md border border-white/40 mb-6">
          <div className="border-b border-gray-800">
            <nav className="flex space-x-4 p-4">
              {chartTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChart(tab.id)}
                  className={`px-3 py-2 font-medium text-sm rounded-md ${
                    activeChart === tab.id
                      ? 'bg-hunter-green text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <svg className="animate-spin h-8 w-8 text-mint" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <>
                {activeChart === 'unemployment' && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white">Unemployment Trends (2014-2023)</h3>
                      <p className="text-gray-400">Tracking changes in unemployment rates and job growth over the past decade.</p>
                    </div>
                    <div className="h-80">
                      <Line data={unemploymentData} options={chartOptions} />
                    </div>
                  </div>
                )}
                
                {activeChart === 'crimeRate' && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white">Crime Rate Trends (2014-2023)</h3>
                      <p className="text-gray-400">Tracking changes in violent and property crime rates over the past decade.</p>
                    </div>
                    <div className="h-80">
                      <Bar data={crimeRateData} options={chartOptions} />
                    </div>
                  </div>
                )}
                
                {activeChart === 'correlation' && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white">Unemployment-Crime Correlation</h3>
                      <p className="text-gray-400">Exploring the relationship between unemployment rates and crime statistics.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="h-64">
                        <Line
                          data={{
                            labels: years,
                            datasets: [
                              {
                                label: 'Unemployment Rate',
                                data: [3.7, 3.6, 5.4, 8.1, 3.7, 3.9, 4.4, 4.9, 5.3, 4.7],
                                borderColor: '#3DD9D6',
                                backgroundColor: 'rgba(61, 217, 214, 0.5)',
                                yAxisID: 'y',
                              },
                              {
                                label: 'Crime Index',
                                data: [375, 380, 390, 400, 395, 385, 380, 390, 400, 410],
                                borderColor: '#2B6B39',
                                backgroundColor: 'rgba(43, 107, 57, 0.5)',
                                yAxisID: 'y1',
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            interaction: {
                              mode: 'index',
                              intersect: false,
                            },
                            scales: {
                              y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                title: {
                                  display: true,
                                  text: 'Unemployment %',
                                },
                              },
                              y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                title: {
                                  display: true,
                                  text: 'Crime Index',
                                },
                                grid: {
                                  drawOnChartArea: false,
                                },
                              },
                            },
                          }}
                        />
                      </div>
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center px-4">
                          <div className="text-3xl font-bold text-mint mb-2">0.63</div>
                          <p className="text-gray-400 mb-4">Correlation Coefficient</p>
                          <p className="text-sm text-gray-400">Moderate positive correlation between unemployment rates and overall crime index. Each 1% increase in unemployment correlates with approximately 15 point increase in crime index.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Distribution Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Crime Distribution */}
          <motion.div 
            className="mouse-position-border bg-eerie-black rounded-lg shadow-md border border-gray-800 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-medium text-mint mb-1">Crime Distribution by Type</h3>
            <p className="text-gray-400 mb-4">Breakdown of crime incidents by category for {selectedYear}.</p>
            <div className="h-64">
              <Pie data={crimeBySectorPieData} options={pieOptions} />
            </div>
          </motion.div>
          
          {/* Employment Distribution */}
          <motion.div 
            className="mouse-position-border bg-eerie-black rounded-lg shadow-md border border-gray-800 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-medium text-mint mb-1">Employment by Sector</h3>
            <p className="text-gray-400 mb-4">Distribution of employment across major industries for {selectedYear}.</p>
            <div className="h-64">
              <Pie data={employmentBySectorPieData} options={pieOptions} />
            </div>
          </motion.div>
        </div>
        
        {/* Key Insights */}
        <div className="bg-eerie-black rounded-xl shadow-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'State Comparison',
                description: 'California has 25% higher employment rates but 18% higher property crime compared to the national average.',
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
            ].map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-eerie-black rounded-lg p-5"
              >
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full mr-3">
                    {insight.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                </div>
                <p className="text-gray-400">{insight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Get More Data CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-eerie-black rounded-xl overflow-hidden shadow-card mb-4"
        >
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl font-bold text-white mb-3">Want deeper insights?</h2>
              <p className="text-white/80 max-w-xl">
                Explore our AI-powered analysis tools to discover patterns and correlations between crime and employment data.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/ai-insights"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-hunter-green hover:bg-hunter-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hunter-green"
              >
                Explore AI Insights
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 