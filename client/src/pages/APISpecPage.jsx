import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Code } from 'lucide-react'

const APISpecPage = () => {
    const [expandedSections, setExpandedSections] = useState({})

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }))
    }

    const renderParams = (params, type = "parameters") => {
        if (!params || params.length === 0) return <p className="text-mint/70 italic">None</p>
        
        return (
            <div className="mt-2 text-sm">
                {params.map((param, idx) => (
                    <div key={idx} className="mb-3 last:mb-0 bg-eerie-black/20 p-3 rounded-md">
                        <div className="flex justify-between">
                            <span className="text-mint font-medium">{param.name}</span>
                            <span className="text-white/60">{param.type}</span>
                        </div>
                        <p className="text-white/80 mt-1">{param.description}</p>
                        {param.required && <span className="text-xs bg-mint/30 text-white px-2 py-0.5 rounded mt-1 inline-block">Required</span>}
                    </div>
                ))}
            </div>
        )
    }

    const renderEndpoint = (endpoint, index) => {
        const isExpanded = expandedSections[endpoint.id] || false
        
        return (
            <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mouse-position-border bg-eerie-black rounded-lg shadow-md border border-gray-800 p-6 mb-8"
            >
                <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection(endpoint.id)}
                >
                    <div>
                        <div className="flex items-center">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 260,
                                    damping: 20,
                                    delay: index * 0.15 + 0.2
                                }}
                                className="bg-mint text-eerie-black font-bold w-7 h-7 rounded-full flex items-center justify-center mr-3"
                            >
                                {endpoint.routeNumber}
                            </motion.div>
                            <span className={`text-white bg-mint px-3 py-1 rounded text-sm font-bold mr-3 uppercase`}>
                                {endpoint.method}
                            </span>
                            <h3 className="text-lg font-medium text-mint">{endpoint.path}</h3>
                        </div>
                        <p className="text-gray-400 mt-1">{endpoint.description}</p>
                    </div>
                    <div className="text-white">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
                
                {isExpanded && (
                    <div className="mt-6 border-t border-gray-800 pt-4">
                        {/* Route Parameters */}
                        <div className="mb-6">
                            <h4 className="text-white font-medium mb-2">Route Parameters</h4>
                            {renderParams(endpoint.routeParams)}
                        </div>
                        
                        {/* Query Parameters */}
                        <div className="mb-6">
                            <h4 className="text-white font-medium mb-2">Query Parameters</h4>
                            {renderParams(endpoint.queryParams)}
                        </div>
                        
                        {/* Return Type */}
                        <div className="mb-6">
                            <h4 className="text-white font-medium mb-2">Return Type</h4>
                            <p className="text-mint/90">{endpoint.returnType}</p>
                        </div>
                        
                        {/* Return Parameters */}
                        <div>
                            <h4 className="text-white font-medium mb-2">Return Parameters</h4>
                            {renderParams(endpoint.returnParams, "return")}
                        </div>
                    </div>
                )}
            </motion.div>
        )
    }

    const endpoints = [
        {
            id: 'top-crime-cities',
            routeNumber: 1,
            method: 'GET',
            path: '/crime/:state/:year',
            description: 'Get top 5 cities with the highest number of reported crime incidents for a given state and year.',
            routeParams: [
                {
                    name: 'state',
                    type: 'string',
                    description: 'Full state name as stored in State.StateName.',
                    required: true
                },
                {
                    name: 'year',
                    type: 'integer',
                    description: '4 digit year (e.g. 2023).',
                    required: true
                }
            ],
            queryParams: [],
            returnType: 'JSON array',
            returnParams: [
                {
                    name: 'City',
                    type: 'string',
                    description: 'City name.'
                },
                {
                    name: 'TotalIncidents',
                    type: 'integer',
                    description: 'Aggregated incident count for that city in the given year.'
                }
            ]
        },
        {
            id: 'housing-snapshot',
            routeNumber: 2,
            method: 'GET',
            path: '/housing/:state/:city/:propertyType',
            description: 'Returns median list price, median sale price, and their difference for the specified property type in a given city and U.S. state.',
            routeParams: [
                {
                    name: 'state',
                    type: 'string',
                    description: 'Full state name as stored in State.StateName.',
                    required: true
                },
                {
                    name: 'city',
                    type: 'string',
                    description: 'City name as stored in HousingRecord.City.',
                    required: true
                },
                {
                    name: 'propertyType',
                    type: 'string',
                    description: 'E.g., "Single‑Family", "Condo", etc.',
                    required: true
                }
            ],
            queryParams: [],
            returnType: 'JSON array',
            returnParams: [
                {
                    name: 'city',
                    type: 'string',
                    description: 'City name (h.City).'
                },
                {
                    name: 'propertyType',
                    type: 'string',
                    description: 'Property category.'
                },
                {
                    name: 'medianListPrice',
                    type: 'number',
                    description: 'Median asking price.'
                },
                {
                    name: 'medianSalePrice',
                    type: 'number',
                    description: 'Median closed‑sale price.'
                },
                {
                    name: 'priceDifference',
                    type: 'number',
                    description: 'medianListPrice - medianSalePrice.'
                }
            ]
        },
        {
            id: 'state-housing-market',
            routeNumber: 3,
            method: 'GET',
            path: '/state/:state',
            description: 'For every city in the specified U.S. state, returns the average sale price and the total number of homes sold, broken out by property type.',
            routeParams: [
                {
                    name: 'state',
                    type: 'string',
                    description: 'Full state name.',
                    required: true
                }
            ],
            queryParams: [],
            returnType: 'JSON array',
            returnParams: [
                {
                    name: 'city',
                    type: 'string',
                    description: 'City name.'
                },
                {
                    name: 'propertyType',
                    type: 'string',
                    description: 'Category of dwelling.'
                },
                {
                    name: 'avgSalePrice',
                    type: 'number',
                    description: 'Average of MedianSalePrice, rounded to two decimals.'
                },
                {
                    name: 'totalHomesSold',
                    type: 'integer',
                    description: 'Total count of homes sold in the state.'
                }
            ]
        },
        {
            id: 'housing-metrics-timespan',
            routeNumber: 4,
            method: 'GET',
            path: '/housing-route/:state/:startYear/:endYear',
            description: 'Returns housing metrics across a specified year range for a given state, including crime incidents, sale prices, and occupation data.',
            routeParams: [
                {
                    name: 'state',
                    type: 'string',
                    description: 'Full state name.',
                    required: true
                },
                {
                    name: 'startYear',
                    type: 'integer',
                    description: 'Starting year for the range.',
                    required: true
                },
                {
                    name: 'endYear',
                    type: 'integer',
                    description: 'Ending year for the range.',
                    required: true
                }
            ],
            queryParams: [],
            returnType: 'JSON array',
            returnParams: [
                {
                    name: 'city',
                    type: 'string',
                    description: 'City name.'
                },
                {
                    name: 'stateName',
                    type: 'string',
                    description: 'State name.'
                },
                {
                    name: 'stateId',
                    type: 'integer',
                    description: 'State identifier.'
                },
                {
                    name: 'occupationTitle',
                    type: 'string',
                    description: 'Job title.'
                },
                {
                    name: 'avgIncidents',
                    type: 'number',
                    description: 'Average crime incidents.'
                },
                {
                    name: 'avgSalePrice',
                    type: 'number',
                    description: 'Average property sale price.'
                },
                {
                    name: 'avgEmployment',
                    type: 'number',
                    description: 'Average employment wage.'
                },
                {
                    name: 'numPropertyTypes',
                    type: 'integer',
                    description: 'Number of property types in the dataset.'
                }
            ]
        },
        {
            id: 'occupation-wages',
            routeNumber: 5,
            method: 'GET',
            path: '/state/:state/:year',
            description: 'Returns the average annual wage for every occupation title in the specified U.S. state for a given calendar year – but only if that state has both housing and crime records for that same year.',
            routeParams: [
                {
                    name: 'state',
                    type: 'string',
                    description: 'Full state name.',
                    required: true
                },
                {
                    name: 'year',
                    type: 'integer',
                    description: '4 digit year.',
                    required: true
                }
            ],
            queryParams: [],
            returnType: 'JSON array',
            returnParams: [
                {
                    name: 'occupationTitle',
                    type: 'string',
                    description: 'Job/role title.'
                },
                {
                    name: 'avgWage',
                    type: 'number',
                    description: 'Rounded mean annual wage for that occupation in the given year.'
                }
            ]
        },
        {
            id: 'crime-trend',
            routeNumber: 6,
            method: 'GET',
            path: '/five-years/:state',
            description: 'Returns the total number of reported crime incidents for each year in the specified U.S. state. The array is sorted by year (oldest → newest).',
            routeParams: [
                {
                    name: 'state',
                    type: 'string',
                    description: 'Full state name.',
                    required: true
                }
            ],
            queryParams: [],
            returnType: 'JSON array',
            returnParams: [
                {
                    name: 'year',
                    type: 'integer',
                    description: '4‑digit calendar year.'
                },
                {
                    name: 'totalIncidents',
                    type: 'integer',
                    description: 'Aggregated incident count for that year.'
                }
            ]
        },
        {
            id: 'housing-affordability',
            routeNumber: 7,
            method: 'GET',
            path: '/housing/affordability',
            description: 'Returns, for every U.S. state, the median home‑sale price, the average annual wage, and the resulting price‑to‑income ratio (median price ÷ average wage).',
            routeParams: [],
            queryParams: [],
            returnType: 'JSON array',
            returnParams: [
                {
                    name: 'stateName',
                    type: 'string',
                    description: 'Name of the state.'
                },
                {
                    name: 'medianPrice',
                    type: 'number',
                    description: 'State‑wide median sale price for homes.'
                },
                {
                    name: 'avgWage',
                    type: 'number',
                    description: 'Average annual wage across all occupations.'
                },
                {
                    name: 'priceToIncomeRatio',
                    type: 'number',
                    description: 'medianPrice / avgWage, rounded to two decimals.'
                }
            ]
        },
        {
            id: 'workforce-analysis',
            routeNumber: 8,
            method: 'GET',
            path: '/job/:pctWorkforce/:pctWage',
            description: 'For each state, returns all occupation titles that have a combined workforce share below pctWorkforce% and average wage above pctWage% of the state average.',
            routeParams: [
                {
                    name: 'pctWorkforce',
                    type: 'number',
                    description: '% upper bound on workforce share (e.g., 2.5 for 2.5%).',
                    required: true
                },
                {
                    name: 'pctWage',
                    type: 'number',
                    description: 'Minimum percentage the occupation\'s wage must exceed the state average (e.g., 10 for 10%).',
                    required: true
                }
            ],
            queryParams: [],
            returnType: 'JSON array',
            returnParams: [
                {
                    name: 'stateId',
                    type: 'integer',
                    description: 'State identifier.'
                },
                {
                    name: 'stateName',
                    type: 'string',
                    description: 'Name of the state.'
                },
                {
                    name: 'occupationTitle',
                    type: 'string',
                    description: 'Job/role title.'
                },
                {
                    name: 'workforcePct',
                    type: 'number',
                    description: 'Summed % share of state employment.'
                },
                {
                    name: 'occupationAvgWage',
                    type: 'number',
                    description: 'Mean annual wage for that occupation in the state.'
                },
                {
                    name: 'amountAboveStateAvg',
                    type: 'number',
                    description: 'Dollars the occupation\'s wage sits above the state average.'
                }
            ]
        },
        {
            id: 'top-jobs',
            routeNumber: 9,
            method: 'GET',
            path: '/job/:state',
            description: 'Returns the top occupations with the highest percentage share of total employment in the specified U.S. state.',
            routeParams: [
                {
                    name: 'state',
                    type: 'string',
                    description: 'Full state name.',
                    required: true
                }
            ],
            queryParams: [],
            returnType: 'JSON array',
            returnParams: [
                {
                    name: 'occupationTitle',
                    type: 'string',
                    description: 'Job/role title.'
                },
                {
                    name: 'emp',
                    type: 'integer',
                    description: 'Number of employees in the occupation.'
                },
                {
                    name: 'truePct',
                    type: 'number',
                    description: 'True percentage of the state\'s jobs represented by this occupation.'
                }
            ]
        },
        {
            id: 'top-cities-by-property-type',
            routeNumber: 10,
            method: 'GET',
            path: '/housing/:state/:propertyType',
            description: 'Returns the top 20 cities with the highest median sale price for a specific property type in the specified U.S. state.',
            routeParams: [
                {
                    name: 'state',
                    type: 'string',
                    description: 'Full state name.',
                    required: true
                },
                {
                    name: 'propertyType',
                    type: 'string',
                    description: 'Type of property (e.g., "Single Family Residential", "Condo")',
                    required: true
                }
            ],
            queryParams: [],
            returnType: 'JSON array',
            returnParams: [
                {
                    name: 'city',
                    type: 'string',
                    description: 'City name.'
                },
                {
                    name: 'medianSalePrice',
                    type: 'number',
                    description: 'Median closing price for the specified property type.'
                }
            ]
        },
        {
            id: 'top-single-family-cities',
            routeNumber: 11,
            method: 'GET',
            path: '/housing/:state',
            description: 'Returns the 20 cities with the highest median sale price for "Single Family Residential" homes in the specified U.S. state.',
            routeParams: [
                {
                    name: 'state',
                    type: 'string',
                    description: 'Full state name.',
                    required: true
                }
            ],
            queryParams: [],
            returnType: 'JSON array',
            returnParams: [
                {
                    name: 'city',
                    type: 'string',
                    description: 'City name.'
                },
                {
                    name: 'medianSalePrice',
                    type: 'number',
                    description: 'Median closing price for single‑family homes.'
                }
            ]
        }
    ]

    return (
        <div className="bg-white min-h-screen py-16">
            <div className="container-custom mx-auto px-4 md:px-8">
                {/* Header */}
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center px-4 py-1 mb-4 glow-border-white rounded-full bg-eerie-black text-white text-sm">
                        <Code size={16} className="mr-2" />
                        <span>Developer Resources</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-eerie-black mb-4">
                        API Documentation
                    </h1>
                    <p className="text-lg text-eerie-black/70 max-w-3xl mx-auto">
                        Integrate crime and housing data into your applications with our comprehensive API.
                        Below you'll find detailed specifications for all available endpoints.
                    </p>
                </motion.div>

                {/* Base URL Section */}
                <motion.div 
                    className="bg-mint rounded-lg p-6 border border-mint/30 mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-medium text-eerie-black mb-2">Base URL</h2>
                    <div className="bg-eerie-black text-mint p-3 rounded font-mono inline-block">
                        {import.meta.env.VITE_SERVER_URL}
                        <br />
                        This is a local development server. It is not suitable for production use.
                    </div>
                </motion.div>

                {/* Authentication Section */}
                <motion.div 
                    className="mouse-position-border bg-eerie-black rounded-lg shadow-md border border-gray-800 p-6 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-medium text-mint mb-4">Authentication</h2>
                    <p className="text-gray-300 mb-4">
                        At the moment, API requests do not require an API key. However, we reserve the right to require an API key in the future.
                    </p>
                    <h3 className="text-mint font-medium mb-2">Rate Limiting</h3>
                    <p className="text-gray-300">
                        Do not abuse the API. We reserve the right to limit or block requests that we deem to be abusive.
                    </p>
                </motion.div>

                {/* Endpoints */}
                <h2 className="text-2xl font-heading font-bold text-eerie-black mb-6">Endpoints</h2>
                
                {endpoints.map(renderEndpoint)}
            </div>
        </div>
    )
}

export default APISpecPage