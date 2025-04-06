import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const USAMap = ({ setSelectedState, dataType }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [statePolygons, setStatePolygons] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);
  const [loadError, setLoadError] = useState(null);
  
  const usStates = [
    { id: 'AL', name: 'Alabama', center: { lat: 32.806671, lng: -86.791130 } },
    { id: 'AK', name: 'Alaska', center: { lat: 61.370716, lng: -152.404419 } },
    { id: 'AZ', name: 'Arizona', center: { lat: 33.729759, lng: -111.431221 } },
    { id: 'AR', name: 'Arkansas', center: { lat: 34.969704, lng: -92.373123 } },
    { id: 'CA', name: 'California', center: { lat: 36.116203, lng: -119.681564 } },
    { id: 'CO', name: 'Colorado', center: { lat: 39.059811, lng: -105.311104 } },
    { id: 'CT', name: 'Connecticut', center: { lat: 41.597782, lng: -72.755371 } },
    { id: 'DE', name: 'Delaware', center: { lat: 39.318523, lng: -75.507141 } },
    { id: 'FL', name: 'Florida', center: { lat: 27.766279, lng: -81.686783 } },
    { id: 'GA', name: 'Georgia', center: { lat: 33.040619, lng: -83.643074 } },
    { id: 'HI', name: 'Hawaii', center: { lat: 21.094318, lng: -157.498337 } },
    { id: 'ID', name: 'Idaho', center: { lat: 44.240459, lng: -114.478828 } },
    { id: 'IL', name: 'Illinois', center: { lat: 40.349457, lng: -88.986137 } },
    { id: 'IN', name: 'Indiana', center: { lat: 39.849426, lng: -86.258278 } },
    { id: 'IA', name: 'Iowa', center: { lat: 42.011539, lng: -93.210526 } },
    { id: 'KS', name: 'Kansas', center: { lat: 38.526600, lng: -96.726486 } },
    { id: 'KY', name: 'Kentucky', center: { lat: 37.668140, lng: -84.670067 } },
    { id: 'LA', name: 'Louisiana', center: { lat: 31.169546, lng: -91.867805 } },
    { id: 'ME', name: 'Maine', center: { lat: 44.693947, lng: -69.381927 } },
    { id: 'MD', name: 'Maryland', center: { lat: 39.063946, lng: -76.802101 } },
    { id: 'MA', name: 'Massachusetts', center: { lat: 42.230171, lng: -71.530106 } },
    { id: 'MI', name: 'Michigan', center: { lat: 43.326618, lng: -84.536095 } },
    { id: 'MN', name: 'Minnesota', center: { lat: 45.694454, lng: -93.900192 } },
    { id: 'MS', name: 'Mississippi', center: { lat: 32.741646, lng: -89.678696 } },
    { id: 'MO', name: 'Missouri', center: { lat: 38.456085, lng: -92.288368 } },
    { id: 'MT', name: 'Montana', center: { lat: 46.921925, lng: -110.454353 } },
    { id: 'NE', name: 'Nebraska', center: { lat: 41.125370, lng: -98.268082 } },
    { id: 'NV', name: 'Nevada', center: { lat: 38.313515, lng: -117.055374 } },
    { id: 'NH', name: 'New Hampshire', center: { lat: 43.452492, lng: -71.563896 } },
    { id: 'NJ', name: 'New Jersey', center: { lat: 40.298904, lng: -74.521011 } },
    { id: 'NM', name: 'New Mexico', center: { lat: 34.840515, lng: -106.248482 } },
    { id: 'NY', name: 'New York', center: { lat: 42.165726, lng: -74.948051 } },
    { id: 'NC', name: 'North Carolina', center: { lat: 35.630066, lng: -79.806419 } },
    { id: 'ND', name: 'North Dakota', center: { lat: 47.528912, lng: -99.784012 } },
    { id: 'OH', name: 'Ohio', center: { lat: 40.388783, lng: -82.764915 } },
    { id: 'OK', name: 'Oklahoma', center: { lat: 35.565342, lng: -96.928917 } },
    { id: 'OR', name: 'Oregon', center: { lat: 44.572021, lng: -122.070938 } },
    { id: 'PA', name: 'Pennsylvania', center: { lat: 40.590752, lng: -77.209755 } },
    { id: 'RI', name: 'Rhode Island', center: { lat: 41.680893, lng: -71.511780 } },
    { id: 'SC', name: 'South Carolina', center: { lat: 33.856892, lng: -80.945007 } },
    { id: 'SD', name: 'South Dakota', center: { lat: 44.299782, lng: -99.438828 } },
    { id: 'TN', name: 'Tennessee', center: { lat: 35.747845, lng: -86.692345 } },
    { id: 'TX', name: 'Texas', center: { lat: 31.054487, lng: -97.563461 } },
    { id: 'UT', name: 'Utah', center: { lat: 40.150032, lng: -111.862434 } },
    { id: 'VT', name: 'Vermont', center: { lat: 44.045876, lng: -72.710686 } },
    { id: 'VA', name: 'Virginia', center: { lat: 37.769337, lng: -78.169968 } },
    { id: 'WA', name: 'Washington', center: { lat: 47.400902, lng: -121.490494 } },
    { id: 'WV', name: 'West Virginia', center: { lat: 38.491226, lng: -80.954453 } },
    { id: 'WI', name: 'Wisconsin', center: { lat: 44.268543, lng: -89.616508 } },
    { id: 'WY', name: 'Wyoming', center: { lat: 42.755966, lng: -107.302490 } }
  ];

  // Load Google Maps API
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setLoadError('No Google Maps API key provided');
      return;
    }
    
    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'drawing', 'geometry'],
    });

    loader.load().then(() => {
      if (mapRef.current) {
        initMap();
      }
    }).catch((err) => {
      console.error('Error loading Google Maps API:', err);
      setLoadError('Failed to load Google Maps');
    });
  }, []);

  // Initialize Map
  const initMap = useCallback(() => {
    if (!window.google || !mapRef.current) return;
    
    // Dark mode style for the map
    const darkModeStyle = [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#000000" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
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
      styles: darkModeStyle,
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
    
    // Create a shared info window
    const infoWindow = new window.google.maps.InfoWindow();
    setInfoWindow(infoWindow);
    
    // Load GeoJSON for US states
    newMap.data.loadGeoJson(
      'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'
    );
    
    // Set style for the state polygons
    newMap.data.setStyle(feature => {
      const stateName = feature.getProperty('name');
      const stateId = usStates.find(state => state.name === stateName)?.id || '';
      
      return {
        fillColor: dataType === 'crime' ? '#ef4444' : '#10b981',
        fillOpacity: 0.3,
        strokeColor: '#FFFFFF',
        strokeWeight: 1,
        zIndex: 1,
        cursor: 'pointer',
      };
    });
    
    // Add hover effect
    newMap.data.addListener('mouseover', (event) => {
      newMap.data.overrideStyle(event.feature, {
        fillOpacity: 0.7,
        strokeWeight: 2,
        zIndex: 2
      });
    });
    
    newMap.data.addListener('mouseout', (event) => {
      newMap.data.revertStyle();
    });
    
    // Add click handlers to the state polygons
    newMap.data.addListener('click', (event) => {
      const stateName = event.feature.getProperty('name');
      const stateObj = usStates.find(state => state.name === stateName);
      
      if (stateObj) {
        // Center the map on the clicked state
        newMap.setCenter(stateObj.center);
        
        // Show info window for the clicked state
        const rateValue = dataType === 'crime' 
          ? Math.floor(Math.random() * 100) 
          : Math.floor(Math.random() * 100);
          
        const rateColor = dataType === 'crime'
          ? rateValue > 50 ? '#ef4444' : '#f97316'
          : rateValue > 50 ? '#10b981' : '#f97316';
          
        const content = `
          <div class="p-2" style="background-color:rgb(254, 254, 254); color: black; border-radius: 4px; min-width: 120px;">
            <div style="font-weight: bold; margin-bottom: 4px; border-bottom: 1px solid #444; padding-bottom: 4px; color: black;">
              ${stateName} (${stateObj.id})
            </div>
            <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.9rem;">${dataType === 'crime' ? 'Crime Rate' : 'Employment Rate'}</span>
              <span style="font-weight: 600; color: ${rateColor};">${rateValue}%</span>
            </div>
            <button
              style="background-color: #195d30; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;"
              onclick="window.dispatchEvent(new CustomEvent('selectState', {detail: '${stateName}'})">
              Do something
            </button>
          </div>
        `;
        
        infoWindow.setContent(content);
        infoWindow.setPosition(event.latLng);
        infoWindow.open(newMap);
      }
    });
    
    // Add state labels
    usStates.forEach(state => {
      new window.google.maps.Marker({
        position: state.center,
        map: newMap,
        label: {
          text: state.id,
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: '10px',
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: 'transparent',
          fillOpacity: 0,
          strokeWeight: 0,
          scale: 0
        }
      });
    });
    
    // Listen for the custom event to handle state selection
    window.addEventListener('selectState', (e) => {
      setSelectedState(e.detail);
      infoWindow.close();
    });
    
    return () => {
      window.removeEventListener('selectState', () => {});
    };
  }, [dataType, setSelectedState, usStates]);
  
  // Update state polygon styles when dataType changes
  useEffect(() => {
    if (map) {
      map.data.setStyle(feature => {
        return {
          fillColor: dataType === 'crime' ? '#ef4444' : '#10b981',
          fillOpacity: 0.3,
          strokeColor: '#FFFFFF',
          strokeWeight: 1,
          zIndex: 1,
          cursor: 'pointer',
        };
      });
    }
  }, [dataType, map]);
  
  return (
    <div className="relative w-full">
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-eerie-black text-red-500 rounded-lg border border-red-500">
          <div className="text-center p-4">
            <div className="text-xl font-bold mb-2">Map Error</div>
            <p>{loadError}</p>
            <p className="text-sm text-gray-400 mt-2">Please check your API key configuration</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-[500px] rounded-lg bg-eerie-black border border-gray-800 shadow-inner"
        style={{ boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)" }}
      ></div>
      
      <div className="mt-3 text-sm text-gray-300">
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full ${dataType === 'crime' ? 'bg-red-500' : 'bg-green-500'} mr-2`}></div>
            <span>{dataType === 'crime' ? 'Crime Rate' : 'Employment Rate'}</span>
          </div>
          <div>
            <p>Click on any state to view detailed information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USAMap; 