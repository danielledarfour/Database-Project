import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../ui/Input";
import axios from "axios";
import { usStates } from "../../utils/cityData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { LineChart, Line } from 'recharts';
import Loader from "../../ui/Loader";

// Chart colors
const COLORS = [
  "#47B39C",
  "#FF6B6B",
  "#4E598C",
  "#FFBE0B",
  "#8AC8FF",
  "#FF9F1C",
];

// First, add the decades constant for quick navigation
const yearRange = {
    start: 1980,
    end: 2014
};

const yearOptions = Array.from({ length: yearRange.end - yearRange.start + 1 }, (_, i) => yearRange.start + i);

// Define decades for quick scrolling
const decades = {
    "1980s": { start: 1980, end: 1989 },
    "1990s": { start: 1990, end: 1999 },
    "2000s": { start: 2000, end: 2009 },
    "2010s": { start: 2010, end: 2014 },
};

export default function HousingCrimeQuestion() {
    const [selectedState, setSelectedState] = useState("");
    const [startYear, setStartYear] = useState(yearRange.start);
    const [endYear, setEndYear] = useState(yearRange.end);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('incidents');
    
    // Add year picker state and refs
    const [isStartYearPickerOpen, setIsStartYearPickerOpen] = useState(false);
    const [isEndYearPickerOpen, setIsEndYearPickerOpen] = useState(false);
    const startYearPickerRef = useRef(null);
    const endYearPickerRef = useRef(null);
    const yearSliderStartRef = useRef(null);
    const yearSliderEndRef = useRef(null);
    
    // State variables for maps
    const [showCrimeMap, setShowCrimeMap] = useState(true);
    const [showEmploymentMap, setShowEmploymentMap] = useState(true);
    const [stateData, setStateData] = useState({});
    const [highlightedState, setHighlightedState] = useState(null);
    const [stateSearchTerm, setStateSearchTerm] = useState("");
    const [showStateSuggestions, setShowStateSuggestions] = useState(false);
    const [filteredStates, setFilteredStates] = useState([]);
    
    // Refs for map containers
    const mapRef = useRef(null);
    const employmentMapRef = useRef(null);

    // Filter states based on search term
    useEffect(() => {
        if (stateSearchTerm && stateSearchTerm !== selectedState) {
            const filtered = usStates
                .filter((state) => 
                    state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())
                )
                .slice(0, 5); // Limit to 5 results
            setFilteredStates(filtered);
            setShowStateSuggestions(filtered.length > 0);
        } else {
            setFilteredStates([]);
            setShowStateSuggestions(false);
        }
    }, [stateSearchTerm, selectedState]);

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
    };

    // Update handleStartYearChange
    const handleStartYearChange = (year) => {
        const newStartYear = parseInt(year);
        setStartYear(newStartYear);
        // Ensure end year is not less than start year
        if (newStartYear > endYear) {
            setEndYear(newStartYear);
        }
        setIsStartYearPickerOpen(false);
    };

    // Update handleEndYearChange
    const handleEndYearChange = (year) => {
        const newEndYear = parseInt(year);
        setEndYear(newEndYear);
        // Ensure start year is not greater than end year
        if (newEndYear < startYear) {
            setStartYear(newEndYear);
        }
        setIsEndYearPickerOpen(false);
    };

    // Handle state input change
    const handleStateInputChange = (value) => {
        setStateSearchTerm(value);
        setShowStateSuggestions(true);
        if (!value) {
            setSelectedState("");
        }
    };

    // Handle state selection from suggestions
    const handleStateSelect = (state) => {
        setSelectedState(state.name);
        setStateSearchTerm(state.name);
        setShowStateSuggestions(false);
    };

    // Handle filter click
    const handleFilterClick = () => {
        setShowStateSuggestions(true);
    };

    const fetchData = async () => {
        if (!selectedState) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const formattedState = selectedState.replace(/ /g, "_");
            const response = await axios.get(
                `/api/housing-route/${formattedState}/${startYear}/${endYear}`
            );
            
            if (response.data && response.data.length > 0) {
            setResults(response.data);
                // Process data for maps
                processDataForMaps(response.data);
            } else {
                setError("No data available for the selected criteria.");
                setResults([]);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data. Please try again.");
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Process data for visualization
    const processDataForCharts = () => {
        if (!results || results.length === 0) return { incidents: [], prices: [], bubble: [] };

        try {
        // Group by city
        const cityData = results.reduce((acc, item) => {
            if (!acc[item.city]) {
                acc[item.city] = [];
            }
            acc[item.city].push(item);
            return acc;
        }, {});

        // Process for incidents chart (top 5 cities by avg incidents)
        const incidents = Object.entries(cityData)
            .map(([city, data]) => ({
                city,
                    avgIncidents: data.reduce((sum, item) => sum + parseFloat(item.avgincidents || 0), 0) / data.length
            }))
            .sort((a, b) => b.avgIncidents - a.avgIncidents)
            .slice(0, 5);

        // Process for prices chart (top 5 cities by avg sale price)
        const prices = Object.entries(cityData)
            .map(([city, data]) => ({
                city,
                    avgSalePrice: data.reduce((sum, item) => sum + parseFloat(item.avgsaleprice || 0), 0) / data.length
            }))
            .sort((a, b) => b.avgSalePrice - a.avgSalePrice)
            .slice(0, 5);

        // Process for bubble chart (comparing incidents, prices and employment)
        const bubble = Object.entries(cityData)
            .map(([city, data]) => {
                const avgData = data.reduce((acc, item) => {
                        acc.incidents += parseFloat(item.avgincidents || 0);
                        acc.price += parseFloat(item.avgsaleprice || 0);
                        acc.employment += parseFloat(item.avgemployment || 0);
                    return acc;
                }, { incidents: 0, price: 0, employment: 0 });
                
                return {
                    city,
                    avgIncidents: avgData.incidents / data.length,
                    avgPrice: avgData.price / data.length,
                    avgEmployment: avgData.employment / data.length,
                };
            })
            .sort((a, b) => b.avgPrice - a.avgPrice)
            .slice(0, 10);

        return { incidents, prices, bubble };
        } catch (err) {
            console.error("Error processing chart data:", err);
            return { incidents: [], prices: [], bubble: [] };
        }
    };

    const formatDollar = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Process data for map visualization
    const processDataForMaps = (data) => {
        if (!data || data.length === 0) return;
        
        try {
            // Group by state
            const stateAggregates = {};
            
            data.forEach(item => {
                const stateName = item.statename;
                if (!stateName) return;
                
                if (!stateAggregates[stateName]) {
                    stateAggregates[stateName] = {
                        incidentsSum: 0,
                        employmentSum: 0,
                        count: 0,
                        cities: new Set(),
                        occupations: new Set()
                    };
                }
                
                const incidents = parseFloat(item.avgincidents) || 0;
                const employment = parseFloat(item.avgemployment) || 0;
                
                stateAggregates[stateName].incidentsSum += incidents;
                stateAggregates[stateName].employmentSum += employment;
                stateAggregates[stateName].count++;
                stateAggregates[stateName].cities.add(item.city);
                stateAggregates[stateName].occupations.add(item.occupationtitle);
            });
            
            // Calculate averages
            const processedStateData = {};
            Object.keys(stateAggregates).forEach(state => {
                const aggregate = stateAggregates[state];
                if (aggregate.count > 0) {
                    processedStateData[state] = {
                        avgIncidents: aggregate.incidentsSum / aggregate.count,
                        avgEmployment: aggregate.employmentSum / aggregate.count,
                        citiesCount: aggregate.cities.size,
                        occupationCount: aggregate.occupations.size
                    };
                }
            });
            
            setStateData(processedStateData);
        } catch (err) {
            console.error("Error processing map data:", err);
            setError("Error processing data for maps. Please try again.");
        }
    };

    // Load Google Maps script
    const loadGoogleMapsScript = () => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            setError("No Google Maps API key provided. Please add it to your environment variables.");
            return Promise.reject("No API key");
        }
        
        return new Promise((resolve, reject) => {
            // Check if script already exists
            if (document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
                if (window.google && window.google.maps) {
                    resolve(window.google.maps);
                    return;
                }
            }
            
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,drawing,geometry`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve(window.google.maps);
            script.onerror = () => reject(new Error("Google Maps script failed to load"));
            document.head.appendChild(script);
        });
    };

    // Initialize Google Maps for crime heat map
    const initCrimeMap = () => {
        if (!window.google || !mapRef.current) return;
        
        const mapOptions = {
            center: { lat: 39.8097343, lng: -98.5556199 }, // Center of US
            zoom: 4,
            minZoom: 3,
            maxZoom: 8,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
                { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
                { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
            ],
            restriction: {
                latLngBounds: {
                    north: 49.5,
                    south: 24.0,
                    west: -125.0,
                    east: -66.0,
                },
                strictBounds: false,
            },
        };
        
        const map = new window.google.maps.Map(mapRef.current, mapOptions);
        
        // Load GeoJSON for US states
        map.data.loadGeoJson(
            'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json',
            null,
            () => {
                // Set style for the state polygons based on crime data
                map.data.setStyle(feature => {
                    const stateName = feature.getProperty('name');
                    const stateInfo = stateData[stateName];
                    
                    let fillColor = '#CCCCCC';
                    let fillOpacity = 0.3;
                    
                    if (stateInfo) {
                        // Scale crime rate to color intensity
                        const crimeRate = stateInfo.avgIncidents;
                        if (crimeRate > 3) fillColor = '#FF0000'; // High crime - red
                        else if (crimeRate > 2) fillColor = '#FF6666'; // Medium-high
                        else if (crimeRate > 1) fillColor = '#FFCCCC'; // Medium
                        else fillColor = '#FFEEEE'; // Low
                        
                        fillOpacity = 0.5 + Math.min(crimeRate / 10, 0.4); 
                    }
                    
                    return {
                        fillColor: fillColor,
                        fillOpacity: fillOpacity,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 1,
                        zIndex: 1,
                        cursor: 'pointer',
                    };
                });
            }
        );
        
        // Add hover effect
        map.data.addListener('mouseover', (event) => {
            const stateName = event.feature.getProperty('name');
            setHighlightedState(stateName);
            
            map.data.overrideStyle(event.feature, {
                fillOpacity: 0.8,
                strokeWeight: 2,
                zIndex: 2
            });
        });
        
        map.data.addListener('mouseout', (event) => {
            setHighlightedState(null);
            map.data.revertStyle();
        });
        
        const infoWindow = new window.google.maps.InfoWindow();
        
        // Click handler for state polygons
        map.data.addListener('click', (event) => {
            const stateName = event.feature.getProperty('name');
            const stateInfo = stateData[stateName];
            
            if (stateInfo) {
                const content = `
                    <div style="background-color:#FFFFFF; color:#1F3D33; padding:16px; border-radius:6px; box-shadow:0 2px 10px rgba(0,0,0,0.1); font-family:Arial, sans-serif; min-width:220px;">
                        <h3 style="margin:0 0 12px 0; color:#1F3D33; font-size:16px; font-weight:700; border-bottom:1px solid #E0E0E0; padding-bottom:8px;">${stateName}</h3>
                        <div style="margin:10px 0; display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#1F3D33; font-size:14px;">Crime Incidents:</span>
                            <strong style="color:#FF6B6B; font-size:15px;">${stateInfo.avgIncidents.toFixed(2)}</strong>
                        </div>
                        <div style="margin:10px 0; display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#1F3D33; font-size:14px;">Cities with Data:</span>
                            <strong style="color:#1F3D33; font-size:15px;">${stateInfo.citiesCount}</strong>
                        </div>
                    </div>
                `;
                
                infoWindow.setContent(content);
                infoWindow.setPosition(event.latLng);
                infoWindow.open(map);
                
                // Set selected state for filtering data in visualizations
                setSelectedState(stateName);
                setStateSearchTerm(stateName);
            }
        });
    };

    // Initialize Google Maps for employment heat map
    const initEmploymentMap = () => {
        if (!window.google || !employmentMapRef.current) return;
        
        const mapOptions = {
            center: { lat: 39.8097343, lng: -98.5556199 }, // Center of US
            zoom: 4,
            minZoom: 3,
            maxZoom: 8,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
                { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
                { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
            ],
            restriction: {
                latLngBounds: {
                    north: 49.5,
                    south: 24.0,
                    west: -125.0,
                    east: -66.0,
                },
                strictBounds: false,
            },
        };
        
        const map = new window.google.maps.Map(employmentMapRef.current, mapOptions);
        
        // Load GeoJSON for US states
        map.data.loadGeoJson(
            'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json',
            null,
            () => {
                // Set style for the state polygons based on employment data
                map.data.setStyle(feature => {
                    const stateName = feature.getProperty('name');
                    const stateInfo = stateData[stateName];
                    
                    let fillColor = '#CCCCCC';
                    let fillOpacity = 0.3;
                    
                    if (stateInfo) {
                        // Scale employment to color intensity
                        const employment = stateInfo.avgEmployment;
                        if (employment > 50000) fillColor = '#00FF00'; // Very high employment - bright green
                        else if (employment > 40000) fillColor = '#00CC00'; // High
                        else if (employment > 30000) fillColor = '#009900'; // Medium-high
                        else if (employment > 20000) fillColor = '#006600'; // Medium
                        else fillColor = '#003300'; // Low
                        
                        fillOpacity = 0.5 + Math.min(employment / 100000, 0.4); // Opacity based on employment level
                    }
                    
                    return {
                        fillColor: fillColor,
                        fillOpacity: fillOpacity,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 1,
                        zIndex: 1,
                        cursor: 'pointer',
                    };
                });
            }
        );
        
        // Add hover effect
        map.data.addListener('mouseover', (event) => {
            const stateName = event.feature.getProperty('name');
            setHighlightedState(stateName);
            
            map.data.overrideStyle(event.feature, {
                fillOpacity: 0.8,
                strokeWeight: 2,
                zIndex: 2
            });
        });
        
        map.data.addListener('mouseout', (event) => {
            setHighlightedState(null);
            map.data.revertStyle();
        });
        
        const infoWindow = new window.google.maps.InfoWindow();
        
        // Click handler for state polygons
        map.data.addListener('click', (event) => {
            const stateName = event.feature.getProperty('name');
            const stateInfo = stateData[stateName];
            
            if (stateInfo) {
                // this is the styling for card in the state view
                const content = `
                    <div style="background-color:#FFFFFF; color:#1F3D33; padding:16px; border-radius:6px; box-shadow:0 2px 10px rgba(0,0,0,0.1); font-family:Arial, sans-serif; min-width:220px;">
                        <h3 style="margin:0 0 12px 0; color:#1F3D33; font-size:16px; font-weight:700; border-bottom:1px solid #E0E0E0; padding-bottom:8px;">${stateName}</h3>
                        <div style="margin:10px 0; display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#1F3D33; font-size:14px;">Employment Avg:</span>
                            <strong style="color:#47B39C; font-size:15px;">$${stateInfo.avgEmployment.toFixed(2)}</strong>
                        </div>
                        <div style="margin:10px 0; display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#1F3D33; font-size:14px;">Occupations:</span>
                            <strong style="color:#1F3D33; font-size:15px;">${stateInfo.occupationCount}</strong>
                        </div>
                    </div>
                `;
                
                infoWindow.setContent(content);
                infoWindow.setPosition(event.latLng);
                infoWindow.open(map);
                
                // Set selected state for filtering data in visualizations
                setSelectedState(stateName);
                setStateSearchTerm(stateName);
            }
        });
    };

    // Effect to initialize maps when stateData changes
    useEffect(() => {
        if (Object.keys(stateData).length === 0) return;
        
        const initMaps = async () => {
            try {
                await loadGoogleMapsScript();
                if (showCrimeMap && mapRef.current) initCrimeMap();
                if (showEmploymentMap && employmentMapRef.current) initEmploymentMap();
            } catch (err) {
                console.error("Error initializing maps:", err);
                setError("Failed to load maps. Check your API key and internet connection.");
            }
        };
        
        initMaps();
    }, [stateData, showCrimeMap, showEmploymentMap]);

    // Fetch data when inputs change
    useEffect(() => {
        if (selectedState && startYear && endYear) {
            fetchData();
        }
    }, [selectedState, startYear, endYear]);

    // Reset all filters and data
    const handleReset = () => {
        setSelectedState("");
        setStateSearchTerm("");
        setStartYear(yearRange.start);
        setEndYear(yearRange.end);
        setResults([]);
        setStateData({});
        setActiveTab('incidents');
    };

    // Get the processed chart data once per render
    const chartData = processDataForCharts();

    useEffect(() => {
        // Add CSS for hiding scrollbar
        const style = document.createElement('style');
        style.textContent = `
            .hide-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .hide-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Add scrollToDecade function for start year
    const scrollToStartDecade = (decade) => {
        if (yearSliderStartRef.current) {
            const yearButton = document.getElementById(`start-year-${decades[decade].start}`);
            if (yearButton) {
                const slider = yearSliderStartRef.current;
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

    // Add scrollToDecade function for end year
    const scrollToEndDecade = (decade) => {
        if (yearSliderEndRef.current) {
            const yearButton = document.getElementById(`end-year-${decades[decade].start}`);
            if (yearButton) {
                const slider = yearSliderEndRef.current;
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

    // Add clickOutside handlers for year pickers
    useEffect(() => {
        function handleClickOutside(event) {
            if (startYearPickerRef.current && !startYearPickerRef.current.contains(event.target)) {
                setIsStartYearPickerOpen(false);
            }
            if (endYearPickerRef.current && !endYearPickerRef.current.contains(event.target)) {
                setIsEndYearPickerOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-eerie-black/95 backdrop-blur-md rounded-xl p-6 shadow-xl border border-mint/20"
            >
                <h2 className="text-2xl font-bold text-mint mb-4">Housing Metrics Analysis</h2>
                <p className="text-white/80 mb-6">
                    Explore housing metrics, crime incidents, and employment data across states and years.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* State Search with dropdown suggestions */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-white mb-1">
                            Search for a State
                        </label>
                        <div className="relative">
                            <Input 
                                value={stateSearchTerm}
                                onChange={handleStateInputChange} 
                                onFilterClick={handleFilterClick}
                                placeholder="Enter a state name..."
                            />
                            
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
                            <AnimatePresence>
                                {showStateSuggestions && stateSearchTerm && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute z-50 w-full bg-eerie-black border border-mint/30 rounded-md shadow-lg mt-1"
                                    >
                                        <ul>
                                            {filteredStates.length > 0 ? (
                                                filteredStates.map((state) => (
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
                                                ))
                                            ) : (
                                                <li className="px-4 py-2.5 text-white/60">
                                                    No states found
                                                </li>
                                            )}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Start Year Picker */}
                    <div className="flex flex-col space-y-1 relative" ref={startYearPickerRef}>
                        <label className="text-sm font-medium text-white mb-1">Start Year</label>
                        <button
                            onClick={() => setIsStartYearPickerOpen(!isStartYearPickerOpen)}
                            className="w-full p-2 rounded-md text-left bg-eerie-black/50 text-white border border-mint/30 focus:outline-none focus:ring-2 focus:ring-mint flex justify-between items-center"
                        >
                            <span>{startYear}</span>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transition-transform duration-300 ${isStartYearPickerOpen ? 'rotate-180' : ''}`} 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        {/* Start Year Picker Dropdown */}
                        <AnimatePresence>
                            {isStartYearPickerOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute z-50 w-full mt-10 bg-eerie-black border border-mint/30 rounded-md shadow-lg overflow-hidden"
                                    style={{ maxHeight: '300px' }}
                                >
                                    <div className="p-2">
                                        {/* Decade Quick Select */}
                                        <div className="flex flex-wrap mb-2 gap-1">
                                            {Object.keys(decades).map(decade => (
                                                <button
                                                    key={decade}
                                                    onClick={() => scrollToStartDecade(decade)}
                                                    className="px-2 py-1 text-sm bg-eerie-black/50 hover:bg-mint/30 rounded border border-mint/20 text-white hover:text-mint transition-colors"
                                                >
                                                    {decade}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        {/* Year Slider */}
                                        <div 
                                            ref={yearSliderStartRef} 
                                            className="px-2 py-1 overflow-x-auto scrollbar-thin scrollbar-thumb-mint/30 scrollbar-track-transparent"
                                            style={{ scrollbarWidth: 'thin' }}
                                        >
                                            <div className="flex space-x-2 min-w-max py-1">
                                                {yearOptions.map(year => (
                                                    <button
                                                        id={`start-year-${year}`}
                                                        key={year}
                                                        onClick={() => handleStartYearChange(year)}
                                                        className={`min-w-[3.5rem] h-14 rounded-md border transition-all
                                                            ${startYear === year
                                                                ? 'bg-mint/30 text-mint border-mint ring-2 ring-mint scale-110' 
                                                                : 'bg-eerie-black/60 text-white hover:bg-eerie-black/80 border-mint/30 hover:border-mint'}
                                                            ${year > endYear ? 'opacity-50 cursor-not-allowed' : ''}
                                                        `}
                                                        disabled={year > endYear}
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

                    {/* End Year Picker */}
                    <div className="flex flex-col space-y-1 relative" ref={endYearPickerRef}>
                        <label className="text-sm font-medium text-white mb-1">End Year</label>
                        <button
                            onClick={() => setIsEndYearPickerOpen(!isEndYearPickerOpen)}
                            className="w-full p-2 rounded-md text-left bg-eerie-black/50 text-white border border-mint/30 focus:outline-none focus:ring-2 focus:ring-mint flex justify-between items-center"
                        >
                            <span>{endYear}</span>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transition-transform duration-300 ${isEndYearPickerOpen ? 'rotate-180' : ''}`} 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        {/* End Year Picker Dropdown */}
                        <AnimatePresence>
                            {isEndYearPickerOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute z-50 w-full mt-10 bg-eerie-black border border-mint/30 rounded-md shadow-lg overflow-hidden"
                                    style={{ maxHeight: '300px' }}
                                >
                                    <div className="p-2">
                                        {/* Decade Quick Select */}
                                        <div className="flex flex-wrap mb-2 gap-1">
                                            {Object.keys(decades).map(decade => (
                                                <button
                                                    key={decade}
                                                    onClick={() => scrollToEndDecade(decade)}
                                                    className="px-2 py-1 text-sm bg-eerie-black/50 hover:bg-mint/30 rounded border border-mint/20 text-white hover:text-mint transition-colors"
                                                >
                                                    {decade}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        {/* Year Slider */}
                                        <div 
                                            ref={yearSliderEndRef} 
                                            className="px-2 py-1 overflow-x-auto scrollbar-thin scrollbar-thumb-mint/30 scrollbar-track-transparent"
                                            style={{ scrollbarWidth: 'thin' }}
                                        >
                                            <div className="flex space-x-2 min-w-max py-1">
                                                {yearOptions
                                                    .filter(year => year >= startYear)
                                                    .map(year => (
                                                        <button
                                                            id={`end-year-${year}`}
                                                            key={year}
                                                            onClick={() => handleEndYearChange(year)}
                                                            className={`min-w-[3.5rem] h-14 rounded-md border transition-all
                                                                ${endYear === year
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
                </div>

                <div className="flex justify-end mb-6 space-x-3">
                    <button 
                        onClick={handleReset}
                        className="bg-transparent hover:bg-mint/10 text-mint border border-mint px-4 py-2 rounded-md transition-colors duration-200"
                    >
                        Reset
                    </button>
                    <button 
                        onClick={fetchData}
                        className="bg-mint hover:bg-mint/90 text-black font-medium px-4 py-2 rounded-md transition-colors duration-200"
                        disabled={!selectedState}
                    >
                        Analyze Data
                    </button>
                </div>

                {error && (
                    <div className="bg-red-600/20 border border-red-500 text-white p-4 rounded-lg my-4">
                        {error}
                    </div>
                )}

                <AnimatePresence>
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center my-8"
                        >
                            <Loader />
                        </motion.div>
                    ) : results.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Map Toggle Buttons */}
                            <div className="flex space-x-4 mb-4 justify-end">
                                <button 
                                    onClick={() => setShowCrimeMap(!showCrimeMap)}
                                    className={`px-3 py-1 rounded-md ${showCrimeMap ? 'bg-red-600 text-white' : 'bg-eerie-black text-red-400 border border-red-400'}`}
                                >
                                    {showCrimeMap ? 'Hide Crime Map' : 'Show Crime Map'}
                                </button>
                                <button 
                                    onClick={() => setShowEmploymentMap(!showEmploymentMap)}
                                    className={`px-3 py-1 rounded-md ${showEmploymentMap ? 'bg-green-600 text-white' : 'bg-eerie-black text-green-400 border border-green-400'}`}
                                >
                                    {showEmploymentMap ? 'Hide Employment Map' : 'Show Employment Map'}
                                </button>
                            </div>

                            {/* Maps Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {showCrimeMap && (
                                    <div className="bg-eerie-black border border-red-500/30 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-white mb-2">Crime Incidents Map</h3>
                                        <div 
                                            ref={mapRef} 
                                            className="w-full h-[400px] rounded-md overflow-hidden"
                                        ></div>
                                        <p className="text-white/70 text-sm mt-3">
                                            Red heat map shows areas with higher crime incidents in {selectedState} between {startYear}-{endYear}.
                                        </p>
                                    </div>
                                )}

                                {showEmploymentMap && (
                                    <div className="bg-eerie-black border border-green-500/30 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-white mb-2">Employment Data Map</h3>
                                        <div 
                                            ref={employmentMapRef} 
                                            className="w-full h-[400px] rounded-md overflow-hidden"
                                        ></div>
                                        <p className="text-white/70 text-sm mt-3">
                                            Green heat map shows areas with higher employment rates in {selectedState} between {startYear}-{endYear}.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Data Visualization Tabs */}
                            <div className="bg-eerie-black border border-mint/20 rounded-lg p-4 mb-8">
                                <div className="flex border-b border-mint/20 mb-6 overflow-x-auto hide-scrollbar relative">
                                    <button
                                        onClick={() => setActiveTab('incidents')}
                                        className={`px-4 py-2 mr-4 whitespace-nowrap ${
                                            activeTab === 'incidents'
                                                ? 'text-mint border-b-2 border-mint font-medium'
                                                : 'text-white/70 hover:text-white'
                                        }`}
                                    >
                                        Crime Incidents
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('prices')}
                                        className={`px-4 py-2 mr-4 whitespace-nowrap ${
                                            activeTab === 'prices'
                                                ? 'text-mint border-b-2 border-mint font-medium'
                                                : 'text-white/70 hover:text-white'
                                        }`}
                                    >
                                        Housing Prices
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('bubble')}
                                        className={`px-4 py-2 whitespace-nowrap ${
                                            activeTab === 'bubble'
                                                ? 'text-mint border-b-2 border-mint font-medium'
                                                : 'text-white/70 hover:text-white'
                                        }`}
                                    >
                                        Comparison View
                                    </button>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 text-xs italic pr-2 hidden sm:block">
                                        <span>Scroll for more &rarr;</span>
                                    </div>
                                </div>

                                {/* Chart Content */}
                                <div className="py-2">
                                    {activeTab === 'incidents' && (
                                        <div>
                                            <h3 className="text-lg font-medium text-white mb-4">Top Cities by Crime Incidents</h3>
                                            <div className="h-[400px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={chartData.incidents} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                        <XAxis dataKey="city" tick={{ fill: 'white' }} />
                                                        <YAxis 
                                                            tick={{ fill: 'white' }} 
                                                            label={{ 
                                                                value: 'Crime Incidents', 
                                                                angle: -90, 
                                                                position: 'insideLeft', 
                                                                style: { fill: 'white', textAnchor: 'middle' }, 
                                                                offset: -5 
                                                            }}
                                                        />
                                                        <Tooltip 
                                                            contentStyle={{ 
                                                                backgroundColor: '#242f3e', 
                                                                color: 'white', 
                                                                border: '1px solid #47B39C',
                                                                borderRadius: '4px',
                                                                padding: '10px' 
                                                            }}
                                                            cursor={{fill: 'rgba(71, 179, 156, 0.2)'}}
                                                        />
                                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                                        <Bar dataKey="avgIncidents" name="Average Incidents" fill="#FF6B6B" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <p className="text-white/70 text-sm mt-4 text-center">
                                                This chart shows the top 5 cities by average crime incidents in {selectedState} between {startYear}-{endYear}.
                                            </p>
                                        </div>
                                    )}

                                    {activeTab === 'prices' && (
                                    <div>
                                            <h3 className="text-lg font-medium text-white mb-4">Top Cities by Housing Prices</h3>
                                            <div className="h-[400px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={chartData.prices} margin={{ top: 10, right: 30, left: 40, bottom: 40 }}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                <XAxis dataKey="city" tick={{ fill: 'white' }} />
                                                        <YAxis 
                                                            tick={{ fill: 'white' }} 
                                                            tickFormatter={formatDollar}
                                                            label={{ 
                                                                value: 'Average Sale Price', 
                                                                angle: -90, 
                                                                position: 'insideLeft', 
                                                                style: { fill: 'white', textAnchor: 'middle' }, 
                                                                offset: -27 
                                                            }}
                                                        />
                                                <Tooltip 
                                                            contentStyle={{ 
                                                                backgroundColor: '#242f3e', 
                                                                color: 'white', 
                                                                border: '1px solid #47B39C',
                                                                borderRadius: '4px',
                                                                padding: '10px' 
                                                            }}
                                                            formatter={(value) => [formatDollar(value), "Average Sale Price"]}
                                                            cursor={{fill: 'rgba(71, 179, 156, 0.2)'}}
                                                        />
                                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                                        <Bar dataKey="avgSalePrice" name="Average Sale Price" fill="#47B39C" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                            </div>
                                        <p className="text-white/70 text-sm mt-4 text-center">
                                                This chart shows the top 5 cities by average housing prices in {selectedState} between {startYear}-{endYear}.
                                        </p>
                                    </div>
                                )}

                                    {activeTab === 'bubble' && (
            <div>
                                            <h3 className="text-lg font-medium text-white mb-4">Crime, Housing, and Employment Comparison</h3>
                                            <div className="h-[400px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                <XAxis 
                                                    dataKey="avgIncidents" 
                                                    name="Crime Incidents" 
                                                    tick={{ fill: 'white' }} 
                                                            label={{ 
                                                                value: 'Crime Incidents', 
                                                                fill: 'white', 
                                                                position: 'insideBottom', 
                                                                offset: -10,
                                                                style: { textAnchor: 'middle' }
                                                            }}
                                                />
                                                <YAxis 
                                                    dataKey="avgPrice" 
                                                    name="Avg. Sale Price" 
                                                    tick={{ fill: 'white' }} 
                                                    tickFormatter={formatDollar}
                                                            label={{ 
                                                                value: 'Avg. Sale Price', 
                                                                angle: -90, 
                                                                fill: 'white', 
                                                                position: 'insideLeft',
                                                                style: { textAnchor: 'middle' },
                                                                offset: -27
                                                            }}
                                                />
                                                <ZAxis 
                                                    dataKey="avgEmployment" 
                                                    range={[50, 400]} 
                                                    name="Avg. Wage" 
                                                />
                                                <Tooltip 
                                                            contentStyle={{ 
                                                                backgroundColor: 'white', 
                                                                color: 'black', 
                                                                border: '1px solid #47B39C',
                                                                borderRadius: '4px',
                                                                padding: '10px' 
                                                            }}
                                                            itemStyle={{ color: '#333' }}
                                                            labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
                                                    formatter={(value, name) => {
                                                        if (name === 'Avg. Sale Price') return [formatDollar(value), name];
                                                        if (name === 'Avg. Wage') return [formatDollar(value), name];
                                                                return [value.toFixed(2), name];
                                                    }}
                                                            cursor={{ strokeDasharray: '3 3', stroke: '#47B39C' }}
                                                />
                                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                                <Scatter 
                                                    name="Cities" 
                                                            data={chartData.bubble} 
                                                    fill="#47B39C"
                                                >
                                                            {chartData.bubble.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Scatter>
                                            </ScatterChart>
                                        </ResponsiveContainer>
                                            </div>
                                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                                {chartData.bubble.map((city, index) => (
                                                <div 
                                                    key={city.city} 
                                                    className="flex items-center"
                                                >
                                                    <div 
                                                            className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                    ></div>
                                                    <span className="text-white text-sm truncate">{city.city}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-white/70 text-sm mt-4 text-center">
                                            This chart compares crime incidents (x-axis), average sale prices (y-axis), and average wages (bubble size) for cities in {selectedState}.
                                        </p>
            </div>
                                )}
                                </div>
                            </div>

                            {/* Insights Summary */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-eerie-black border border-mint/20 rounded-lg p-4">
                                    <h4 className="text-lg font-medium text-mint mb-2">Crime Insight</h4>
                                    <p className="text-white/80">
                                        {chartData.incidents[0]?.city || "N/A"} has the highest average crime incidents with {chartData.incidents[0]?.avgIncidents.toFixed(2) || "N/A"} reported cases.
                                    </p>
                                </div>
                                <div className="bg-eerie-black border border-mint/20 rounded-lg p-4">
                                    <h4 className="text-lg font-medium text-mint mb-2">Housing Insight</h4>
                                    <p className="text-white/80">
                                        {chartData.prices[0]?.city || "N/A"} has the highest average sale price at {formatDollar(chartData.prices[0]?.avgSalePrice || 0)}.
                                    </p>
                                </div>
                                <div className="bg-eerie-black border border-mint/20 rounded-lg p-4">
                                    <h4 className="text-lg font-medium text-mint mb-2">Value Insight</h4>
                                    {chartData.bubble.length > 0 && (
                                        <p className="text-white/80">
                                            {
                                                // Find city with best ratio of low crime, high wages, moderate prices
                                                (() => {
                                                    const valueCity = [...chartData.bubble].sort((a, b) => {
                                                        const scoreA = (a.avgEmployment / 100000) / ((a.avgIncidents / 1000) * (a.avgPrice / 1000000));
                                                        const scoreB = (b.avgEmployment / 100000) / ((b.avgIncidents / 1000) * (b.avgPrice / 1000000));
                                                        return scoreB - scoreA;
                                                    })[0];
                                                    
                                                    return `${valueCity.city} offers potentially good value with lower crime, reasonable prices and good wages.`;
                                                })()
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : selectedState ? (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-white/80 text-center my-8"
                        >
                            No data available for the selected criteria. Try adjusting your filters.
                        </motion.p>
                    ) : (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-white/80 text-center my-8"
                        >
                            Please select a state and click "Analyze Data" to view housing and crime metrics.
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
