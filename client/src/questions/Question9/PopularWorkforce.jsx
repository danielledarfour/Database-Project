import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../ui/Input";
import axios from "axios";
import styled from "styled-components";
import Loader from "../../ui/Loader";
import { usStates } from "../../utils/cityData";

/** 
 * This is Question 9
**/
export default function PopularWorkforce() {
    // State for inputs
    const [selectedState, setSelectedState] = useState("");
    const [stateSearchTerm, setStateSearchTerm] = useState("");
    const [showStateSuggestions, setShowStateSuggestions] = useState(false);

    // Data fetching state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [workforceData, setWorkforceData] = useState([]);
    
    // Chart dimensions for safety
    const [chartReady, setChartReady] = useState(false);
    const chartContainerRef = useRef(null);

    // Filter states based on search term
    const filteredStates = useMemo(() => {
        if (!stateSearchTerm.trim()) return usStates;
        
        return usStates.filter(state => 
            state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())
        );
    }, [stateSearchTerm]);

    // Calculate the maximum percentage for scaling the chart
    const maxPercentage = useMemo(() => {
        if (!workforceData.length) return 10;
        return Math.max(...workforceData.map(occupation => occupation.pctoftotalemployment || 0)) * 1.1; // Add 10% for visual margin
    }, [workforceData]);

    // Set chart ready after mounting and data is available
    useEffect(() => {
        if (workforceData.length > 0 && chartContainerRef.current) {
            const timer = setTimeout(() => {
                setChartReady(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [workforceData]);

    // Handle state input change
    const handleStateInputChange = (value) => {
        setStateSearchTerm(value);
        setShowStateSuggestions(true);
        if (!value) {
            setSelectedState("");
        }
    };

    // Handle state selection from suggestions
    const handleStateSelect = (stateName) => {
        setSelectedState(stateName);
        setStateSearchTerm(stateName);
        setShowStateSuggestions(false);
        fetchWorkforceData(stateName);
    };

    // Handle filter click
    const handleFilterClick = () => {
        setShowStateSuggestions(true);
    };

    // Fetch workforce data for the selected state
    const fetchWorkforceData = async (state) => {
        if (!state) {
            setError("Please select a state");
            return;
        }

        setIsLoading(true);
        setError(null);
        setChartReady(false);
        
        try {
            const response = await axios.get(`/jobs/${state}`);
            
            // Ensure response.data is an array before mapping
            const responseData = Array.isArray(response.data) ? response.data : 
                                (response.data && response.data.data ? response.data.data : []);
            
            // Parse numeric values from strings if needed
            const parsedData = responseData.map(item => ({
                ...item,
                pctoftotalemployment: typeof item.pctoftotalemployment === 'string' ? 
                    parseFloat(item.pctoftotalemployment) : item.pctoftotalemployment
            }));
            
            setWorkforceData(parsedData);
        } catch (err) {
            console.error("Error fetching workforce data:", err);
            setError(`Failed to fetch workforce data: ${err.message || 'Unknown error'}`);
            setWorkforceData([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e && e.preventDefault();
        fetchWorkforceData(selectedState);
    };

    // Format percentage values
    const formatPercentage = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100 || 0); // Divide by 100 to convert to decimal for percentage format
    };

    // Get color based on percentage rank
    const getOccupationColor = (index) => {
        // Colors from most to least common occupation
        const colors = [
            '#10b981', // mint for top occupation
            '#34d399',
            '#6ee7b7',
            '#a7f3d0',
            '#d1fae5',
            '#f0fdfa',
            '#f0f9ff',
            '#e0f2fe',
            '#bae6fd',
            '#7dd3fc' // light blue for 10th occupation
        ];
        
        return colors[Math.min(index, colors.length - 1)];
    };

    return (
        <div className="space-y-6">
            <div className="bg-eerie-black/80 rounded-lg shadow-lg border border-mint/30 p-6">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-mint/30 pb-2">
                    Top 10 Occupations by Workforce Percentage
                </h2>
                
                <div className="text-white/70 mb-6">
                    <p>
                        Explore which occupation titles have the highest percentage of the workforce in a selected state.
                        This analysis identifies the most common jobs and their relative prevalence in the state's economy.
                    </p>
                </div>
                
                {/* Search Form */}
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="max-w-lg mx-auto">
                        <label className="block text-white mb-2 text-sm">Search for a State</label>
                        <div className="relative mb-4">
                            <div className="mb-1 flex items-center justify-center">
                                <Input 
                                    onChange={handleStateInputChange} 
                                    onFilterClick={handleFilterClick}
                                />
                            </div>
                            {selectedState && (
                                <div className="mt-2 flex items-center justify-center">
                                    <span className="bg-mint/20 text-mint px-2 py-1 rounded-md text-sm flex items-center">
                                        {selectedState}
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedState("");
                                                setStateSearchTerm("");
                                                setWorkforceData([]);
                                            }}
                                            className="ml-2 text-mint hover:text-white"
                                            aria-label="Clear selected state"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                </div>
                            )}
                            
                            {/* State Suggestions */}
                            {showStateSuggestions && stateSearchTerm && (
                                <div className="absolute z-10 mt-1 w-full bg-eerie-black border border-mint/30 rounded-md shadow-lg max-h-60 overflow-auto">
                                    {filteredStates.length > 0 ? (
                                        filteredStates.map(state => (
                                            <div 
                                                key={state.id} 
                                                className="px-4 py-2 hover:bg-mint/10 cursor-pointer transition-colors text-white"
                                                onClick={() => handleStateSelect(state.name)}
                                            >
                                                {state.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-white/60">No states found</div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-mint hover:bg-mint/80 text-eerie-black font-bold py-2 px-6 rounded-md transition-colors"
                                disabled={!selectedState || isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Find Top Occupations'}
                            </button>
                        </div>
                    </div>
                </form>
                
                {/* Results Area */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader />
                    </div>
                ) : workforceData.length > 0 ? (
                    <div ref={chartContainerRef} className="mt-8">
                        <h3 className="text-xl font-bold text-mint mb-4">
                            {`Top 10 Occupations in ${selectedState}`}
                        </h3>
                        
                        {/* Horizontal Bar Chart */}
                        <div className="mt-4 space-y-3">
                            {workforceData.map((occupation, index) => (
                                <div 
                                    key={`${occupation.occupationtitle}-${index}`} 
                                    className="bg-eerie-black/40 rounded-md p-3 hover:bg-eerie-black/60 transition-colors"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center">
                                            <span className="text-white/70 w-6 text-right mr-3">{index + 1}.</span>
                                            <span className="text-white font-medium">{occupation.occupationtitle}</span>
                                        </div>
                                        <span className="font-bold text-mint">
                                            {formatPercentage(occupation.pctoftotalemployment)}
                                        </span>
                                    </div>
                                    
                                    {chartReady && (
                                        <motion.div 
                                            className="h-2 bg-eerie-black/60 rounded-full mt-2 overflow-hidden"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5, delay: index * 0.03 }}
                                        >
                                            <motion.div 
                                                className="h-full rounded-full"
                                                style={{ 
                                                    backgroundColor: getOccupationColor(index)
                                                }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(occupation.pctoftotalemployment / maxPercentage) * 100}%` }}
                                                transition={{ duration: 0.7, delay: index * 0.03, ease: "easeOut" }}
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {/* Workforce Insights */}
                        {workforceData.length > 0 && (
                            <div className="mt-8 bg-eerie-black/50 p-6 rounded-lg border border-mint/20">
                                <h4 className="text-lg font-medium text-mint mb-3">Workforce Insights</h4>
                                
                                <div className="text-white/80 space-y-3">
                                    <p>
                                        The top occupation in {selectedState} ({workforceData[0]?.occupationtitle}) 
                                        makes up {formatPercentage(workforceData[0]?.pctoftotalemployment)} of the total workforce.
                                    </p>
                                    
                                    <p>
                                        The top 3 occupations combined account for {formatPercentage(
                                            workforceData.slice(0, 3).reduce((sum, item) => sum + (item.pctoftotalemployment || 0), 0)
                                        )} of all jobs in the state.
                                    </p>
                                    
                                    {workforceData[0]?.pctoftotalemployment > 5 && (
                                        <p className="text-mint">
                                            This is a significant concentration in a single occupation, suggesting this industry is a major economic driver for {selectedState}.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : selectedState && !isLoading && (
                    <div className="bg-eerie-black/50 border border-mint/20 rounded-lg p-6 text-center text-white/70">
                        <p>No workforce data available for this state. Please try another state.</p>
                    </div>
                )}
            </div>
            
            {/* Explanation Section */}
            <div className="bg-eerie-black/80 rounded-lg shadow-lg border border-mint/30 p-6">
                <h3 className="text-lg font-medium text-mint mb-4 border-b border-mint/20 pb-2">
                    Understanding Workforce Distribution
                </h3>
                
                <div className="text-white/70 space-y-4">
                    <p>
                        The distribution of occupations in a state can reveal important insights about its economy:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="bg-eerie-black/40 p-4 rounded-lg border border-mint/20">
                            <h4 className="text-white font-medium mb-2">Economic Specialization</h4>
                            <p className="text-sm">
                                States with high percentages in specific occupations often have specialized economies built around particular industries.
                            </p>
                        </div>
                        
                        <div className="bg-eerie-black/40 p-4 rounded-lg border border-mint/20">
                            <h4 className="text-white font-medium mb-2">Career Opportunities</h4>
                            <p className="text-sm">
                                Common occupations typically have more job openings and may offer easier entry for job seekers in that state.
                            </p>
                        </div>
                        
                        <div className="bg-eerie-black/40 p-4 rounded-lg border border-mint/20">
                            <h4 className="text-white font-medium mb-2">Economic Resilience</h4>
                            <p className="text-sm">
                                States with a diverse range of occupation types tend to be more resilient to economic downturns affecting specific sectors.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}