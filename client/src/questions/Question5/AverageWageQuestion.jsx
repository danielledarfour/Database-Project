import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from 'react-chartjs-2';
import axios from "axios";
import Input from "../../ui/Input";
import styled from "styled-components";
import cityData, { usStates } from "../../utils/cityData";
import Loader from "../../ui/Loader";

/** 
 * Question 5: Given a state and a year, what are the average wages for each occupation 
 * in that state considering that the state has both the housing and crime data for such a year.
**/
export default function AverageWageQuestion() {
    // Search filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [filteredStates, setFilteredStates] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    
    // Year selection
    const [selectedYear, setSelectedYear] = useState("");
    const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
    const yearPickerRef = useRef(null);
    const yearSliderRef = useRef(null);
    
    // Results state
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // List of years for which we have data between 1980 and 2014
    const yearRange = {
        min: 1980,
        max: 2014
    };

    const availableYears = Array.from({ length: yearRange.max - yearRange.min + 1 }, (_, i) => yearRange.min + i);
    
    // Define decades for quick scrolling
    const decades = {
        "1980s": { start: 1980, end: 1989 },
        "1990s": { start: 1990, end: 1999 },
        "2000s": { start: 2000, end: 2009 },
        "2010s": { start: 2010, end: 2014 },
    };

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

    // Close year picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (yearPickerRef.current && !yearPickerRef.current.contains(event.target)) {
                setIsYearPickerOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle state selection from search results
    const handleStateSelect = (state) => {
        setSelectedState(state.name);
        setSearchQuery(state.name);
        setShowSearchResults(false);
    };

    // Handle input change for state search
    const handleInputChange = (value) => {
        setSearchQuery(value);
        if (!value) {
            setSelectedState("");
        }
    };

    // Handle year selection
    const handleYearClick = (year) => {
        setSelectedYear(year.toString());
        setIsYearPickerOpen(false);
    };

    // Scroll to a specific decade
    const scrollToDecade = (decade) => {
        if (yearSliderRef.current) {
            const yearButton = document.getElementById(`year-${decades[decade].start}`);
            if (yearButton) {
                const slider = yearSliderRef.current;
                const buttonLeft = yearButton.offsetLeft;
                const sliderWidth = slider.clientWidth;
                
                // Calculate the target scroll position to center the decade
                const scrollTarget = buttonLeft - (sliderWidth / 2) + (yearButton.clientWidth * 2);
                
                // Smooth scroll to position
                slider.scrollTo({
                    left: scrollTarget,
                    behavior: 'smooth'
                });
            }
        }
    };

    // Handle search
    const handleSearch = async () => {
        setError(null);
        
        if (!selectedState || !selectedYear) {
            setError("Please select a state and year");
            return;
        }
        
        setIsLoading(true);

        try {
            // Replace spaces with underscores for URL safety
            const formattedState = selectedState.toLowerCase().replace(/ /g, '_');
            const response = await axios.get(`/api/state/${formattedState}/${selectedYear}`);
            setSearchResults(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching occupation wage data:", err);
            setError("Error fetching occupation wage data. Please try again.");
            setSearchResults([]);
            setIsLoading(false);
        }
    };

    // Prepare chart data when search results are available
    const prepareChartData = () => {
        if (!searchResults || searchResults.length === 0) return null;
        
        // Sort by wage descending and take top 15 occupations for better visualization
        const topOccupations = [...searchResults]
            .sort((a, b) => b.avgwage - a.avgwage)
            .slice(0, 15);
        
        return {
            labels: topOccupations.map(result => result.occupationtitle),
            datasets: [
                {
                    label: `Average Wages in ${selectedState} (${selectedYear})`,
                    data: topOccupations.map(result => result.avgwage),
                    backgroundColor: 'rgba(16, 185, 129, 0.6)', // mint
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 1
                }
            ]
        };
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Horizontal bar chart
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#ffffff',
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#ffffff'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return '$' + context.raw.toLocaleString();
                    }
                }
            }
        }
    };

    return (
        <>
            {/* Average Wage Search Form */}
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

                {/* Year Picker */}
                <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-end">
                    <div className="lg:col-span-6 relative" ref={yearPickerRef}>
                        <label className="block text-sm font-medium text-white mb-1">
                            Select Year
                        </label>
                        
                        {/* Year Selector Button */}
                        <button
                            onClick={() => setIsYearPickerOpen(!isYearPickerOpen)}
                            className="w-full p-2 rounded-md text-left bg-eerie-black text-white border border-mint focus:outline-none focus:ring-2 focus:ring-mint flex justify-between items-center"
                        >
                            <span>{selectedYear || "Select a year"}</span>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transition-transform duration-300 ${isYearPickerOpen ? 'rotate-180' : ''}`} 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        {/* Year Picker Dropdown */}
                        <AnimatePresence>
                            {isYearPickerOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute z-50 w-full mt-1 bg-eerie-black border border-mint/30 rounded-md shadow-lg overflow-hidden"
                                    style={{ maxHeight: '300px' }}
                                >
                                    <div className="p-2">
                                        {/* Decade Quick Select */}
                                        <div className="flex flex-wrap mb-2 gap-1">
                                            {Object.keys(decades).map(decade => (
                                                <button
                                                    key={decade}
                                                    onClick={() => scrollToDecade(decade)}
                                                    className="px-2 py-1 text-sm bg-eerie-black/50 hover:bg-mint/30 rounded border border-mint/20 text-white hover:text-mint transition-colors"
                                                >
                                                    {decade}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        {/* Year Slider */}
                                        <div 
                                            ref={yearSliderRef} 
                                            className="px-2 py-1 overflow-x-auto scrollbar-thin scrollbar-thumb-mint/30 scrollbar-track-transparent"
                                            style={{ scrollbarWidth: 'thin' }}
                                        >
                                            <div className="flex space-x-2 min-w-max py-1">
                                                {availableYears.map(year => (
                                                    <button
                                                        id={`year-${year}`}
                                                        key={year}
                                                        onClick={() => handleYearClick(year)}
                                                        className={`min-w-[3.5rem] h-14 rounded-md border transition-all
                                                                ${selectedYear === year.toString()
                                                                    ? 'bg-mint/30 text-mint border-mint ring-2 ring-mint scale-110' 
                                                                    : 'bg-eerie-black/60 text-white hover:bg-eerie-black/80 border-mint/30 hover:border-mint'}
                                                                `}
                                                    >
                                                        <span className="font-bold">{year}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Search Button */}
                    <div className="lg:col-span-2">
                        <button
                            onClick={handleSearch}
                            className="w-full bg-mint hover:bg-mint/90 text-white py-3 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                "View Average Wages"
                            )}
                        </button>
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
            {!searchResults.length && !isLoading && !error && (
                <div className="mt-6 bg-eerie-black/50 rounded-lg border border-mint/20 p-6">
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-mint/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-medium text-white mb-2">No Wage Data Selected</h2>
                        <p className="text-white/70 max-w-lg mx-auto mb-6">
                            Select a state and year to view average wages for different occupations.
                        </p>
                    </div>
                </div>
            )}

            {/* Results */}
            <AnimatePresence>
                {searchResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-8"
                    >
                        <div className="bg-eerie-black/90 rounded-lg shadow-lg border border-mint/30 p-6">
                            <h2 className="text-2xl font-bold text-white mb-4 border-b border-mint/30 pb-2">
                                Average Wages by Occupation in {selectedState} ({selectedYear})
                            </h2>
                            
                            {/* Chart Display */}
                            <div className="bg-eerie-black/50 border border-mint/20 rounded-lg p-4 mb-6">
                                <div className="h-[500px]">
                                    {prepareChartData() && (
                                        <Bar data={prepareChartData()} options={chartOptions} />
                                    )}
                                </div>
                            </div>
                            
                            {/* Table Display */}
                            <div className="bg-eerie-black/50 border border-mint/20 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-mint/20">
                                    <thead className="bg-eerie-black/70">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mint uppercase tracking-wider">
                                                Occupation Title
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-mint uppercase tracking-wider">
                                                Average Annual Wage
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-mint/10">
                                        {searchResults.map((result, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-eerie-black/30' : 'bg-eerie-black/50'}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                    {result.occupationtitle}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">
                                                    ${parseFloat(result.avgwage).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(16, 185, 129, 0.05);
                border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(16, 185, 129, 0.3);
                border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(16, 185, 129, 0.5);
                }
            `}</style>
        </>
    );
}