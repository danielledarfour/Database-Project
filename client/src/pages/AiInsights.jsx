import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const AiInsights = () => {
  const [messages, setMessages] = useState([
    {
      type: 'system',
      text: 'Hello! I\'m InvestiGator, your AI assistant. Ask me anything about crime and employment data across the United States.',
      timestamp: new Date()
    }
  ])
  
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(null)
  const messagesEndRef = useRef(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Sample AI suggestions
  const suggestionCategories = [
    {
      name: 'Crime Analysis',
      suggestions: [
        'What are the top 5 states with the highest violent crime rates?',
        'How has the murder rate changed over the last decade?',
        'Which cities have seen the biggest decrease in property crime?'
      ]
    },
    {
      name: 'Employment Insights',
      suggestions: [
        'Which states have the highest employment rates in technology sectors?',
        'What is the average wage for healthcare workers across different states?',
        'Show me the trend of employment in manufacturing over the last 5 years'
      ]
    },
    {
      name: 'Correlations',
      suggestions: [
        'Is there a correlation between unemployment rates and violent crime?',
        'Do states with higher average wages have lower crime rates?',
        'Which job sectors show the strongest correlation with reduced crime?'
      ]
    }
  ]
  
  // Mock responses based on certain keywords - in a real app, this would come from an API
  const getMockResponse = (question) => {
    const lowerCaseQuestion = question.toLowerCase()
    
    if (lowerCaseQuestion.includes('highest violent crime') || lowerCaseQuestion.includes('top 5 states')) {
      return {
        text: 'Based on the latest data, the states with the highest violent crime rates are:\n\n1. Louisiana (549.3 per 100,000)\n2. Alaska (538.9 per 100,000)\n3. New Mexico (832.2 per 100,000)\n4. Missouri (542.7 per 100,000)\n5. South Carolina (511.3 per 100,000)\n\nWould you like to see how these correlate with employment data?',
        chart: 'bar'
      }
    } else if (lowerCaseQuestion.includes('murder rate') || lowerCaseQuestion.includes('homicide')) {
      return {
        text: 'The U.S. murder rate has fluctuated over the past decade. After reaching historic lows in 2014 (4.4 per 100,000), it rose to 6.1 per 100,000 in 2020, representing a 38% increase. In 2021, the rate slightly decreased to 5.9 per 100,000. The most significant increases occurred in 2015 and 2020.',
        chart: 'line'
      }
    } else if (lowerCaseQuestion.includes('correlation') || lowerCaseQuestion.includes('unemployment')) {
      return {
        text: 'There is a moderate positive correlation (r = 0.41) between unemployment rates and violent crime across states. However, the relationship is complex and varies by region. States with unemployment rates 2% above the national average show approximately 8% higher violent crime rates on average. Other socioeconomic factors, like education level and income inequality, also play significant roles.',
        chart: 'scatter'
      }
    } else if (lowerCaseQuestion.includes('tech') || lowerCaseQuestion.includes('technology')) {
      return {
        text: 'The states with the highest employment rates in technology sectors are:\n\n1. California (9.2% of workforce)\n2. Washington (8.7%)\n3. Massachusetts (8.5%)\n4. Colorado (7.9%)\n5. Virginia (7.6%)\n\nThese states also tend to have higher average wages overall, with tech workers earning 64% more than the national average wage across all industries.',
        chart: 'bar'
      }
    } else if (lowerCaseQuestion.includes('wage') || lowerCaseQuestion.includes('salary')) {
      return {
        text: 'States with higher average wages do show a statistically significant negative correlation with property crime rates (r = -0.37). For every $10,000 increase in average annual wage, property crime rates decrease by approximately 6.3% on average. However, the relationship with violent crime is weaker (r = -0.21), suggesting that factors beyond economic prosperity influence violent crime patterns.',
        chart: 'scatter'
      }
    } else {
      return {
        text: 'Based on our data analysis, I can tell you that there\'s significant regional variation in both crime patterns and employment statistics across the United States. The relationship between these factors is complex and influenced by numerous socioeconomic variables. Would you like me to explore any specific aspect of this relationship in more detail?',
        chart: null
      }
    }
  }
  
  const renderChart = (type) => {
    if (!type) return null
    
    // Simplified chart renderings - in a real app, use Chart.js, D3.js, etc.
    switch (type) {
      case 'bar':
        return (
          <div className="mt-2 bg-dark-lighter p-3 rounded-md">
            <div className="h-32 flex items-end justify-between px-2">
              {['LA', 'AK', 'NM', 'MO', 'SC'].map((state, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="w-12 bg-primary rounded-t-sm" 
                    style={{ height: `${80 - i * 10}px` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-1">{state}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 text-center mt-2">Top 5 States by Violent Crime Rate</div>
          </div>
        )
      
      case 'line':
        return (
          <div className="mt-2 bg-dark-lighter p-3 rounded-md">
            <div className="h-32 relative">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <polyline
                  points="10,70 30,75 50,65 70,67 90,60 110,40 130,50 150,45 170,48 190,35"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
                
                {/* X axis */}
                <line x1="10" y1="90" x2="190" y2="90" stroke="#4B5563" strokeWidth="1" />
                
                {/* Years */}
                {['13', '14', '15', '16', '17', '18', '19', '20', '21', '22'].map((year, i) => (
                  <text key={i} x={10 + i * 20} y="98" fill="#9CA3AF" fontSize="6" textAnchor="middle">
                    '{year}
                  </text>
                ))}
              </svg>
            </div>
            <div className="text-xs text-gray-400 text-center mt-2">U.S. Murder Rate Trend (2013-2022)</div>
          </div>
        )
      
      case 'scatter':
        return (
          <div className="mt-2 bg-dark-lighter p-3 rounded-md">
            <div className="h-32 relative">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                {/* Generate random scatter points */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const x = 20 + Math.random() * 160
                  const y = 20 + Math.random() * 60
                  return (
                    <circle key={i} cx={x} cy={y} r="2" fill="#3B82F6" />
                  )
                })}
                
                {/* Trend line */}
                <line x1="20" y1="60" x2="180" y2="30" stroke="#10B981" strokeWidth="1" strokeDasharray="2,2" />
                
                {/* Axes */}
                <line x1="10" y1="90" x2="190" y2="90" stroke="#4B5563" strokeWidth="1" />
                <line x1="10" y1="10" x2="10" y2="90" stroke="#4B5563" strokeWidth="1" />
                
                <text x="100" y="98" fill="#9CA3AF" fontSize="6" textAnchor="middle">Unemployment Rate</text>
                <text x="5" y="50" fill="#9CA3AF" fontSize="6" textAnchor="middle" transform="rotate(-90, 5, 50)">Crime Rate</text>
              </svg>
            </div>
            <div className="text-xs text-gray-400 text-center mt-2">Correlation between Unemployment and Crime</div>
          </div>
        )
      
      default:
        return null
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (input.trim() === '') return
    
    // Add user message
    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    // Simulate AI thinking
    setTimeout(() => {
      const response = getMockResponse(input)
      
      const aiMessage = {
        type: 'ai',
        text: response.text,
        chart: response.chart,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2s for realism
  }
  
  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="heading-lg mb-2">AI Powered Insights</h1>
            <p className="text-gray-300">
              Chat with InvestiGator AI to uncover insights and trends from crime and employment data.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Chat suggestions */}
          <div className="md:col-span-1">
            <div className="card">
              <h3 className="heading-md mb-4">Suggested Queries</h3>
              <div className="space-y-4">
                {suggestionCategories.map((category, i) => (
                  <div key={i}>
                    <h4 className="text-sm font-semibold text-primary mb-2">{category.name}</h4>
                    <ul className="space-y-2">
                      {category.suggestions.map((suggestion, j) => (
                        <li key={j}>
                          <button
                            className="text-xs text-left text-gray-300 hover:text-white transition-colors w-full truncate"
                            onClick={() => setInput(suggestion)}
                          >
                            {suggestion}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-dark-lighter">
                <h4 className="text-sm font-semibold text-white mb-2">About InvestiGator AI</h4>
                <p className="text-xs text-gray-400">
                  InvestiGator AI is powered by advanced natural language processing to help you explore complex relationships in crime and employment data across the United States.
                </p>
              </div>
            </div>
          </div>
          
          {/* Chat interface */}
          <div className="md:col-span-3">
            <div className="card h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4">
                <div className="space-y-4 p-2">
                  {messages.map((message, index) => (
                    <div 
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user' 
                            ? 'bg-primary text-white' 
                            : message.type === 'system'
                            ? 'bg-dark-lighter text-gray-300 border border-dark-lighter'
                            : 'bg-dark-lighter text-gray-300'
                        }`}
                      >
                        {message.type !== 'user' && (
                          <div className="flex items-center mb-1">
                            <span className="font-semibold text-xs text-accent">InvestiGator AI</span>
                            <span className="text-gray-500 text-xs ml-2">{formatTime(message.timestamp)}</span>
                          </div>
                        )}
                        
                        <div className="text-sm whitespace-pre-line">{message.text}</div>
                        
                        {message.chart && renderChart(message.chart)}
                        
                        {message.type === 'user' && (
                          <div className="flex justify-end mt-1">
                            <span className="text-gray-300 text-xs">{formatTime(message.timestamp)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-dark-lighter rounded-lg p-3 max-w-[80%]">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <div className="border-t border-dark-lighter pt-4">
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      className="input-field w-full pr-12"
                      placeholder="Ask InvestiGator AI a question..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary-dark text-white p-2 rounded-md disabled:opacity-50"
                      disabled={input.trim() === '' || isTyping}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </form>
                
                <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
                  <span>Powered by advanced AI</span>
                  <button className="text-primary">Clear conversation</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>InvestiGator AI uses data from 2010-2022 to provide insights. Always verify critical information.</p>
        </div>
      </motion.div>
    </div>
  )
}

export default AiInsights 