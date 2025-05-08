import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Input from "../../ui/Input";
import axios from "axios";
import Loader from "../../ui/Loader";
import { usStates } from "../../utils/cityData";
import InfiniteMenu from "../../ui/InfiniteMenu";
import propertyTypeImages from "../../utils/houseToImage";


export default function StateHousing() {
    // State for inputs
    const [selectedState, setSelectedState] = useState("");
    const [stateSearchTerm, setStateSearchTerm] = useState("");
    const [showStateSuggestions, setShowStateSuggestions] = useState(false);
    const [selectedPropertyType, setSelectedPropertyType] = useState("");

    // Data fetching state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [housingData, setHousingData] = useState([]);
    
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

    // Calculate the maximum price for scaling the chart
    const maxPrice = useMemo(() => {
        if (!housingData.length) return 1000000;
        return Math.max(...housingData.map(city => city.mediansaleprice || 0)) * 1.1; // Add 10% for visual margin
    }, [housingData]);

    // Set chart ready after mounting and data is available
    useEffect(() => {
        if (housingData.length > 0 && chartContainerRef.current) {
            const timer = setTimeout(() => {
                setChartReady(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [housingData]);

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

    // Handle property type selection
    const handlePropertyTypeSelect = useCallback((propertyType) => {
        console.log("StateHousing: Property type selected:", propertyType);
        // Only update state if actually different
        if (propertyType !== selectedPropertyType) {
            setSelectedPropertyType(propertyType);
        }
    }, [selectedPropertyType]);

    // Handle filter click
    const handleFilterClick = () => {
        setShowStateSuggestions(true);
    };

    // Fetch housing data for the selected state and property type
    const fetchHousingData = async (state, propertyType) => {
        if (!state || !propertyType) {
            setError("Please select both a state and property type");
            return;
        }

        setIsLoading(true);
        setError(null);
        setChartReady(false);
        
        try {
            // Format property type for the API request
            const formattedPropertyType = encodeURIComponent(propertyType);
            const response = await axios.get(`/api/housing/${state}/${formattedPropertyType}`);
            
            // Ensure response.data is an array before mapping
            const responseData = Array.isArray(response.data) ? response.data : 
                                (response.data && response.data.data ? response.data.data : []);
            
            // Parse numeric values from strings if needed
            const parsedData = responseData.map(item => ({
                ...item,
                mediansaleprice: typeof item.mediansaleprice === 'string' ? parseFloat(item.mediansaleprice) : item.mediansaleprice
            }));
            
            setHousingData(parsedData);
        } catch (err) {
            console.error("Error fetching housing data:", err);
            setError(`Failed to fetch housing data: ${err.message || 'Unknown error'}`);
            setHousingData([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e && e.preventDefault();
        fetchHousingData(selectedState, selectedPropertyType);
    };

    // Format currency values
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value || 0);
    };

    // Get gradient color based on price percentile
    const getPriceColor = (price) => {
        if (!price) return '#888888';
        
        // Calculate how expensive this city is relative to the max
        const percentOfMax = price / maxPrice;
        
        // Return gradient from mint (cheaper) to red (more expensive)
        if (percentOfMax < 0.3) return '#10b981'; // mint for cheaper cities
        if (percentOfMax < 0.6) return '#f59e0b'; // amber for mid-range
        if (percentOfMax < 0.8) return '#ef4444'; // light red for expensive
        return '#b91c1c'; // dark red for most expensive
    };

    return (
        <div className="space-y-6">
            <div className="bg-eerie-black/80 rounded-lg shadow-lg border border-mint/30 p-6">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-mint/30 pb-2">
                    Top 20 Most Expensive Cities for {selectedPropertyType || "Properties"}
                </h2>
                
                <div className="text-white/70 mb-6">
                    <p>
                        Explore the most expensive cities for different residential property types in a selected state.
                        Choose a property type from the carousel below, then select a state to view the rankings.
                    </p>
                </div>
                
                {/* Property Type Selector */}
                <div className="mb-8">
                    <h3 className="text-xl font-medium text-mint mb-4">Select Property Type</h3>
                    <div style={{ height: '600px', position: 'relative' }}>
                        {useMemo(() => (
                            <InfiniteMenu 
                                items={Object.entries(propertyTypeImages).map(([type, image]) => ({
                                    image,
                                    title: type,
                                    description: `View housing data for ${type}`,
                                    link: '#',
                                    id: type,
                                }))}
                                onSelect={handlePropertyTypeSelect}
                            />
                        ), [handlePropertyTypeSelect])}
                    </div>
                    {selectedPropertyType && (
                        <div className="mt-4 flex items-center justify-center">
                            <span className="bg-mint/20 text-mint px-3 py-2 rounded-md flex items-center">
                                <span className="font-medium">{selectedPropertyType}</span>
                                <button 
                                    onClick={() => setSelectedPropertyType("")}
                                    className="ml-2 text-mint hover:text-white"
                                    aria-label="Clear selected property type"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        </div>
                    )}
                    {!selectedPropertyType && (
                        <div className="mt-4 text-center text-white/60">
                            <p>Drag to rotate the selection wheel and choose a property type</p>
                        </div>
                    )}
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
                                                setHousingData([]);
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
                                className={`${
                                    !selectedState || !selectedPropertyType || isLoading
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-mint hover:bg-mint/80'
                                } text-eerie-black font-bold py-2 px-6 rounded-md transition-colors`}
                                disabled={!selectedState || !selectedPropertyType || isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-eerie-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        Find Top Cities
                                        {selectedPropertyType && selectedState && (
                                            <span className="ml-2 text-xs opacity-80">
                                                for {selectedPropertyType} in {selectedState}
                                            </span>
                                        )}
                                    </span>
                                )}
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
                ) : housingData.length > 0 ? (
                    <div ref={chartContainerRef} className="mt-8">
                        <h3 className="text-xl font-bold text-mint mb-4">
                            {`Top ${housingData.length} Most Expensive Cities for ${selectedPropertyType} in ${selectedState}`}
                        </h3>
                        
                        {/* Horizontal Bar Chart */}
                        <div className="mt-4 space-y-3">
                            {housingData.map((city, index) => (
                                <div 
                                    key={`${city.city}-${index}`} 
                                    className="bg-eerie-black/40 rounded-md p-3 hover:bg-eerie-black/60 transition-colors"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center">
                                            <span className="text-white/70 w-6 text-right mr-3">{index + 1}.</span>
                                            <span className="text-white font-medium">{city.city}</span>
                                        </div>
                                        <span className="font-bold" style={{ color: getPriceColor(city.mediansaleprice) }}>
                                            {formatCurrency(city.mediansaleprice)}
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
                                                    backgroundColor: getPriceColor(city.mediansaleprice)
                                                }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(city.mediansaleprice / maxPrice) * 100}%` }}
                                                transition={{ duration: 0.7, delay: index * 0.03, ease: "easeOut" }}
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {/* Summary Stats */}
                        {housingData.length > 0 && (
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-eerie-black/50 p-4 rounded-lg border border-mint/20">
                                    <p className="text-white/70 text-sm">Most Expensive City</p>
                                    <p className="text-xl font-bold text-white">{housingData[0]?.city}</p>
                                    <p className="text-mint font-bold">{formatCurrency(housingData[0]?.mediansaleprice)}</p>
                                </div>
                                
                                <div className="bg-eerie-black/50 p-4 rounded-lg border border-mint/20">
                                    <p className="text-white/70 text-sm">Average Price</p>
                                    <p className="text-xl font-bold text-white">
                                        {formatCurrency(
                                            housingData.reduce((sum, city) => sum + (city.mediansaleprice || 0), 0) / housingData.length
                                        )}
                                    </p>
                                </div>
                                
                                <div className="bg-eerie-black/50 p-4 rounded-lg border border-mint/20">
                                    <p className="text-white/70 text-sm">Price Range</p>
                                    <p className="text-xl font-bold text-white">
                                        {formatCurrency(housingData[housingData.length - 1]?.mediansaleprice)} - {formatCurrency(housingData[0]?.mediansaleprice)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : selectedState && selectedPropertyType && !isLoading && (
                    <div className="bg-eerie-black/50 border border-mint/20 rounded-lg p-6 text-center text-white/70">
                        <p>No housing data available for {selectedPropertyType} in {selectedState}. Please try another combination.</p>
                    </div>
                )}
            </div>
            
            {/* Explanation Section */}
            <div className="bg-eerie-black/80 rounded-lg shadow-lg border border-mint/30 p-6">
                <h3 className="text-lg font-medium text-mint mb-4 border-b border-mint/20 pb-2">
                    Understanding Housing Markets
                </h3>
                
                <div className="text-white/70 space-y-4">
                    <p>
                        Property prices vary significantly between cities and property types within the same state, often due to factors like:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="bg-eerie-black/40 p-4 rounded-lg border border-mint/20">
                            <h4 className="text-white font-medium mb-2">Economic Factors</h4>
                            <p className="text-sm">
                                Cities with strong job markets, higher incomes, and thriving industries tend to have more expensive housing.
                            </p>
                        </div>
                        
                        <div className="bg-eerie-black/40 p-4 rounded-lg border border-mint/20">
                            <h4 className="text-white font-medium mb-2">Location & Amenities</h4>
                            <p className="text-sm">
                                Access to schools, parks, cultural venues, and natural attractions can significantly impact housing prices.
                            </p>
                        </div>
                        
                        <div className="bg-eerie-black/40 p-4 rounded-lg border border-mint/20">
                            <h4 className="text-white font-medium mb-2">Supply & Demand</h4>
                            <p className="text-sm">
                                Cities with limited housing supply but high demand often experience elevated property values and competitive markets.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
