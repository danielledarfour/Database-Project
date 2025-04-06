import { useState } from 'react'
import { motion } from 'framer-motion'

const VisualizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('bar')
  const [timeRange, setTimeRange] = useState('year')
  
  // Mock data for visualization
  const mockBarChartData = [
    { state: 'California', crimeRate: 420, employmentRate: 68.5 },
    { state: 'Texas', crimeRate: 384, employmentRate: 65.7 },
    { state: 'Florida', crimeRate: 462, employmentRate: 62.3 },
    { state: 'New York', crimeRate: 351, employmentRate: 64.8 },
    { state: 'Pennsylvania', crimeRate: 306, employmentRate: 61.5 },
  ]
  
  const mockLineChartData = [
    { year: 2015, crimeRate: 458, meanWage: 67500 },
    { year: 2016, crimeRate: 442, meanWage: 69000 },
    { year: 2017, crimeRate: 418, meanWage: 71200 },
    { year: 2018, crimeRate: 401, meanWage: 74500 },
    { year: 2019, crimeRate: 385, meanWage: 77800 },
    { year: 2020, crimeRate: 371, meanWage: 81200 },
    { year: 2021, crimeRate: 393, meanWage: 86500 },
    { year: 2022, crimeRate: 410, meanWage: 92400 },
  ]
  
  const mockPieChartData = [
    { crimeType: 'Assault', count: 35 },
    { crimeType: 'Burglary', count: 22 },
    { crimeType: 'Larceny', count: 18 },
    { crimeType: 'Motor Vehicle Theft', count: 12 },
    { crimeType: 'Robbery', count: 8 },
    { crimeType: 'Homicide', count: 5 },
  ]
  
  // Render mock charts based on active tab
  const renderChart = () => {
    switch (activeTab) {
      case 'bar':
        return (
          <div className="bg-dark-light p-6 rounded-xl h-96 flex items-center justify-center">
            <div className="w-full h-full">
              {/* Bar chart visualization - in real app, use Chart.js or D3.js */}
              <div className="flex h-full">
                <div className="flex flex-col justify-between pr-4 text-sm text-gray-400">
                  <span>800</span>
                  <span>600</span>
                  <span>400</span>
                  <span>200</span>
                  <span>0</span>
                </div>
                <div className="flex-1 flex items-end justify-between gap-8 pb-10">
                  {mockBarChartData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div className="flex items-end gap-1">
                        <div 
                          className="w-10 bg-primary rounded-t-sm" 
                          style={{ height: `${item.crimeRate / 8}px` }}
                        ></div>
                        <div 
                          className="w-10 bg-secondary rounded-t-sm" 
                          style={{ height: `${item.employmentRate * 5}px` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 -rotate-45 origin-top-left mt-4">{item.state}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-4 text-sm text-gray-400">
                <div className="flex items-center mr-4">
                  <div className="w-4 h-4 bg-primary mr-1"></div>
                  <span>Crime Rate</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-secondary mr-1"></div>
                  <span>Employment Rate</span>
                </div>
              </div>
            </div>
          </div>
        )
        
      case 'line':
        return (
          <div className="bg-dark-light p-6 rounded-xl h-96 flex items-center justify-center">
            <div className="w-full h-full">
              {/* Line chart visualization */}
              <div className="flex h-full">
                <div className="flex flex-col justify-between pr-4 text-sm text-gray-400">
                  <span>500</span>
                  <span>400</span>
                  <span>300</span>
                  <span>200</span>
                  <span>100</span>
                </div>
                <div className="flex-1 relative h-full">
                  <svg viewBox="0 0 800 300" className="w-full h-full">
                    {/* Crime rate line */}
                    <polyline
                      points={mockLineChartData.map((d, i) => `${100 * i + 50},${300 - d.crimeRate / 2}`).join(' ')}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                    />
                    {/* Mean wage line */}
                    <polyline
                      points={mockLineChartData.map((d, i) => `${100 * i + 50},${300 - d.meanWage / 400}`).join(' ')}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                    />
                    {/* X axis labels */}
                    {mockLineChartData.map((d, i) => (
                      <text key={i} x={100 * i + 50} y="320" fill="#9CA3AF" fontSize="12" textAnchor="middle">
                        {d.year}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>
              <div className="flex justify-center mt-4 text-sm text-gray-400">
                <div className="flex items-center mr-4">
                  <div className="w-4 h-4 bg-primary mr-1"></div>
                  <span>Crime Rate</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-secondary mr-1"></div>
                  <span>Mean Wage ($k)</span>
                </div>
              </div>
            </div>
          </div>
        )
        
      case 'pie':
        return (
          <div className="bg-dark-light p-6 rounded-xl h-96 flex items-center justify-center">
            <div className="w-full max-w-md mx-auto">
              {/* Pie chart visualization */}
              <div className="relative h-64 w-64 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* SVG Pie Chart - In real app, use Chart.js */}
                  <circle cx="50" cy="50" r="45" fill="#1F2937" />
                  
                  {/* Fake pie segments */}
                  <path d="M50 5 A45 45 0 0 1 94.7 66.8 L50 50 Z" fill="#3B82F6" />
                  <path d="M50 5 A45 45 0 0 0 5.3 66.8 L50 50 Z" fill="#10B981" />
                  <path d="M5.3 66.8 A45 45 0 0 0 50 95 L50 50 Z" fill="#F59E0B" />
                  <path d="M50 95 A45 45 0 0 0 94.7 66.8 L50 50 Z" fill="#EF4444" />
                  <path d="M50 95 A45 45 0 0 0 94.7 66.8 L50 50 Z" fill="#8B5CF6" />
                  <path d="M50 95 A45 45 0 0 0 94.7 66.8 L50 50 Z" fill="#EC4899" />
                </svg>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {mockPieChartData.map((item, index) => {
                  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
                  return (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-4 h-4 mr-2 rounded-sm"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <span className="text-sm text-gray-300">{item.crimeType} ({item.count}%)</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }
  
  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="heading-lg mb-2">Visualization Dashboard</h1>
            <p className="text-gray-300">
              Interactive visualizations to explore crime and employment data relationships.
            </p>
          </div>
          
          <div className="flex gap-2">
            <select 
              className="input-field"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="year">Last Year</option>
              <option value="5years">Last 5 Years</option>
              <option value="10years">Last 10 Years</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
        
        {/* Chart type tabs */}
        <div className="flex mb-6 border-b border-dark-lighter">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'bar' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('bar')}
          >
            Bar Chart
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'line' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('line')}
          >
            Line Chart
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'pie' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('pie')}
          >
            Pie Chart
          </button>
        </div>
        
        {/* Chart container */}
        <div className="mb-6">
          {renderChart()}
        </div>
        
        {/* Insights panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="card">
            <h3 className="heading-md mb-4">Key Insights</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span className="text-gray-300 text-sm">States with higher employment rates show an average 15% reduction in violent crime.</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span className="text-gray-300 text-sm">Crime rates have decreased by 11% nationally over the past decade.</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span className="text-gray-300 text-sm">States with average wages 20% above the national mean have 8% lower property crime rates.</span>
              </li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="heading-md mb-4">Trend Analysis</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-secondary mr-2">↗</span>
                <span className="text-gray-300 text-sm">Employment in technology sectors shows an upward trend of 3.2% annually.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">↘</span>
                <span className="text-gray-300 text-sm">Violent crime decreased 2.5% on average in states with growing tech sectors.</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">↔</span>
                <span className="text-gray-300 text-sm">Property crime rates remain relatively stable despite wage increases in certain regions.</span>
              </li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="heading-md mb-4">AI Summary</h3>
            <p className="text-gray-300 text-sm mb-4">
              The data indicates a consistent negative correlation between employment rates and violent crime. 
              States with more technology and healthcare jobs typically show lower crime rates than those with predominantly 
              manufacturing and retail sectors, independent of wage differences.
            </p>
            <button className="btn-primary text-sm">
              Generate Detailed Report
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VisualizationDashboard 