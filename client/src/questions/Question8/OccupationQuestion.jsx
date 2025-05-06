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

    // Sorted data based on sort field and order
    const sortedData = useMemo(() => {
        if (!filteredData.length) return [];

        return [...filteredData].sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];
            
            // Convert to numbers if needed
            if (typeof aValue === 'string' && !isNaN(aValue)) {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            }
            
            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }, [filteredData, sortField, sortOrder]);

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
            const endpoint = `/job/${workforcePct}/${wagePct}`;
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
        <div className="space-y-6">
            <div className="bg-eerie-black/80 rounded-lg shadow-lg border border-mint/30 p-6">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-mint/30 pb-2">
                    Specialized Occupations Analysis
                </h2>
                
                <div className="text-white/70 mb-6">
                    <p>
                        Find occupations that have a small percentage of the workforce but above-average wages.
                        These represent specialized, high-paying roles that could be good career targets.
                    </p>
                </div>
                
                {/* Search Form */}
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <label className="block text-white mb-2 text-sm">Search for a State (Optional)</label>
                            <div className="mb-1">
                                <Input 
                                    onChange={handleStateInputChange} 
                                    onFilterClick={handleFilterClick}
                                />
                            </div>
                            {selectedState && (
                                <div className="mt-2 flex items-center">
                                    <span className="bg-mint/20 text-mint px-2 py-1 rounded-md text-sm flex items-center">
                                        {selectedState}
                                        <button 
                                            onClick={() => {
                                                setSelectedState("");
                                                setStateSearchTerm("");
                                            }}
                                            className="ml-2 text-mint hover:text-white"
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
                        
                        <div>
                            <label className="block text-white mb-2 text-sm">
                                Max Workforce % (Jobs with fewer workers than this)
                            </label>
                            <input
                                type="number"
                                className="w-full bg-eerie-black/90 text-white border border-mint/30 rounded-md p-2.5 focus:ring-mint focus:border-mint"
                                value={workforcePct}
                                onChange={(e) => setWorkforcePct(parseFloat(e.target.value) || 0)}
                                min="0.1"
                                max="10"
                                step="0.1"
                            />
                            <div className="mt-1 text-xs text-white/50">
                                Smaller values find more specialized occupations
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-white mb-2 text-sm">
                                Min Wage % Above Average (Higher wage premium)
                            </label>
                            <input
                                type="number"
                                className="w-full bg-eerie-black/90 text-white border border-mint/30 rounded-md p-2.5 focus:ring-mint focus:border-mint"
                                value={wagePct}
                                onChange={(e) => setWagePct(parseFloat(e.target.value) || 0)}
                                min="5"
                                max="200"
                                step="5"
                            />
                            <div className="mt-1 text-xs text-white/50">
                                Higher values find better paying occupations
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-mint hover:bg-mint/80 text-eerie-black font-bold py-2 px-4 rounded-md transition-colors"
                        >
                            Find Occupations
                        </button>
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
                ) : occupationData.length > 0 ? (
                    <div className="mt-4">
                        {/* Results Controls */}
                        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                            <div className="flex items-center space-x-2">
                                <button
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                        viewMode === 'table' 
                                            ? 'bg-mint text-eerie-black' 
                                            : 'bg-eerie-black/50 text-white border border-mint/30'
                                    }`}
                                    onClick={() => setViewMode('table')}
                                >
                                    Table View
                                </button>
                                <button
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                        viewMode === 'cards' 
                                            ? 'bg-mint text-eerie-black' 
                                            : 'bg-eerie-black/50 text-white border border-mint/30'
                                    }`}
                                    onClick={() => setViewMode('cards')}
                                >
                                    Card View
                                </button>
                            </div>
                            
                            <div className="flex-1 max-w-xs">
                                <input
                                    type="text"
                                    placeholder="Search occupations..."
                                    className="w-full bg-eerie-black/90 text-white border border-mint/30 rounded-md p-2 focus:ring-mint focus:border-mint"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="text-white/70 text-sm">
                                Found {filteredData.length} occupations
                            </div>
                        </div>
                        
                        {/* Table View */}
                        {viewMode === 'table' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-white">
                                    <thead className="text-xs uppercase bg-eerie-black/80">
                                        <tr>
                                            <th scope="col" className="px-4 py-3 text-left">
                                                State
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-left">
                                                Occupation
                                            </th>
                                            <th 
                                                scope="col" 
                                                className="px-4 py-3 text-right cursor-pointer hover:bg-eerie-black/50"
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
                                                className="px-4 py-3 text-right cursor-pointer hover:bg-eerie-black/50"
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
                                                className="px-4 py-3 text-right cursor-pointer hover:bg-eerie-black/50"
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
                                    <tbody>
                                        {sortedData.map((item, index) => (
                                            <tr 
                                                key={`${item.statename}-${item.occupationtitle}-${index}`}
                                                className="border-b border-mint/10 hover:bg-eerie-black/40"
                                            >
                                                <td className="px-4 py-3">
                                                    {item.statename}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-mint">
                                                    {item.occupationtitle}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end">
                                                        <span className="mr-2">{item.workforcepct?.toFixed(2)}%</span>
                                                        <div className="w-20 bg-eerie-black/50 h-2 rounded-full overflow-hidden">
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
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end">
                                                        <span>{formatCurrency(item.occupationavgwage || 0)}</span>
                                                        <div className="w-20 bg-eerie-black/50 h-2 rounded-full overflow-hidden ml-2">
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
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end">
                                                        <span className="font-medium" style={{ color: getColor(item.amountabovestateavg || 0, 'amountabovestateavg') }}>
                                                            {formatCurrency(item.amountabovestateavg || 0)}
                                                        </span>
                                                        <div className="w-20 bg-eerie-black/50 h-2 rounded-full overflow-hidden ml-2">
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
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {/* Card View */}
                        {viewMode === 'cards' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sortedData.map((item, index) => (
                                    <motion.div
                                        key={`${item.statename}-${item.occupationtitle}-${index}`}
                                        className="bg-eerie-black/40 border border-mint/20 rounded-lg overflow-hidden hover:border-mint/50 transition-colors"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-mint font-medium truncate flex-1">{item.occupationtitle}</h3>
                                                <div className="text-xs text-white/60 bg-eerie-black/40 px-2 py-0.5 rounded-md">
                                                    {item.statename}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4 mt-4">
                                                <div>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-white/70">Workforce Share</span>
                                                        <span className="text-white">{item.workforcepct?.toFixed(2)}%</span>
                                                    </div>
                                                    <div className="w-full bg-eerie-black/50 h-2 rounded-full overflow-hidden">
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
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-white/70">Average Wage</span>
                                                        <span className="text-white">{formatCurrency(item.occupationavgwage || 0)}</span>
                                                    </div>
                                                    <div className="w-full bg-eerie-black/50 h-2 rounded-full overflow-hidden">
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
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-white/70">Above State Average</span>
                                                        <span className="font-medium" style={{ color: getColor(item.amountabovestateavg || 0, 'amountabovestateavg') }}>
                                                            {formatCurrency(item.amountabovestateavg || 0)}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-eerie-black/50 h-2 rounded-full overflow-hidden">
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
                    <div className="bg-eerie-black/50 border border-mint/20 rounded-lg p-6 text-center text-white/70">
                        <p>Set your search parameters and click "Find Occupations" to see specialized, high-paying occupations.</p>
                    </div>
                )}
            </div>
            
            {/* Explanation Section */}
            <div className="bg-eerie-black/80 rounded-lg shadow-lg border border-mint/30 p-6">
                <h3 className="text-lg font-medium text-mint mb-4 border-b border-mint/20 pb-2">
                    Understanding This Analysis
                </h3>
                
                <div className="text-white/70 space-y-4">
                    <p>
                        This tool helps identify occupations that represent a small percentage of the workforce but offer wages significantly higher 
                        than the state average. These are often specialized roles that require specific skills or education.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="bg-eerie-black/40 p-4 rounded-lg border border-mint/20">
                            <h4 className="text-white font-medium mb-2">Workforce Percentage</h4>
                            <p className="text-sm">
                                Shows what percentage of a state's workforce is employed in this occupation. 
                                Lower percentages indicate more specialized roles with fewer workers.
                            </p>
                        </div>
                        
                        <div className="bg-eerie-black/40 p-4 rounded-lg border border-mint/20">
                            <h4 className="text-white font-medium mb-2">Average Wage</h4>
                            <p className="text-sm">
                                The average annual salary for workers in this occupation within the state.
                                Useful for comparing compensation across different roles.
                            </p>
                        </div>
                        
                        <div className="bg-eerie-black/40 p-4 rounded-lg border border-mint/20">
                            <h4 className="text-white font-medium mb-2">Amount Above Average</h4>
                            <p className="text-sm">
                                How much more this occupation pays compared to the overall state average wage.
                                Higher values represent a greater wage premium.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}