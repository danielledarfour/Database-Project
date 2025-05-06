import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../ui/Input";
import axios from "axios";
import styled from "styled-components";
import { Line } from 'react-chartjs-2';
import cityData, { usStates } from "../../utils/cityData";
import Loader from "../../ui/Loader";

export default function CrimeIncidentsQuestion() {
    // State search
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [filteredStates, setFilteredStates] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    
    // Results state
    const [crimeData, setCrimeData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
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

    // Handle state selection from search results
    const handleStateSelect = (state) => {
        setSelectedState(state.name);
        setSearchQuery(state.name);
        setShowSearchResults(false);
        fetchCrimeData(state.name);
    };

    // Handle input change for state search
    const handleInputChange = (value) => {
        setSearchQuery(value);
        if (!value) {
            setSelectedState("");
            setCrimeData([]);
        }
    };

    // Fetch crime data for the selected state
    const fetchCrimeData = async (state) => {
        if (!state) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            // Replace spaces with underscores for URL safety
            const formattedState = state.toLowerCase().replace(/ /g, '_');
            const response = await axios.get(`/api/five-years/${formattedState}`);
            
            // Sort data by year to ensure proper trend line
            const sortedData = response.data.sort((a, b) => a.year - b.year);
            setCrimeData(sortedData);
        } catch (err) {
            console.error("Error fetching crime data:", err);
            setError("Failed to fetch crime data. Please try again.");
            setCrimeData([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate trends and statistics
    const calculateStats = () => {
        if (!crimeData || crimeData.length < 2) return null;
        
        // Calculate percent changes between consecutive years
        const changes = [];
        for (let i = 1; i < crimeData.length; i++) {
            const currentYear = crimeData[i];
            const previousYear = crimeData[i-1];
            const percentChange = ((currentYear.totalincidents - previousYear.totalincidents) / previousYear.totalincidents) * 100;
            
            changes.push({
                fromYear: previousYear.year,
                toYear: currentYear.year,
                percentChange: percentChange
            });
        }
        
        // Calculate overall change
        const firstYear = crimeData[0];
        const lastYear = crimeData[crimeData.length - 1];
        const overallChange = ((lastYear.totalincidents - firstYear.totalincidents) / firstYear.totalincidents) * 100;
        
        // Find year with highest incidents
        const maxIncidents = Math.max(...crimeData.map(d => d.totalincidents));
        const peakYear = crimeData.find(d => d.totalincidents === maxIncidents);
        
        // Find year with lowest incidents
        const minIncidents = Math.min(...crimeData.map(d => d.totalincidents));
        const lowestYear = crimeData.find(d => d.totalincidents === minIncidents);
        
        return {
            changes,
            overallChange,
            peakYear,
            lowestYear,
            averageIncidents: crimeData.reduce((sum, d) => sum + d.totalincidents, 0) / crimeData.length
        };
    };

    // Prepare chart data
    const prepareChartData = () => {
        if (!crimeData || crimeData.length === 0) return null;
        
        return {
            labels: crimeData.map(d => d.year),
            datasets: [
                {
                    label: `Crime Incidents in ${selectedState}`,
                    data: crimeData.map(d => d.totalincidents),
                    fill: false,
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: 'rgb(16, 185, 129)',
                    tension: 0.1,
                    pointBackgroundColor: 'rgb(16, 185, 129)',
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        };
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#ffffff',
                    callback: function(value) {
                        return value.toLocaleString();
                    }
                },
                title: {
                    display: true,
                    text: 'Total Crime Incidents',
                    color: '#ffffff',
                    font: {
                        size: 14
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#ffffff'
                },
                title: {
                    display: true,
                    text: 'Year',
                    color: '#ffffff',
                    font: {
                        size: 14
                    }
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff',
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Incidents: ${context.raw.toLocaleString()}`;
                    }
                }
            }
        }
    };

    // Format number with commas
    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    // Format percentage
    const formatPercentage = (num) => {
        return num.toFixed(2) + '%';
    };

    const stats = calculateStats();

    return (
        <>
            {/* Search Section */}
            <div className="space-y-4">
                {/* State Search with Input.jsx */}
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
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 p-3 bg-red-600/20 border border-red-600/50 text-white rounded-md"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading State */}
            {isLoading && (
                <div className="mt-6 w-full flex items-center justify-center py-12">
                    <div className="text-center">
                        <Loader />
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!crimeData.length && !isLoading && !error && (
                <div className="mt-6 bg-eerie-black/50 rounded-lg border border-mint/20 p-6">
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-mint/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h2 className="text-xl font-medium text-white mb-2">No Crime Data Selected</h2>
                        <p className="text-white/70 max-w-lg mx-auto mb-6">
                            Search for a state using the search bar above to view crime incident trends over time.
                        </p>
                    </div>
                </div>
            )}

            {/* Results Section */}
            <AnimatePresence>
                {crimeData.length > 0 && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-8"
                    >
                        <div className="bg-eerie-black/90 rounded-lg shadow-lg border border-mint/30 p-6">
                            <h2 className="text-2xl font-bold text-white mb-4 border-b border-mint/30 pb-2">
                                Crime Trends in {selectedState}
                            </h2>

                            {/* Stats Overview */}
                            {stats && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-eerie-black/60 p-4 rounded-lg border border-mint/20">
                                        <p className="text-mint/70 text-sm">Overall Change</p>
                                        <p className={`text-2xl font-bold ${stats.overallChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {stats.overallChange >= 0 ? '+' : ''}{formatPercentage(stats.overallChange)}
                                        </p>
                                        <p className="text-white/70 text-sm mt-1">
                                            From {crimeData[0].year} to {crimeData[crimeData.length - 1].year}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-eerie-black/60 p-4 rounded-lg border border-mint/20">
                                        <p className="text-mint/70 text-sm">Peak Crime Year</p>
                                        <p className="text-2xl font-bold text-white">{stats.peakYear.year}</p>
                                        <p className="text-mint text-sm mt-1">
                                            {formatNumber(stats.peakYear.totalincidents)} incidents
                                        </p>
                                    </div>
                                    
                                    <div className="bg-eerie-black/60 p-4 rounded-lg border border-mint/20">
                                        <p className="text-mint/70 text-sm">Lowest Crime Year</p>
                                        <p className="text-2xl font-bold text-white">{stats.lowestYear.year}</p>
                                        <p className="text-mint text-sm mt-1">
                                            {formatNumber(stats.lowestYear.totalincidents)} incidents
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Chart Display */}
                            <div className="bg-eerie-black/50 border border-mint/20 rounded-lg p-4 mb-6">
                                <div className="h-[400px]">
                                    {prepareChartData() && (
                                        <Line data={prepareChartData()} options={chartOptions} />
                                    )}
                                </div>
                            </div>

                            {/* Year-by-Year Changes */}
                            {stats && stats.changes.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-mint mb-3">Year-by-Year Changes</h3>
                                    <div className="bg-eerie-black/50 border border-mint/20 rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-mint/20">
                                            <thead className="bg-eerie-black/70">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mint uppercase tracking-wider">
                                                        Period
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-mint uppercase tracking-wider">
                                                        Change
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-mint/10">
                                                {stats.changes.map((change, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? 'bg-eerie-black/30' : 'bg-eerie-black/50'}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                            {change.fromYear} to {change.toYear}
                                                        </td>
                                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${change.percentChange >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                            {change.percentChange >= 0 ? '+' : ''}{formatPercentage(change.percentChange)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Data Table */}
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-mint mb-3">Crime Incidents by Year</h3>
                                <div className="bg-eerie-black/50 border border-mint/20 rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-mint/20">
                                        <thead className="bg-eerie-black/70">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mint uppercase tracking-wider">
                                                    Year
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-mint uppercase tracking-wider">
                                                    Total Incidents
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-mint/10">
                                            {crimeData.map((data, index) => (
                                                <tr key={index} className={index % 2 === 0 ? 'bg-eerie-black/30' : 'bg-eerie-black/50'}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                        {data.year}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">
                                                        {formatNumber(data.totalincidents)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}