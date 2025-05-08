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
            const response = await axios.get(`/api/job/${state}`);
            
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
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="max-w-3xl mx-auto">
                        <label className="block text-white mb-2 text-sm">Search for a State</label>
                        <div className="relative mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-grow">
                                    <Input 
                                        onChange={handleStateInputChange} 
                                        onFilterClick={handleFilterClick}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-mint hover:bg-mint/80 text-eerie-black font-bold py-2.5 px-6 rounded-md transition-colors whitespace-nowrap h-[42px]"
                                    disabled={!selectedState || isLoading}
                                >
                                    {isLoading ? 'Loading...' : 'Find Top Occupations'}
                                </button>
                            </div>
                            
                            {selectedState && (
                                <div className="mt-2 flex items-center">
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
                        <div className="mb-6 text-center border-b border-mint/30 pb-4">
                            <h3 className="text-2xl font-serif font-bold text-mint">
                                {`Top 10 Occupations in ${selectedState}`}
                            </h3>
                            <p className="text-white/60 mt-2 italic">
                                Distribution of workforce across major occupation categories
                            </p>
                        </div>
                        
                        {/* Classic Chart Design */}
                        <div className="border-4 border-mint/20 rounded-lg p-8 bg-gradient-to-b from-eerie-black/60 to-eerie-black/80">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Elegant Bar Chart */}
                                <div className="space-y-6">
                                    <div className="text-center mb-4">
                                        <h4 className="text-lg font-serif text-mint tracking-wide">WORKFORCE COMPOSITION</h4>
                                        <div className="w-32 h-0.5 bg-mint/30 mx-auto mt-2"></div>
                                    </div>
                                    
                                    {chartReady && (
                                        <div className="space-y-5">
                                            {workforceData.map((occupation, index) => (
                                                <div key={`bar-${index}`} className="relative">
                                                    <div className="flex items-center mb-1.5">
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" 
                                                            style={{ backgroundColor: getOccupationColor(index) }}>
                                                            <span className="text-eerie-black font-bold text-xs">{index + 1}</span>
                                                        </div>
                                                        <span className="text-white font-serif text-sm tracking-wide">
                                                            {occupation.occupationtitle}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Percentage value */}
                                                    <div className="mb-2.5">
                                                        <span className="bg-eerie-black/80 px-2 py-0.5 rounded text-mint font-bold text-xs border border-mint/20">
                                                            {formatPercentage(occupation.truepct * 100 || occupation.pctoftotalemployment)}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Bar */}
                                                    <div className="h-6 bg-eerie-black rounded-sm border border-mint/20 overflow-hidden">
                                                        <motion.div 
                                                            className="h-full"
                                                            style={{ backgroundColor: getOccupationColor(index) }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(occupation.truepct || occupation.pctoftotalemployment / 100) * 100}%` }}
                                                            transition={{ duration: 1, delay: index * 0.15, ease: "circOut" }}
                                                        >
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Right Column: Employment Figures in Classic Table */}
                                <div className="border border-mint/30 rounded bg-eerie-black/30">
                                    <div className="p-4 border-b border-mint/20 text-center">
                                        <h4 className="text-lg font-serif text-mint tracking-wide">EMPLOYMENT FIGURES</h4>
                                    </div>
                                    
                                    <div className="p-4">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b border-mint/20">
                                                    <th className="text-left py-2 text-white/80 font-serif text-sm">Occupation Category</th>
                                                    <th className="text-right py-2 text-white/80 font-serif text-sm">Employees</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {workforceData.map((occupation, index) => (
                                                    <tr key={`table-${index}`} className="border-b border-mint/10">
                                                        <td className="py-3 text-white/90 font-serif text-sm">
                                                            <div className="flex items-center">
                                                                <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: getOccupationColor(index) }}></div>
                                                                {occupation.occupationtitle.split(' ').slice(0, 3).join(' ')}
                                                                {occupation.occupationtitle.split(' ').length > 3 ? '...' : ''}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 text-right text-mint font-serif font-medium">
                                                            {new Intl.NumberFormat('en-US').format(occupation.emp || 0)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        
                                        {/* Summary */}
                                        <div className="mt-6 p-4 bg-mint/5 border border-mint/20 rounded">
                                            <div className="text-white/90 font-serif text-sm leading-relaxed">
                                                <p className="mb-2">
                                                    The top occupation in <span className="font-medium text-mint">{selectedState}</span> employs{' '}
                                                    <span className="font-medium text-mint">
                                                        {new Intl.NumberFormat('en-US').format(workforceData[0]?.emp || 0)}
                                                    </span> workers, representing{' '}
                                                    <span className="font-medium text-mint">
                                                        {formatPercentage(workforceData[0]?.truepct * 100 || workforceData[0]?.pctoftotalemployment)}
                                                    </span> of the total workforce.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Ornamental Footer */}
                            <div className="mt-8 flex justify-center">
                                <div className="w-24 h-1 bg-mint/40"></div>
                            </div>
                        </div>

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