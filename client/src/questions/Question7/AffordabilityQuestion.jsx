import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../ui/Input";
import axios from "axios";
import styled from "styled-components";
import Loader from "../../ui/Loader";
import { Loader as GoogleMapsLoader } from '@googlemaps/js-api-loader';
import cityData, { usStates } from "../../utils/cityData";

export default function AffordabilityQuestion() {
    // Map related state
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [infoWindow, setInfoWindow] = useState(null);
    const [loadError, setLoadError] = useState(null);

    // Data state
    const [affordabilityData, setAffordabilityData] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper function to safely format numeric values
    const safeFormatRatio = (value) => {
        return typeof value === 'number' && !isNaN(value) ? value.toFixed(2) : 'N/A';
    };

    // Helper to determine affordability level safely
    const getAffordabilityLevel = (ratio) => {
        if (typeof ratio !== 'number' || isNaN(ratio)) return 'Unknown';
        
        return ratio < 1.5 ? 'Affordable' : 
               ratio < 2.0 ? 'Moderately Affordable' : 
               ratio < 3.0 ? 'Expensive' : 'Very Expensive';
    };

    // Helper to determine color based on affordability
    const getAffordabilityColor = (ratio) => {
        if (typeof ratio !== 'number' || isNaN(ratio)) return '#888888';
        
        return ratio < 1.5 ? '#10b981' : 
               ratio < 2.0 ? '#f59e0b' : 
               ratio < 3.0 ? '#ef4444' : '#7f1d1d';
    };


    // Fetch affordability data on component mount
    useEffect(() => {
        fetchAffordabilityData();
    }, []);

    // Initialize map
    useEffect(() => {
        if (affordabilityData.length > 0) {
            initializeMap();
        }
    }, [affordabilityData]);

    // Update map data when selected state changes
    useEffect(() => {
        if (map && selectedState) {
            updateMapForState(selectedState);
        }
    }, [selectedState, map]);

    // Fetch affordability data from API
    const fetchAffordabilityData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.get('/api/housing/affordability');
            // Ensure data has valid numeric price_to_income_ratio
            const cleanedData = response.data.map(state => {
                // Parse numeric values from strings if needed
                const parseNumeric = (value) => {
                    if (typeof value === 'string') {
                        const parsed = parseFloat(value);
                        return !isNaN(parsed) ? parsed : null;
                    }
                    return typeof value === 'number' && !isNaN(value) ? value : null;
                };
                
                return {
                    ...state,
                    // Ensure all numeric values are properly parsed
                    price_to_income_ratio: parseNumeric(state.price_to_income_ratio),
                    median_price: parseNumeric(state.median_price),
                    avg_wage: parseNumeric(state.avg_wage)
                };
            });
            
            setAffordabilityData(cleanedData);
        } catch (err) {
            console.error("Error fetching affordability data:", err);
            setError("Failed to fetch housing affordability data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize Google Maps
    const initializeMap = async () => {
        if (!mapRef.current) return;

        try {
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            
            if (!apiKey) {
                setLoadError('No Google Maps API key provided');
                return;
            }
            
            const loader = new GoogleMapsLoader({
                apiKey,
                version: 'weekly',
                libraries: ['places', 'drawing', 'geometry'],
            });
            
            await loader.load();
            
            // White and red theme for the map
            const whiteRedStyle = [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#6195a0"}]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [{"visibility": "on"}, {"color": "#ffffff"}]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [{"lightness": "0"}, {"saturation": "0"}, {"color": "#f5f5f2"}, {"gamma": "1"}]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "all",
                    "stylers": [{"lightness": "-3"}, {"gamma": "1.00"}]
                },
                {
                    "featureType": "landscape.natural.terrain",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{"saturation": -100}, {"lightness": 45}, {"visibility": "simplified"}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{"visibility": "simplified"}, {"color": "#f2f2f2"}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [{"color": "#e9e9e9"}, {"lightness": "0"}]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{"color": "#e0f1f9"}, {"visibility": "on"}]
                }
            ];
            
            const mapOptions = {
                center: { lat: 39.8097343, lng: -98.5556199 }, // Center of US
                zoom: 4,
                minZoom: 3,
                maxZoom: 8,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                zoomControl: true,
                styles: whiteRedStyle,
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
            
            const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
            setMap(newMap);
            
            // Create info window
            const infoWindow = new window.google.maps.InfoWindow({
                pixelOffset: new window.google.maps.Size(0, -5),
                maxWidth: 300
            });
            setInfoWindow(infoWindow);
            
            // Load GeoJSON for US states
            newMap.data.loadGeoJson(
                'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'
            );
            
            // Apply styles based on affordability data
            styleMapData(newMap);
            
            // Add event listeners
            addMapEventListeners(newMap, infoWindow);
            
        } catch (error) {
            console.error("Error initializing map:", error);
            setLoadError("Failed to load Google Maps");
        }
    };

    // Style map polygons based on affordability data
    const styleMapData = (mapInstance) => {
        if (!mapInstance || !affordabilityData.length) return;
        
        // Filter out any invalid ratios before calculating max
        const validRatios = affordabilityData
            .filter(d => typeof d.price_to_income_ratio === 'number' && !isNaN(d.price_to_income_ratio))
            .map(d => d.price_to_income_ratio);
            
        const maxRatio = validRatios.length > 0 ? Math.max(...validRatios) : 4.0;
        
        mapInstance.data.setStyle(feature => {
            const stateName = feature.getProperty('name');
            const stateData = affordabilityData.find(d => d.statename.toLowerCase() === stateName.toLowerCase());
            
            if (!stateData || typeof stateData.price_to_income_ratio !== 'number' || isNaN(stateData.price_to_income_ratio)) {
                return {
                    fillColor: '#f5f5f5',
                    fillOpacity: 0.3,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 1,
                    zIndex: 1,
                    cursor: 'pointer'
                };
            }
            
            // Calculate color based on price-to-income ratio
            // Higher ratios (less affordable) = more red
            const ratio = stateData.price_to_income_ratio;
            const normalizedRatio = ratio / maxRatio; // 0 to 1
            
            // Calculate color from white (affordable) to red (expensive)
            // Using HSL for smoother transition: hsl(0, 100%, X%)
            // 100% = white, 50% = red
            const lightness = 100 - (normalizedRatio * 50);
            const hue = Math.max(0, 10 - (normalizedRatio * 10)); // slight hue variation
            
            return {
                fillColor: `hsl(${hue}, 100%, ${lightness}%)`,
                fillOpacity: 0.7,
                strokeColor: '#FFFFFF',
                strokeWeight: 1,
                zIndex: 1,
                cursor: 'pointer'
            };
        });
    };

    // Add event listeners to map elements
    const addMapEventListeners = (mapInstance, infoWindowInstance) => {
        if (!mapInstance || !infoWindowInstance) return;
        
        // Hover effects
        mapInstance.data.addListener('mouseover', (event) => {
            mapInstance.data.overrideStyle(event.feature, {
                strokeWeight: 2,
                zIndex: 2,
                fillOpacity: 0.9
            });
        });
        
        mapInstance.data.addListener('mouseout', (event) => {
            mapInstance.data.revertStyle();
        });
        
        // Click events
        mapInstance.data.addListener('click', (event) => {
            const stateName = event.feature.getProperty('name');
            const stateData = affordabilityData.find(d => d.statename.toLowerCase() === stateName.toLowerCase());
            
            if (stateData) {
                setSelectedState(stateData);
                
                // Create info window content
                const content = createInfoWindowContent(stateData);
                
                // Set info window content and position
                infoWindowInstance.setContent(content);
                
                // Use coordinates from the feature geometry to position the info window
                const bounds = new window.google.maps.LatLngBounds();
                event.feature.getGeometry().forEachLatLng(function(point) {
                    bounds.extend(point);
                });
                
                infoWindowInstance.setPosition(bounds.getCenter());
                infoWindowInstance.open(mapInstance);
                
                // Center map on the clicked state
                mapInstance.fitBounds(bounds);
                
                // Adjust zoom level to not be too close
                window.setTimeout(() => {
                    if (mapInstance.getZoom() > 7) {
                        mapInstance.setZoom(7);
                    }
                }, 100);
            }
        });
        
        // Close info window when clicking elsewhere on the map
        mapInstance.addListener('click', (event) => {
            if (event.placeId) {
                event.stop();
            }
        });
    };

    // Create HTML content for info window
    const createInfoWindowContent = (stateData) => {
        if (!stateData) return '<div>No data available</div>';
        
        const ratio = stateData.price_to_income_ratio;
        const affordabilityLevel = getAffordabilityLevel(ratio);
        const affordabilityColor = getAffordabilityColor(ratio);
        
        return `
            <div style="font-family: 'Arial', sans-serif; color: #333; padding: 5px;">
                <h3 style="margin: 0 0 8px; font-size: 18px; border-bottom: 2px solid ${affordabilityColor}; padding-bottom: 6px;">
                    ${stateData.statename}
                </h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: bold;">Price-to-Income Ratio:</span>
                    <span style="font-weight: bold; color: ${affordabilityColor};">${safeFormatRatio(ratio)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Median House Price:</span>
                    <span>$${Math.round(stateData.median_price || 0).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Average Annual Wage:</span>
                    <span>$${Math.round(stateData.avg_wage || 0).toLocaleString()}</span>
                </div>
                <div style="margin-top: 10px; padding: 6px; background-color: ${affordabilityColor}20; border-radius: 4px; text-align: center; font-weight: bold; color: ${affordabilityColor};">
                    ${affordabilityLevel}
                </div>
            </div>
        `;
    };

    // Update map when a state is selected
    const updateMapForState = (stateData) => {
        if (!map || !stateData) return;
        
        const stateName = stateData.statename;
        
        // Find the feature for this state and zoom to it
        map.data.forEach(feature => {
            if (feature.getProperty('name').toLowerCase() === stateName.toLowerCase()) {
                const bounds = new window.google.maps.LatLngBounds();
                feature.getGeometry().forEachLatLng(function(point) {
                    bounds.extend(point);
                });
                
                map.fitBounds(bounds);
                
                // Adjust zoom level to not be too close
                window.setTimeout(() => {
                    if (map.getZoom() > 7) {
                        map.setZoom(7);
                    }
                }, 100);
            }
        });
    };

    // Reset map view to show the entire US
    const handleResetMapView = () => {
        if (!map) return;
        
        map.setCenter({ lat: 39.8097343, lng: -98.5556199 });
        map.setZoom(4);
        
        if (infoWindow) {
            infoWindow.close();
        }
        
        setSelectedState(null);
    };

    // Format price for display
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price || 0);
    };

    // Calculate affordability metrics for display
    const affordabilityMetrics = useMemo(() => {
        if (!affordabilityData.length) return null;
        
        // Filter out invalid data points
        const validData = affordabilityData.filter(
            item => typeof item.price_to_income_ratio === 'number' && !isNaN(item.price_to_income_ratio)
        );
        
        if (validData.length === 0) return null;
        
        // Sort by price-to-income ratio
        const sortedData = [...validData].sort((a, b) => a.price_to_income_ratio - b.price_to_income_ratio);
        
        // Most affordable states (lowest ratio)
        const mostAffordable = sortedData.slice(0, 5);
        
        // Least affordable states (highest ratio)
        const leastAffordable = sortedData.slice(-5).reverse();
        
        // Average ratio
        const avgRatio = sortedData.reduce((sum, item) => sum + item.price_to_income_ratio, 0) / sortedData.length;
        
        // Median ratio 
        const medianRatio = sortedData[Math.floor(sortedData.length / 2)].price_to_income_ratio;
        
        return {
            mostAffordable,
            leastAffordable,
            avgRatio,
            medianRatio
        };
    }, [affordabilityData]);

    return (
        <>
            <div className="space-y-6">
                <div className="bg-eerie-black/80 rounded-lg shadow-lg border border-mint/30 p-6">
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-mint/30 pb-2">
                        Housing Affordability Across the United States
                    </h2>
                    
                    <div className="text-white/70 mb-6">
                        <p>
                            The map below shows housing affordability based on the price-to-income ratio for each state.
                            <strong className="text-white"> Whiter areas</strong> are more affordable, while <strong className="text-red-500">redder areas</strong> are less affordable.
                            Click on a state to see detailed information.
                        </p>
                    </div>
                    
                    {/* Map Container */}
                    <div className="relative">
                        {loadError && (
                            <div className="p-4 bg-red-500/20 border border-red-500 rounded-md text-red-200 mb-4">
                                {loadError}
                            </div>
                        )}
                        
                        {isLoading ? (
                            <div className="flex justify-center items-center bg-eerie-black/50 rounded-lg h-[500px]">
                                <Loader />
                            </div>
                        ) : (
                            <>
                                <div
                                    ref={mapRef}
                                    className="h-[500px] w-full bg-eerie-black/50 rounded-lg border border-mint/20 overflow-hidden"
                                />
                                
                                {/* Map Controls */}
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={handleResetMapView}
                                        className="px-3 py-2 bg-eerie-black/80 border border-mint/30 text-mint rounded-md hover:bg-mint/20 transition-colors shadow-lg"
                                    >
                                        Reset View
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    
                    {/* Selected State Details */}
                    <AnimatePresence>
                        {selectedState && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="mt-6 bg-eerie-black/70 backdrop-blur-lg rounded-lg border border-mint/40 p-4 shadow-xl"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-mint">
                                        {selectedState.statename} Housing Affordability
                                    </h3>
                                    <button
                                        onClick={() => setSelectedState(null)}
                                        className="text-white/70 hover:text-white p-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div className="bg-eerie-black/80 rounded-lg p-4 border border-mint/20">
                                        <p className="text-white/70 text-sm">Median Home Price</p>
                                        <p className="text-2xl font-bold text-white">
                                            {formatPrice(selectedState.median_price)}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-eerie-black/80 rounded-lg p-4 border border-mint/20">
                                        <p className="text-white/70 text-sm">Average Annual Wage</p>
                                        <p className="text-2xl font-bold text-white">
                                            {formatPrice(selectedState.avg_wage)}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-eerie-black/80 rounded-lg p-4 border border-mint/20">
                                        <p className="text-white/70 text-sm">Price-to-Income Ratio</p>
                                        <p className={`text-2xl font-bold ${typeof selectedState.price_to_income_ratio === 'number' && !isNaN(selectedState.price_to_income_ratio) && selectedState.price_to_income_ratio < 2 ? 'text-mint' : 'text-red-500'}`}>
                                            {safeFormatRatio(selectedState.price_to_income_ratio)}
                                        </p>
                                        <p className="text-white/70 text-xs mt-1">
                                            {getAffordabilityLevel(selectedState.price_to_income_ratio)}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-4 text-white/80 text-sm">
                                    <p>
                                        The price-to-income ratio is a measure of housing affordability. 
                                        It represents how many years of income it would take to purchase a home at the median price.
                                        A lower ratio indicates better affordability.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* Affordability Rankings */}
                {affordabilityMetrics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Most Affordable States */}
                        <div className="bg-eerie-black/80 rounded-lg shadow-lg border border-mint/30 p-6">
                            <h3 className="text-lg font-medium text-mint mb-4 border-b border-mint/20 pb-2">
                                Most Affordable States
                            </h3>
                            
                            <div className="space-y-3">
                                {affordabilityMetrics.mostAffordable.map((state, index) => (
                                    <div 
                                        key={state.statename}
                                        className="p-3 bg-gradient-to-r from-mint/10 to-transparent border-l-4 border-mint rounded-r-md flex justify-between items-center cursor-pointer hover:bg-mint/5 transition-colors"
                                        onClick={() => {
                                            setSelectedState(state);
                                            updateMapForState(state);
                                        }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-mint font-bold">{index + 1}</span>
                                            <span className="text-white">{state.statename}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-mint font-bold">{safeFormatRatio(state.price_to_income_ratio)}</div>
                                            <div className="text-white/60 text-xs">Price-to-Income Ratio</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Least Affordable States */}
                        <div className="bg-eerie-black/80 rounded-lg shadow-lg border border-red-500/30 p-6">
                            <h3 className="text-lg font-medium text-red-400 mb-4 border-b border-red-500/20 pb-2">
                                Least Affordable States
                            </h3>
                            
                            <div className="space-y-3">
                                {affordabilityMetrics.leastAffordable.map((state, index) => (
                                    <div 
                                        key={state.statename}
                                        className="p-3 bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-red-500 rounded-r-md flex justify-between items-center cursor-pointer hover:bg-red-500/5 transition-colors"
                                        onClick={() => {
                                            setSelectedState(state);
                                            updateMapForState(state);
                                        }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-red-400 font-bold">{index + 1}</span>
                                            <span className="text-white">{state.statename}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-red-400 font-bold">{safeFormatRatio(state.price_to_income_ratio)}</div>
                                            <div className="text-white/60 text-xs">Price-to-Income Ratio</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* National Averages */}
                {affordabilityMetrics && (
                    <div className="bg-eerie-black/80 rounded-lg shadow-lg border border-mint/30 p-6">
                        <h3 className="text-lg font-medium text-mint mb-4 border-b border-mint/20 pb-2">
                            National Housing Affordability Overview
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-eerie-black/50 p-4 rounded-lg border border-mint/20">
                                <p className="text-white/70 text-sm">Average Price-to-Income Ratio</p>
                                <p className="text-3xl font-bold text-white mt-1">
                                    {safeFormatRatio(affordabilityMetrics.avgRatio)}
                                </p>
                                <div className="h-2 bg-eerie-black/80 rounded-full mt-2 overflow-hidden">
                                    <div 
                                        className={`h-full ${affordabilityMetrics.avgRatio < 2 ? 'bg-mint' : 'bg-red-500'}`}
                                        style={{ width: `${Math.min(100, (affordabilityMetrics.avgRatio / 4) * 100)}%` }}
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-eerie-black/50 p-4 rounded-lg border border-mint/20">
                                <p className="text-white/70 text-sm">Median Price-to-Income Ratio</p>
                                <p className="text-3xl font-bold text-white mt-1">
                                    {safeFormatRatio(affordabilityMetrics.medianRatio)}
                                </p>
                                <div className="h-2 bg-eerie-black/80 rounded-full mt-2 overflow-hidden">
                                    <div 
                                        className={`h-full ${affordabilityMetrics.medianRatio < 2 ? 'bg-mint' : 'bg-red-500'}`}
                                        style={{ width: `${Math.min(100, (affordabilityMetrics.medianRatio / 4) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4 text-white/80 text-sm">
                            <p>
                                Housing affordability is measured using the price-to-income ratio, which compares median home prices to average annual wages.
                                A ratio below 3.0 is generally considered affordable, while higher ratios indicate housing costs that significantly outpace incomes.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}