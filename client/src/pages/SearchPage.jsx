import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../ui/Input";
// Lazy load the Hyperspeed component
const Hyperspeed = lazy(() => import("../ui/Hyperspeed"));
import styled from "styled-components";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import cityData from "../utils/cityData";
import Sidebar, { dataQuestions } from "../components/Sidebar";

// Import question components
import HousingQuestion from "../questions/HousingQuestion";
import CrimeQuestion from "../questions/CrimeQuestion";
import GenericQuestion from "../questions/GenericQuestion";
import StateHousePrices from "../questions/StateHousePrices";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Available property types
const propertyTypes = [
  "Condo/Co-op",
  "Multi-Family (2-4 Unit)",
  "Single Family Residential",
  "Townhouse",
  "All Residential"
];

// All US states for dropdown
const usStates = [
  { id: 'AL', name: 'Alabama' },
  { id: 'AK', name: 'Alaska' },
  { id: 'AZ', name: 'Arizona' },
  { id: 'AR', name: 'Arkansas' },
  { id: 'CA', name: 'California' },
  { id: 'CO', name: 'Colorado' },
  { id: 'CT', name: 'Connecticut' },
  { id: 'DE', name: 'Delaware' },
  { id: 'FL', name: 'Florida' },
  { id: 'GA', name: 'Georgia' },
  { id: 'HI', name: 'Hawaii' },
  { id: 'ID', name: 'Idaho' },
  { id: 'IL', name: 'Illinois' },
  { id: 'IN', name: 'Indiana' },
  { id: 'IA', name: 'Iowa' },
  { id: 'KS', name: 'Kansas' },
  { id: 'KY', name: 'Kentucky' },
  { id: 'LA', name: 'Louisiana' },
  { id: 'ME', name: 'Maine' },
  { id: 'MD', name: 'Maryland' },
  { id: 'MA', name: 'Massachusetts' },
  { id: 'MI', name: 'Michigan' },
  { id: 'MN', name: 'Minnesota' },
  { id: 'MS', name: 'Mississippi' },
  { id: 'MO', name: 'Missouri' },
  { id: 'MT', name: 'Montana' },
  { id: 'NE', name: 'Nebraska' },
  { id: 'NV', name: 'Nevada' },
  { id: 'NH', name: 'New Hampshire' },
  { id: 'NJ', name: 'New Jersey' },
  { id: 'NM', name: 'New Mexico' },
  { id: 'NY', name: 'New York' },
  { id: 'NC', name: 'North Carolina' },
  { id: 'ND', name: 'North Dakota' },
  { id: 'OH', name: 'Ohio' },
  { id: 'OK', name: 'Oklahoma' },
  { id: 'OR', name: 'Oregon' },
  { id: 'PA', name: 'Pennsylvania' },
  { id: 'RI', name: 'Rhode Island' },
  { id: 'SC', name: 'South Carolina' },
  { id: 'SD', name: 'South Dakota' },
  { id: 'TN', name: 'Tennessee' },
  { id: 'TX', name: 'Texas' },
  { id: 'UT', name: 'Utah' },
  { id: 'VT', name: 'Vermont' },
  { id: 'VA', name: 'Virginia' },
  { id: 'WA', name: 'Washington' },
  { id: 'WV', name: 'West Virginia' },
  { id: 'WI', name: 'Wisconsin' },
  { id: 'WY', name: 'Wyoming' }
];

// Adjacent/nearby states for recommendations
const nearbyStates = {
  'Alabama': ['Florida', 'Georgia', 'Tennessee', 'Mississippi'],
  'Alaska': ['Washington', 'Hawaii', 'Oregon'],
  'Arizona': ['California', 'Nevada', 'Utah', 'New Mexico'],
  'Arkansas': ['Louisiana', 'Mississippi', 'Tennessee', 'Missouri', 'Oklahoma', 'Texas'],
  'California': ['Oregon', 'Nevada', 'Arizona'],
  'Colorado': ['Wyoming', 'Nebraska', 'Kansas', 'Oklahoma', 'New Mexico', 'Arizona', 'Utah'],
  'Connecticut': ['Rhode Island', 'Massachusetts', 'New York'],
  'Delaware': ['Maryland', 'Pennsylvania', 'New Jersey'],
  'Florida': ['Georgia', 'Alabama'],
  'Georgia': ['Florida', 'Alabama', 'Tennessee', 'North Carolina', 'South Carolina'],
  'Hawaii': ['California', 'Alaska'],
  'Idaho': ['Washington', 'Oregon', 'Nevada', 'Utah', 'Wyoming', 'Montana'],
  'Illinois': ['Wisconsin', 'Indiana', 'Kentucky', 'Missouri', 'Iowa'],
  'Indiana': ['Michigan', 'Ohio', 'Kentucky', 'Illinois'],
  'Iowa': ['Minnesota', 'Wisconsin', 'Illinois', 'Missouri', 'Nebraska', 'South Dakota'],
  'Kansas': ['Nebraska', 'Missouri', 'Oklahoma', 'Colorado'],
  'Kentucky': ['Indiana', 'Ohio', 'West Virginia', 'Virginia', 'Tennessee', 'Missouri', 'Illinois'],
  'Louisiana': ['Texas', 'Arkansas', 'Mississippi'],
  'Maine': ['New Hampshire'],
  'Maryland': ['Pennsylvania', 'Delaware', 'Virginia', 'West Virginia'],
  'Massachusetts': ['Rhode Island', 'Connecticut', 'New York', 'New Hampshire', 'Vermont'],
  'Michigan': ['Wisconsin', 'Indiana', 'Ohio'],
  'Minnesota': ['Wisconsin', 'Iowa', 'South Dakota', 'North Dakota'],
  'Mississippi': ['Louisiana', 'Arkansas', 'Tennessee', 'Alabama'],
  'Missouri': ['Iowa', 'Illinois', 'Kentucky', 'Tennessee', 'Arkansas', 'Oklahoma', 'Kansas', 'Nebraska'],
  'Montana': ['Idaho', 'Wyoming', 'South Dakota', 'North Dakota'],
  'Nebraska': ['South Dakota', 'Iowa', 'Missouri', 'Kansas', 'Colorado', 'Wyoming'],
  'Nevada': ['Oregon', 'Idaho', 'Utah', 'Arizona', 'California'],
  'New Hampshire': ['Maine', 'Massachusetts', 'Vermont'],
  'New Jersey': ['New York', 'Pennsylvania', 'Delaware'],
  'New Mexico': ['Arizona', 'Utah', 'Colorado', 'Oklahoma', 'Texas'],
  'New York': ['Vermont', 'Massachusetts', 'Connecticut', 'New Jersey', 'Pennsylvania'],
  'North Carolina': ['Virginia', 'Tennessee', 'Georgia', 'South Carolina'],
  'North Dakota': ['Minnesota', 'South Dakota', 'Montana'],
  'Ohio': ['Michigan', 'Pennsylvania', 'West Virginia', 'Kentucky', 'Indiana'],
  'Oklahoma': ['Kansas', 'Missouri', 'Arkansas', 'Texas', 'New Mexico', 'Colorado'],
  'Oregon': ['Washington', 'Idaho', 'Nevada', 'California'],
  'Pennsylvania': ['New York', 'New Jersey', 'Delaware', 'Maryland', 'West Virginia', 'Ohio'],
  'Rhode Island': ['Connecticut', 'Massachusetts'],
  'South Carolina': ['North Carolina', 'Georgia'],
  'South Dakota': ['North Dakota', 'Minnesota', 'Iowa', 'Nebraska', 'Wyoming', 'Montana'],
  'Tennessee': ['Kentucky', 'Virginia', 'North Carolina', 'Georgia', 'Alabama', 'Mississippi', 'Arkansas', 'Missouri'],
  'Texas': ['New Mexico', 'Oklahoma', 'Arkansas', 'Louisiana'],
  'Utah': ['Idaho', 'Wyoming', 'Colorado', 'New Mexico', 'Arizona', 'Nevada'],
  'Vermont': ['New Hampshire', 'Massachusetts', 'New York'],
  'Virginia': ['Maryland', 'West Virginia', 'Kentucky', 'Tennessee', 'North Carolina'],
  'Washington': ['Idaho', 'Oregon'],
  'West Virginia': ['Pennsylvania', 'Maryland', 'Virginia', 'Kentucky', 'Ohio'],
  'Wisconsin': ['Michigan', 'Minnesota', 'Iowa', 'Illinois'],
  'Wyoming': ['Montana', 'South Dakota', 'Nebraska', 'Colorado', 'Utah', 'Idaho']
};

const SearchPage = () => {
  // Map state
  const [showMap, setShowMap] = useState(true);
  
  // Sidebar state
  const [showSidebar, setShowSidebar] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(2); // Default to housing question

  // Hyperspeed effect state
  const [showHyperspeed, setShowHyperspeed] = useState(true);
  const [hyperspeedSpeed, setHyperspeedSpeed] = useState(1);
  const [fadeOut, setFadeOut] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const pressTimer = useRef(null);
  const holdStartTime = useRef(null);
  // Performance-related state
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const hyperspeedInstanceCount = useRef(0);
  
  // Marketing message variations
  const marketingMessages = [
    {
      title: "Explore Housing Insights",
      description: "Compare prices, trends and market statistics across cities and property types",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: "Analyze Crime Statistics",
      description: "Discover crime patterns and safety metrics for states and cities over time",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Cross-Reference Multiple Datasets",
      description: "See how housing prices, crime rates, and job markets interconnect",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];
  
  // Set active marketing message (cycling through them)
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  
  // Cycle through messages every few seconds
  useEffect(() => {
    if (showHyperspeed) {
      const interval = setInterval(() => {
        setActiveMessageIndex(prev => (prev + 1) % marketingMessages.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [showHyperspeed, marketingMessages.length]);

  // Detect low performance devices
  useEffect(() => {
    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Check if low memory (this is an approximation)
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    // Check if low CPU cores
    const isLowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

    // Set low performance mode if any conditions match
    if (isMobile || isLowMemory || isLowCPU) {
      setIsLowPerformanceMode(true);
    }
    
    // Cleanup any resources when component unmounts
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
        clearInterval(pressTimer.current);
      }
    };
  }, []);

  // Handle mouse down on hyperspeed to start accelerating
  const handleMouseDown = () => {
    holdStartTime.current = Date.now();
    pressTimer.current = setTimeout(() => {
      setIsHolding(true);
      // Start the hold sequence, with 8 second total time
      const intervalId = setInterval(() => {
        const elapsedTime = (Date.now() - holdStartTime.current) / 1000;
        
        if (elapsedTime >= 3) {
          // Start showing countdown when we're in the last 5 seconds
          setCountdown(Math.max(Math.ceil(8 - elapsedTime), 0));
        }
        
        // Accelerate speed based on held time
        setHyperspeedSpeed(1 + (elapsedTime / 8) * 4);

        if (elapsedTime >= 8) {
          // Time's up - fade out
          clearInterval(intervalId);
          setFadeOut(true);
          setTimeout(() => {
            setShowHyperspeed(false);
            // Unmount component after fade out to free resources
            setTimeout(() => setIsComponentMounted(false), 100);
          }, 1500);
        }
      }, 100);
      
      // Store interval ID in ref to clean up later
      pressTimer.current = intervalId;
    }, 200); // Short delay to distinguish between click and hold
  };
  
  // Handle mouse up on hyperspeed
  const handleMouseUp = () => {
    const wasHolding = isHolding;
    
    // Clear the timer and holding state
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      clearInterval(pressTimer.current);
      pressTimer.current = null;
    }
    
    setIsHolding(false);
    
    // If it was a quick click (not holding), just fade out
    if (!wasHolding && holdStartTime.current && (Date.now() - holdStartTime.current < 200)) {
      setFadeOut(true);
      setTimeout(() => {
        setShowHyperspeed(false);
        // Unmount component after fade out to free resources
        setTimeout(() => setIsComponentMounted(false), 100);
      }, 1500);
    }
    
    holdStartTime.current = null;
  };
  
  // Reset hyperspeed effect
  const resetHyperspeed = () => {
    // Track number of instances to prevent memory leaks
    hyperspeedInstanceCount.current += 1;
    if (hyperspeedInstanceCount.current > 5) {
      // Force page refresh if too many instances to prevent memory issues
      window.location.reload();
      return;
    }
    
    setIsComponentMounted(true);
    setShowHyperspeed(true);
    setHyperspeedSpeed(1);
    setFadeOut(false);
    setCountdown(null);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      clearInterval(pressTimer.current);
      pressTimer.current = null;
    }
  };

  // Render the appropriate question component based on selectedQuestion
  const renderQuestionComponent = () => {
    switch (selectedQuestion) {
      case 1:
        return <CrimeQuestion />;
      case 2:
        return <HousingQuestion showMap={showMap} setShowMap={setShowMap} />;
      case 3:
        return <StateHousePrices showMap={showMap} setShowMap={setShowMap} />;
      default:
        // For other question types, use the generic component
        const questionData = dataQuestions.find(q => q.id === selectedQuestion);
        return <GenericQuestion questionData={questionData} />;
    }
  };

  return (
    <div className="min-h-screen bg-eerie-black relative">
      {/* Main Content */}
      <div className={`transition-all duration-300 ${showSidebar && isPinned ? 'ml-[350px]' : 'ml-0'} ${showHyperspeed ? 'blur-lg' : 'blur-0'} transition-all duration-1000`}>
        {/* Sidebar Component */}
        <Sidebar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          isPinned={isPinned}
          setIsPinned={setIsPinned}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
        
        {/* Top Search Bar */}
        <div className="sticky top-0 z-30 bg-eerie-black/90 border-b border-mint/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            {/* Search Header */}
            <h1 className="text-3xl font-bold text-white mb-4">
              {dataQuestions.find(q => q.id === selectedQuestion)?.title || "Data Explorer"}
            </h1>
            <p className="text-lg text-white/80 mb-6">
              {dataQuestions.find(q => q.id === selectedQuestion)?.description || "Explore data across multiple dimensions"}
            </p>
            
            {/* Dynamic Question Component */}
            {renderQuestionComponent()}
          </div>
        </div>
      </div>
      
      {/* Marketing Messages (visible during hyperspeed) */}
      <AnimatePresence>
        {showHyperspeed && (
          <motion.div 
            className="fixed inset-0 flex mb-[150px] items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-lg w-full text-center">
              <AnimatePresence mode="wait">
              <motion.div 
                  key={activeMessageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <h2 className="text-2xl font-bold text-mint mb-2">
                    {marketingMessages[activeMessageIndex].title}
                  </h2>
                  <p className="text-white/90 text-lg">
                    {marketingMessages[activeMessageIndex].description}
                  </p>
              </motion.div>
              </AnimatePresence>
              
              {/* Message Indicators */}
              <div className="flex justify-center space-x-2 mt-4">
                {marketingMessages.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full ${index === activeMessageIndex ? 'w-8 bg-mint' : 'w-2 bg-white/30'}`}
                    animate={index === activeMessageIndex ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hyperspeed Effect (Overlay) */}
      <AnimatePresence>
        {showHyperspeed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: fadeOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 cursor-pointer flex items-center justify-center select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
                >
            <HyperspeedContainer speed={hyperspeedSpeed}>
              {isComponentMounted && (
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-mint text-2xl">Loading starfield...</div>
                  </div>
                }>
                  {/* Use simplified version for low-performance devices */}
                  <Hyperspeed 
                    speed={hyperspeedSpeed} 
                    // Pass reduced particle count for low performance devices
                    effectOptions={isLowPerformanceMode ? {
                      lightPairsPerRoadWay: 20, // Reduced from 40
                      totalSideLightSticks: 10, // Reduced from 20 
                      carLightsLength: [400 * 0.03, 400 * 0.1], // Reduced from [400 * 0.03, 400 * 0.2]
                      shoulderLinesWidthPercentage: 0.03, // Reduced from 0.05
                    } : undefined}
                        />
                </Suspense>
              )}
              
              {/* Instruction Text */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 
                  text-white text-opacity-80 text-center pointer-events-none">
                {countdown !== null ? (
                    <motion.div
                    key="countdown"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: 0 }}
                    className="text-6xl font-bold"
                  >
                    {countdown}
                  </motion.div>
                ) : (
                  <motion.p 
                    key="instruction"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
                    className="text-2xl font-light tracking-widest"
                  >
                    {isHolding ? "HOLD TO ACCELERATE" : "TAP TO SKIP • HOLD TO ACCELERATE"}
                  </motion.p>
                )}
              </div>
            </HyperspeedContainer>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Restart Hyperspeed Button (when hidden) */}
      {!showHyperspeed && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 z-40 px-4 py-2 bg-mint text-eerie-black rounded-md font-medium flex items-center"
          onClick={resetHyperspeed}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Hyperspeed
        </motion.button>
      )}
    </div>
  );
};

const HyperspeedContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  
  #lights {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    transition: all 0.5s ease-out;
    filter: ${props => `brightness(${Math.min(1 + props.speed * 0.2, 2)})`};
    
    .star {
      transition: all 0.3s ease-out;
      animation-duration: ${props => `${1.5 / props.speed}s`} !important;
    }
  }
`;

export default SearchPage;
