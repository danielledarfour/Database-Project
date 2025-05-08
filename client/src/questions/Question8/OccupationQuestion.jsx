import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../ui/Input";
import axios from "axios";
import styled from "styled-components";
import Loader from "../../ui/Loader";
import { usStates } from "../../utils/cityData";

export default function OccupationQuestion() {
    // State for inputs
    const [selectedState, setSelectedState] = useState("");
    const [stateSearchTerm, setStateSearchTerm] = useState("");
    const [showStateSuggestions, setShowStateSuggestions] = useState(false);
    const [workforcePct, setWorkforcePct] = useState(1);
    const [wagePct, setWagePct] = useState(20);
    const [searchTerm, setSearchTerm] = useState("");

    // Data fetching state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [occupationData, setOccupationData] = useState([]);

    // UI state
    const [viewMode, setViewMode] = useState("table");
    const [sortField, setSortField] = useState("amountabovestateavg");
    const [sortOrder, setSortOrder] = useState("desc");

    // Add new state variables for the filter options
    const [showFilters, setShowFilters] = useState(false);
    const [occupationSearchTerm, setOccupationSearchTerm] = useState("");
    const [groupBy, setGroupBy] = useState("none"); // none, state, occupation

    // Filter states based on search term
    const filteredStates = useMemo(() => {
        if (!stateSearchTerm.trim()) return usStates;
        
        return usStates.filter(state => 
            state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())
        );
    }, [stateSearchTerm]);

    // Group data by state for easier display
    const groupedData = useMemo(() => {
        if (!occupationData.length) return {};

        return occupationData.reduce((acc, item) => {
            if (!acc[item.statename]) {
                acc[item.statename] = [];
            }
            acc[item.statename].push(item);
            return acc;
        }, {});
    }, [occupationData]);

    // Filtered data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return occupationData;

        return occupationData.filter(item => 
            item.occupationtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.statename.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [occupationData, searchTerm]);

    // Apply filters and sorting to the filtered data
    const filteredAndSortedData = useMemo(() => {
        if (!filteredData.length) return [];

        // Apply occupation filter
        let result = occupationSearchTerm 
            ? filteredData.filter(item => 
                item.occupationtitle.toLowerCase().includes(occupationSearchTerm.toLowerCase()))
            : filteredData;
        
        // Apply state filter (already handled in fetchOccupationData, but this is a safeguard)
        if (selectedState) {
            result = result.filter(item => item.statename === selectedState);
        }
        
        // Sort the data
        result = [...result].sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];
            
            // Convert to numbers if needed
            if (typeof aValue === 'string' && !isNaN(aValue)) {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            }
            
            // String comparison
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        return result;
    }, [filteredData, occupationSearchTerm, selectedState, sortField, sortOrder]);

    // Group data if grouping is selected
    const groupedAndSortedData = useMemo(() => {
        if (groupBy === "none") return { ungrouped: filteredAndSortedData };
        
        return filteredAndSortedData.reduce((acc, item) => {
            const key = groupBy === "state" ? item.statename : item.occupationtitle;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});
    }, [filteredAndSortedData, groupBy]);

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
    };

    // Handle filter click
    const handleFilterClick = () => {
        setShowStateSuggestions(true);
    };

    // Fetch occupation data
    const fetchOccupationData = async () => {
        if (!workforcePct || !wagePct) {
            setError("Please enter valid percentage values");
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            // Fix the endpoint URL to match the server route with hyphenated parameters
            // The server route is likely: /job/:pct-workforce/:pct-wage
            const endpoint = `/api/job/${encodeURIComponent(workforcePct)}/${encodeURIComponent(wagePct)}`;
            console.log("Calling API endpoint:", endpoint);
            const response = await axios.get(endpoint);
            
            // Ensure response.data is an array before mapping
            const responseData = Array.isArray(response.data) ? response.data : 
                                (response.data && response.data.data ? response.data.data : []);
            
            // Parse numeric values from strings if needed
            const parsedData = responseData.map(item => ({
                ...item,
                workforcepct: typeof item.workforcepct === 'string' ? parseFloat(item.workforcepct) : item.workforcepct,
                occupationavgwage: typeof item.occupationavgwage === 'string' ? parseFloat(item.occupationavgwage) : item.occupationavgwage,
                amountabovestateavg: typeof item.amountabovestateavg === 'string' ? parseFloat(item.amountabovestateavg) : item.amountabovestateavg
            }));
            
            // Filter by state if selected
            const filteredByState = selectedState 
                ? parsedData.filter(item => item.statename === selectedState)
                : parsedData;
                
            setOccupationData(filteredByState);
        } catch (err) {
            console.error("Error fetching occupation data:", err);
            setError(`Failed to fetch occupation data: ${err.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e && e.preventDefault();
        fetchOccupationData();
    };

    // Format currency values
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Calculate percentage of bar to fill based on value relative to max
    const getPercentage = (value, maxValue, field) => {
        if (field === 'workforcepct') {
            // For workforce percentage, use a more visible scale since values are small
            return (value / workforcePct) * 100;
        }
        
        return (value / maxValue) * 100;
    };

    // Get color based on value
    const getColor = (value, field) => {
        if (field === 'amountabovestateavg') {
            const normalizedValue = Math.min(value / 100000, 1);
            // Green color gradient from light to dark based on value
            return `hsl(142, 71%, ${45 - normalizedValue * 20}%)`;
        }
        
        if (field === 'workforcepct') {
            // Blue color for workforce percentage
            return '#3B82F6';
        }
        
        // Default mint color
        return '#10b981';
    };

    // Find maximum values for scaling
    const maxValues = useMemo(() => {
        if (!occupationData.length) return { workforcepct: 1, occupationavgwage: 100000, amountabovestateavg: 50000 };

        return {
            workforcepct: Math.max(...occupationData.map(d => d.workforcepct || 0)),
            occupationavgwage: Math.max(...occupationData.map(d => d.occupationavgwage || 0)),
            amountabovestateavg: Math.max(...occupationData.map(d => d.amountabovestateavg || 0))
        };
    }, [occupationData]);

    return (
        <div className="space-y-8">
            <div className="bg-eerie-black/80 rounded-lg shadow-lg border border-mint/30 p-6">
                <h2 className="text-3xl font-bold text-mint mb-6 pb-2 border-b border-mint/30">
                    Specialized Occupations Analysis
                </h2>
                
                <div className="text-white/80 mb-8 max-w-3xl text-lg">
                    <p>
                        Find occupations that have a small percentage of the workforce but above-average wages.
                        These represent specialized, high-paying roles that could be good career targets.
                    </p>
                </div>
                
                {/* Search Form */}
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex flex-col gap-6">
                        {/* Primary Search Parameters - More prominent */}
                        <div className="bg-eerie-black/40 p-5 rounded-lg border border-mint/20">
                            <h3 className="text-mint font-semibold text-lg mb-4 border-b border-mint/10 pb-2">Primary Search Parameters</h3>
                            
                            <div className="flex flex-col gap-6">
                                {/* Max Workforce % control - full width */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-mint font-medium text-lg">
                                            Max Workforce %
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                className="w-20 text-right bg-eerie-black text-white border border-mint rounded-md p-1 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-mint no-spinner"
                                                value={workforcePct}
                                                onChange={(e) => setWorkforcePct(parseFloat(e.target.value) || 0)}
                                                min="0"
                                                max="100"
                                                step="0.01"
                                            />
                                            <span className="text-white text-lg font-bold ml-1">%</span>
                                        </div>
                                    </div>
                                    
                                    {/* Slider control */}
                                    <div className="mb-3">
                                        <input
                                            type="range"
                                            className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-mint"
                                            min="0"
                                            max="100"
                                            step="0.5"
                                            value={workforcePct}
                                            onChange={(e) => setWorkforcePct(parseFloat(e.target.value))}
                                        />
                                        <div className="flex justify-between text-xs text-white/60 mt-1">
                                            <span>0% (None)</span>
                                            <span>100% (All Workers)</span>
                                        </div>
                                    </div>
                                    
                                    {/* Preset buttons */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => setWorkforcePct(0.5)}
                                            className={`px-2 py-1 text-xs rounded ${workforcePct === 0.5 ? 'bg-mint text-eerie-black font-bold' : 'bg-eerie-black text-white/80 border border-mint/30'}`}
                                        >
                                            Very Specialized (0.5%)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setWorkforcePct(1)}
                                            className={`px-2 py-1 text-xs rounded ${workforcePct === 1 ? 'bg-mint text-eerie-black font-bold' : 'bg-eerie-black text-white/80 border border-mint/30'}`}
                                        >
                                            Specialized (1%)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setWorkforcePct(5)}
                                            className={`px-2 py-1 text-xs rounded ${workforcePct === 5 ? 'bg-mint text-eerie-black font-bold' : 'bg-eerie-black text-white/80 border border-mint/30'}`}
                                        >
                                            Moderately Common (5%)
                                        </button>
                                    </div>
                                    
                                    <div className="text-sm text-white/70 mt-3 bg-eerie-black/40 p-2 rounded border border-mint/10">
                                        <div className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mint flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>
                                                <strong>Lower values</strong> find more <strong>rare, specialized</strong> occupations. For example, a workforce % of 0.5% means the job makes up less than half a percent of all jobs.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Min Wage % control - full width */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-mint font-medium text-lg">
                                            Min Wage % Above Avg
                                        </label>
                                        <div className="flex items-center">
                                            <span className="text-white text-lg font-bold mr-1">+</span>
                                            <input
                                                type="number"
                                                className="w-20 text-right bg-eerie-black text-white border border-mint rounded-md p-1 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-mint no-spinner"
                                                value={wagePct}
                                                onChange={(e) => setWagePct(parseFloat(e.target.value) || 0)}
                                                min="0"
                                                max="100"
                                                step="0.01"
                                            />
                                            <span className="text-white text-lg font-bold ml-1">%</span>
                                        </div>
                                    </div>
                                    
                                    {/* Slider control */}
                                    <div className="mb-3">
                                        <input
                                            type="range"
                                            className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-mint"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={wagePct}
                                            onChange={(e) => setWagePct(parseFloat(e.target.value))}
                                        />
                                        <div className="flex justify-between text-xs text-white/60 mt-1">
                                            <span>0% (Average)</span>
                                            <span>100% (Double)</span>
                                        </div>
                                    </div>
                                    
                                    {/* Preset buttons */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => setWagePct(20)}
                                            className={`px-2 py-1 text-xs rounded ${wagePct === 20 ? 'bg-mint text-eerie-black font-bold' : 'bg-eerie-black text-white/80 border border-mint/30'}`}
                                        >
                                            Moderately Higher (20%)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setWagePct(50)}
                                            className={`px-2 py-1 text-xs rounded ${wagePct === 50 ? 'bg-mint text-eerie-black font-bold' : 'bg-eerie-black text-white/80 border border-mint/30'}`}
                                        >
                                            Significantly Higher (50%)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setWagePct(75)}
                                            className={`px-2 py-1 text-xs rounded ${wagePct === 75 ? 'bg-mint text-eerie-black font-bold' : 'bg-eerie-black text-white/80 border border-mint/30'}`}
                                        >
                                            Premium Wage (75%)
                                        </button>
                                    </div>
                                    
                                    <div className="text-sm text-white/70 mt-3 bg-eerie-black/40 p-2 rounded border border-mint/10">
                                        <div className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mint flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>
                                                <strong>Higher values</strong> find jobs with <strong>better pay premiums</strong>. A value of 50% means the job pays 50% more than the average wage in that state.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Visual explainer */}
                            <div className="mt-4 p-3 bg-mint/10 rounded-lg border border-mint/20">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mint mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <span className="text-white font-medium">Your Search: </span>
                                    <span className="ml-2 text-mint font-bold">
                                        Occupations with fewer than {parseFloat(workforcePct).toFixed(2)}% of workforce that pay at least {parseFloat(wagePct).toFixed(2)}% above average
                                    </span>
                                </div>
                            </div>
                            
                            {/* Search Button */}
                            <div className="mt-6 text-center">
                                <button
                                    type="submit"
                                    className="bg-mint hover:bg-mint/80 text-eerie-black font-bold py-3 px-8 rounded-md transition-colors text-lg"
                                >
                                    <div className="flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Find Occupations
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                
                {/* Results Area */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-md mb-6 font-medium">
                        {error}
                    </div>
                )}
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader />
                    </div>
                ) : occupationData.length > 0 ? (
                    <div className="mt-6">
                        {/* Results Controls */}
                        <div className="flex flex-wrap justify-between items-center mb-4 gap-3 bg-eerie-black/40 p-4 rounded-lg border border-mint/10">
                            <div className="flex items-center space-x-3">
                                <button
                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                        viewMode === 'table' 
                                            ? 'bg-mint text-eerie-black' 
                                            : 'bg-eerie-black/50 text-white border border-mint/30'
                                    }`}
                                    onClick={() => setViewMode('table')}
                                >
                                    Table View
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                        viewMode === 'cards' 
                                            ? 'bg-mint text-eerie-black' 
                                            : 'bg-eerie-black/50 text-white border border-mint/30'
                                    }`}
                                    onClick={() => setViewMode('cards')}
                                >
                                    Card View
                                </button>
                            </div>
                            
                            <div className="flex-1 max-w-xs mx-2">
                                <input
                                    type="text"
                                    placeholder="Search occupations..."
                                    className="w-full bg-eerie-black/90 text-white border border-mint/30 rounded-md p-2.5 focus:ring-mint focus:border-mint"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="text-white/80 text-base font-medium flex items-center">
                                <button
                                    type="button"
                                    className="text-mint hover:text-white text-sm flex items-center mr-4"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    {showFilters ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                            Hide Filters
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                            </svg>
                                            Advanced Filters
                                        </>
                                    )}
                                </button>
                                <span>Found <span className="text-mint">{filteredAndSortedData.length}</span> occupations</span>
                            </div>
                        </div>
                        
                        {/* Advanced Filters Panel */}
                        {showFilters && (
                            <div className="mb-6 bg-eerie-black/30 border border-mint/20 rounded-lg p-4 animate-fadeIn">
                                <h4 className="text-mint font-medium mb-4 pb-2 border-b border-mint/10">Advanced Filters & Sorting</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {/* State Search */}
                                    <div>
                                        <label className="block text-white/80 text-sm mb-1">Filter by State</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full bg-eerie-black/80 text-white border border-mint/30 rounded-md p-2 text-sm focus:ring-mint focus:border-mint"
                                                placeholder="Search for a state..."
                                                value={stateSearchTerm}
                                                onChange={(e) => {
                                                    setStateSearchTerm(e.target.value);
                                                    setShowStateSuggestions(e.target.value.length > 0);
                                                }}
                                            />
                                            
                                            {/* State Suggestions */}
                                            {showStateSuggestions && stateSearchTerm && (
                                                <div className="absolute z-10 mt-1 w-full bg-eerie-black border border-mint/30 rounded-md shadow-lg max-h-40 overflow-auto">
                                                    {filteredStates.length > 0 ? (
                                                        filteredStates.map(state => (
                                                            <div 
                                                                key={state.id} 
                                                                className="px-3 py-1.5 hover:bg-mint/10 cursor-pointer transition-colors text-white text-sm"
                                                                onClick={() => handleStateSelect(state.name)}
                                                            >
                                                                {state.name}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-3 py-1.5 text-white/60 text-sm">No states found</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {selectedState && (
                                            <div className="mt-2 flex items-center">
                                                <span className="bg-mint/20 text-mint px-2 py-1 rounded-md text-xs flex items-center">
                                                    {selectedState}
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedState("");
                                                            setStateSearchTerm("");
                                                        }}
                                                        className="ml-2 text-mint hover:text-white"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Occupation Search */}
                                    <div>
                                        <label className="block text-white/80 text-sm mb-1">Filter by Occupation</label>
                                        <input
                                            type="text"
                                            className="w-full bg-eerie-black/80 text-white border border-mint/30 rounded-md p-2 text-sm focus:ring-mint focus:border-mint"
                                            placeholder="Search occupation titles..."
                                            value={occupationSearchTerm}
                                            onChange={(e) => setOccupationSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    {/* Group By Options */}
                                    <div>
                                        <label className="block text-white/80 text-sm mb-1">Group Results By</label>
                                        <select
                                            className="w-full bg-eerie-black/80 text-white border border-mint/30 rounded-md p-2 text-sm focus:ring-mint focus:border-mint"
                                            value={groupBy}
                                            onChange={(e) => setGroupBy(e.target.value)}
                                        >
                                            <option value="none">No Grouping</option>
                                            <option value="state">Group by State</option>
                                            <option value="occupation">Group by Occupation</option>
                                        </select>
                                    </div>
                                    
                                    {/* Sort Field Options */}
                                    <div>
                                        <label className="block text-white/80 text-sm mb-1">Sort By</label>
                                        <select
                                            className="w-full bg-eerie-black/80 text-white border border-mint/30 rounded-md p-2 text-sm focus:ring-mint focus:border-mint"
                                            value={sortField}
                                            onChange={(e) => setSortField(e.target.value)}
                                        >
                                            <option value="workforcepct">Workforce Percentage</option>
                                            <option value="occupationavgwage">Average Wage</option>
                                            <option value="amountabovestateavg">Amount Above Average</option>
                                            <option value="statename">State Name</option>
                                            <option value="occupationtitle">Occupation Title</option>
                                        </select>
                                    </div>
                                    
                                    {/* Sort Order Options */}
                                    <div>
                                        <label className="block text-white/80 text-sm mb-1">Sort Order</label>
                                        <div className="flex gap-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio text-mint"
                                                    value="asc"
                                                    checked={sortOrder === "asc"}
                                                    onChange={() => setSortOrder("asc")}
                                                />
                                                <span className="ml-2 text-white text-sm">Ascending</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio text-mint"
                                                    value="desc"
                                                    checked={sortOrder === "desc"}
                                                    onChange={() => setSortOrder("desc")}
                                                />
                                                <span className="ml-2 text-white text-sm">Descending</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end pt-2 border-t border-mint/10">
                                    <button
                                        type="button"
                                        className="bg-mint/10 hover:bg-mint/20 text-mint px-3 py-1.5 rounded text-sm"
                                        onClick={() => {
                                            setOccupationSearchTerm("");
                                            setStateSearchTerm("");
                                            setSelectedState("");
                                            setGroupBy("none");
                                            setSortField("amountabovestateavg");
                                            setSortOrder("desc");
                                        }}
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Table View */}
                        {viewMode === 'table' && (
                            <div className="overflow-x-auto bg-eerie-black/30 border border-mint/20 rounded-lg">
                                <table className="w-full text-white">
                                    <thead className="text-sm uppercase bg-eerie-black/70 border-b border-mint/30">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left font-bold text-mint">
                                                State
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left font-bold text-mint">
                                                Occupation
                                            </th>
                                            <th 
                                                scope="col" 
                                                className="px-6 py-4 text-right cursor-pointer hover:bg-eerie-black/50 font-bold text-mint"
                                                onClick={() => {
                                                    setSortField('workforcepct');
                                                    setSortOrder(sortField === 'workforcepct' && sortOrder === 'asc' ? 'desc' : 'asc');
                                                }}
                                            >
                                                Workforce %
                                                {sortField === 'workforcepct' && (
                                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </th>
                                            <th 
                                                scope="col" 
                                                className="px-6 py-4 text-right cursor-pointer hover:bg-eerie-black/50 font-bold text-mint"
                                                onClick={() => {
                                                    setSortField('occupationavgwage');
                                                    setSortOrder(sortField === 'occupationavgwage' && sortOrder === 'asc' ? 'desc' : 'asc');
                                                }}
                                            >
                                                Avg Wage
                                                {sortField === 'occupationavgwage' && (
                                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </th>
                                            <th 
                                                scope="col" 
                                                className="px-6 py-4 text-right cursor-pointer hover:bg-eerie-black/50 font-bold text-mint"
                                                onClick={() => {
                                                    setSortField('amountabovestateavg');
                                                    setSortOrder(sortField === 'amountabovestateavg' && sortOrder === 'asc' ? 'desc' : 'asc');
                                                }}
                                            >
                                                $ Above Avg
                                                {sortField === 'amountabovestateavg' && (
                                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-mint/10">
                                        {groupBy === "none" ? (
                                            // Ungrouped data display
                                            filteredAndSortedData.map((item, index) => (
                                                <tr 
                                                    key={`${item.statename}-${item.occupationtitle}-${index}`}
                                                    className="hover:bg-eerie-black/40"
                                                >
                                                    <td className="px-6 py-4 font-medium">
                                                        {item.statename}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-mint">
                                                        {item.occupationtitle}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end">
                                                            <span className="mr-2 font-medium">{item.workforcepct?.toFixed(2)}%</span>
                                                            <div className="w-24 bg-eerie-black/50 h-3 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full rounded-full"
                                                                    style={{ 
                                                                        width: `${getPercentage(item.workforcepct || 0, maxValues.workforcepct, 'workforcepct')}%`,
                                                                        backgroundColor: getColor(item.workforcepct || 0, 'workforcepct')
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end">
                                                            <span className="font-medium">{formatCurrency(item.occupationavgwage || 0)}</span>
                                                            <div className="w-24 bg-eerie-black/50 h-3 rounded-full overflow-hidden ml-2">
                                                                <div 
                                                                    className="h-full rounded-full"
                                                                    style={{ 
                                                                        width: `${getPercentage(item.occupationavgwage || 0, maxValues.occupationavgwage, 'occupationavgwage')}%`,
                                                                        backgroundColor: getColor(item.occupationavgwage || 0, 'occupationavgwage')
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end">
                                                            <span className="font-bold" style={{ color: getColor(item.amountabovestateavg || 0, 'amountabovestateavg') }}>
                                                                {formatCurrency(item.amountabovestateavg || 0)}
                                                            </span>
                                                            <div className="w-24 bg-eerie-black/50 h-3 rounded-full overflow-hidden ml-2">
                                                                <div 
                                                                    className="h-full rounded-full"
                                                                    style={{ 
                                                                        width: `${getPercentage(item.amountabovestateavg || 0, maxValues.amountabovestateavg, 'amountabovestateavg')}%`,
                                                                        backgroundColor: getColor(item.amountabovestateavg || 0, 'amountabovestateavg')
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            // Grouped data display
                                            Object.entries(groupedAndSortedData).map(([groupName, items]) => (
                                                <React.Fragment key={groupName}>
                                                    {/* Group header row */}
                                                    <tr className="bg-mint/10 font-bold">
                                                        <td 
                                                            colSpan={5} 
                                                            className="px-6 py-3 text-mint"
                                                        >
                                                            {groupBy === "state" ? `State: ${groupName}` : `Occupation: ${groupName}`}
                                                            <span className="text-white/70 text-sm font-normal ml-2">
                                                                ({items.length} items)
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    
                                                    {/* Group items */}
                                                    {items.map((item, index) => (
                                                        <tr 
                                                            key={`${item.statename}-${item.occupationtitle}-${index}`}
                                                            className="hover:bg-eerie-black/40"
                                                        >
                                                            <td className="px-6 py-4 font-medium">
                                                                {item.statename}
                                                            </td>
                                                            <td className="px-6 py-4 font-medium text-mint">
                                                                {item.occupationtitle}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end">
                                                                    <span className="mr-2 font-medium">{item.workforcepct?.toFixed(2)}%</span>
                                                                    <div className="w-24 bg-eerie-black/50 h-3 rounded-full overflow-hidden">
                                                                        <div 
                                                                            className="h-full rounded-full"
                                                                            style={{ 
                                                                                width: `${getPercentage(item.workforcepct || 0, maxValues.workforcepct, 'workforcepct')}%`,
                                                                                backgroundColor: getColor(item.workforcepct || 0, 'workforcepct')
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end">
                                                                    <span className="font-medium">{formatCurrency(item.occupationavgwage || 0)}</span>
                                                                    <div className="w-24 bg-eerie-black/50 h-3 rounded-full overflow-hidden ml-2">
                                                                        <div 
                                                                            className="h-full rounded-full"
                                                                            style={{ 
                                                                                width: `${getPercentage(item.occupationavgwage || 0, maxValues.occupationavgwage, 'occupationavgwage')}%`,
                                                                                backgroundColor: getColor(item.occupationavgwage || 0, 'occupationavgwage')
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end">
                                                                    <span className="font-bold" style={{ color: getColor(item.amountabovestateavg || 0, 'amountabovestateavg') }}>
                                                                        {formatCurrency(item.amountabovestateavg || 0)}
                                                                    </span>
                                                                    <div className="w-24 bg-eerie-black/50 h-3 rounded-full overflow-hidden ml-2">
                                                                        <div 
                                                                            className="h-full rounded-full"
                                                                            style={{ 
                                                                                width: `${getPercentage(item.amountabovestateavg || 0, maxValues.amountabovestateavg, 'amountabovestateavg')}%`,
                                                                                backgroundColor: getColor(item.amountabovestateavg || 0, 'amountabovestateavg')
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {/* Card View */}
                        {viewMode === 'cards' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAndSortedData.map((item, index) => (
                                    <motion.div
                                        key={`${item.statename}-${item.occupationtitle}-${index}`}
                                        className="bg-eerie-black/40 border border-mint/20 rounded-lg overflow-hidden hover:border-mint/50 transition-colors shadow-lg"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-mint font-semibold text-lg truncate flex-1">{item.occupationtitle}</h3>
                                                <div className="text-sm text-white/80 bg-eerie-black/60 px-2 py-1 rounded-md font-medium">
                                                    {item.statename}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-5 mt-5">
                                                <div>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-white/70 font-medium">Workforce Share</span>
                                                        <span className="text-white font-bold">{item.workforcepct?.toFixed(2)}%</span>
                                                    </div>
                                                    <div className="w-full bg-eerie-black/50 h-3 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full rounded-full"
                                                            style={{ 
                                                                width: `${getPercentage(item.workforcepct || 0, maxValues.workforcepct, 'workforcepct')}%`,
                                                                backgroundColor: getColor(item.workforcepct || 0, 'workforcepct')
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-white/70 font-medium">Average Wage</span>
                                                        <span className="text-white font-bold">{formatCurrency(item.occupationavgwage || 0)}</span>
                                                    </div>
                                                    <div className="w-full bg-eerie-black/50 h-3 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full rounded-full"
                                                            style={{ 
                                                                width: `${getPercentage(item.occupationavgwage || 0, maxValues.occupationavgwage, 'occupationavgwage')}%`,
                                                                backgroundColor: getColor(item.occupationavgwage || 0, 'occupationavgwage')
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-white/70 font-medium">Above State Average</span>
                                                        <span className="font-bold text-lg" style={{ color: getColor(item.amountabovestateavg || 0, 'amountabovestateavg') }}>
                                                            {formatCurrency(item.amountabovestateavg || 0)}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-eerie-black/50 h-3 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full rounded-full"
                                                            style={{ 
                                                                width: `${getPercentage(item.amountabovestateavg || 0, maxValues.amountabovestateavg, 'amountabovestateavg')}%`,
                                                                backgroundColor: getColor(item.amountabovestateavg || 0, 'amountabovestateavg')
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : !isLoading && (
                    <div className="bg-eerie-black/50 border border-mint/20 rounded-lg p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-mint/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-white/80 text-lg mb-4">Set your search parameters and click "Find Occupations" to see specialized, high-paying roles.</p>
                    </div>
                )}
            </div>
            
            {/* Explanation Section */}
            <div className="bg-eerie-black/80 rounded-lg shadow-lg border border-mint/30 p-6">
                <h3 className="text-xl font-bold text-mint mb-4 border-b border-mint/20 pb-2">
                    Understanding This Analysis
                </h3>
                
                <div className="text-white/80 space-y-5 text-lg max-w-4xl">
                    <p>
                        This tool identifies occupations that represent a small percentage of the workforce but offer wages significantly higher 
                        than the state average. These are often specialized roles that require specific skills or education.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-eerie-black/40 p-5 rounded-lg border border-mint/20">
                            <h4 className="text-mint font-semibold text-lg mb-3">Workforce Percentage</h4>
                            <p className="text-base text-white/80">
                                Shows what percentage of a state's workforce is employed in this occupation. 
                                Lower percentages indicate more specialized roles.
                            </p>
                        </div>
                        
                        <div className="bg-eerie-black/40 p-5 rounded-lg border border-mint/20">
                            <h4 className="text-mint font-semibold text-lg mb-3">Average Wage</h4>
                            <p className="text-base text-white/80">
                                The average annual salary for workers in this occupation within the state.
                                Compare compensation across different roles.
                            </p>
                        </div>
                        
                        <div className="bg-eerie-black/40 p-5 rounded-lg border border-mint/20">
                            <h4 className="text-mint font-semibold text-lg mb-3">Amount Above Average</h4>
                            <p className="text-base text-white/80">
                                How much more this occupation pays compared to the overall state average wage.
                                Higher values represent a greater premium.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

{/* Add CSS for removing spinner arrows from number inputs */}
<style jsx global>{`
    .no-spinner::-webkit-inner-spin-button, 
    .no-spinner::-webkit-outer-spin-button { 
        -webkit-appearance: none;
        margin: 0;
    }
    .no-spinner {
        -moz-appearance: textfield;
    }
`}</style>