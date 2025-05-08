import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

// Data questions from routes.js
const dataQuestions = [
  {
    id: 1,
    title: "Top Crime Cities",
    description: "Top 5 cities with highest crime incidents for a given state and year",
    endpoint: "/crime/:state/:year",
    inputs: ["state", "year"],
    route: "/crime"
  },
  {
    id: 2,
    title: "Housing Price Analysis",
    description: "Median sale price, list price, and price difference for a location and property type",
    endpoint: "/housing/:state/:city/:propertyType",
    inputs: ["state", "city", "propertyType"],
    route: "/housing"
  },
  {
    id: 3,
    title: "State Housing Market",
    description: "Average sale prices and homes sold per property type across cities in a state",
    endpoint: "/state/:state",
    inputs: ["state"],
    route: "/state"
  },
  {
    id: 4,
    title: "Housing Metrics Over Time",
    description: "Housing metrics across a year range for a given state",
    endpoint: "/housing/:state/:startYear/:endYear",
    inputs: ["state", "startYear", "endYear"],
    route: "/housing"
  },
  {
    id: 5,
    title: "Average Wages by Occupation",
    description: "Average wages for occupations in a state for a given year",
    endpoint: "/state/:state/:year",
    inputs: ["state", "year"],
    route: "/state"
  },
  {
    id: 6,
    title: "Crime Trends",
    description: "How crime incidents changed over time in a state",
    endpoint: "/five-years/:state",
    inputs: ["state"],
    route: "/five-years"
  },
  {
    id: 7,
    title: "Housing Affordability",
    description: "Affordability metrics across all states",
    endpoint: "/housing/affordability",
    inputs: [],
    route: "/housing/affordability"
  },
  {
    id: 8,
    title: "Workforce Analysis",
    description: "Occupations meeting specific workforce and wage criteria",
    endpoint: "/job/:pctWorkforce/:pctWage",
    inputs: ["pctWorkforce", "pctWage"],
    route: "/job"
  },
  {
    id: 9,
    title: "Top Occupations",
    description: "Top occupations by workforce percentage in a state",
    endpoint: "/job/:state",
    inputs: ["state"],
    route: "/job"
  },
  {
    id: 10,
    title: "Top Cities by Property Type",
    description: "Top cities by housing price for a specific property type in a state",
    endpoint: "/housing/:state/:propertyType",
    inputs: ["state", "propertyType"],
    route: "/housing"
  },
  {
    id: 11,
    title: "Top Single-Family Home Cities",
    description: "Top 20 most expensive cities for Single-Family Residential homes in a state",
    endpoint: "/housing/:state",
    inputs: ["state"],
    route: "/housing"
  }
];

const Sidebar = ({ 
  showSidebar, 
  setShowSidebar, 
  selectedQuestion, 
  setSelectedQuestion 
}) => {
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Handle clicking outside sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) && 
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setShowSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowSidebar]);

  // Handle window resize to ensure sidebar adapts to viewport height
  useEffect(() => {
    const handleResize = () => {
      if (sidebarRef.current) {
        // Ensure the sidebar adapts to the viewport height
        sidebarRef.current.style.maxHeight = `${window.innerHeight}px`;
      }
    };

    handleResize(); // Initialize on mount
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showSidebar]);

  return (
    <SidebarWrapper>
      {/* Sidebar Toggle Button - Fixed position at top */}
      <motion.button
        ref={toggleButtonRef}
        className="fixed left-0 top-4 z-50 bg-mint/90 text-eerie-black p-2.5 rounded-r-lg shadow-lg backdrop-blur-sm hover:bg-mint transition-all duration-300"
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {showSidebar ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          )}
        </svg>
      </motion.button>

      {/* Questions Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            ref={sidebarRef}
            className="fixed left-0 top-0 bottom-0 w-[320px] bg-eerie-black/95 border-r border-mint/30 backdrop-blur-lg z-40 flex flex-col shadow-xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Sidebar Header */}
            <div className="flex justify-between items-center px-4 py-5 border-b border-mint/20 bg-eerie-black/80 backdrop-blur-md">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-mint mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-mint text-xl font-bold">Data Explorer</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button 
                  className="text-mint p-1.5 rounded-md border border-mint/30 hover:bg-mint/10 transition-all duration-300"
                  onClick={() => setShowSidebar(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-3">
                <div className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-3 px-2">
                  Available Questions
                </div>

                <div className="space-y-2">
                  {dataQuestions.map((question) => (
                    <motion.button
                      key={question.id}
                      className={`w-full text-left p-3.5 rounded-lg transition-all duration-200 ${
                        selectedQuestion === question.id 
                          ? 'bg-mint text-eerie-black ring-2 ring-mint ring-opacity-50' 
                          : 'bg-eerie-black/50 text-white hover:bg-eerie-black/80 border border-mint/20 hover:border-mint/40'
                      }`}
                      onClick={() => {
                        setSelectedQuestion(question.id);
                        setShowSidebar(false);
                      }}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 className="font-medium text-base">{question.title}</h3>
                      <p className={`text-sm mt-1 ${selectedQuestion === question.id ? 'text-eerie-black/80' : 'text-white/70'}`}>
                        {question.description}
                      </p>
                      <div className={`text-xs mt-2 font-mono px-2 py-1 rounded-md inline-block ${
                        selectedQuestion === question.id 
                          ? 'bg-eerie-black/20 text-eerie-black/80' 
                          : 'bg-eerie-black/60 text-mint/70'
                      }`}>
                        {question.endpoint}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="border-t border-mint/20 p-3 bg-eerie-black/80 backdrop-blur-md">
              <div className="flex items-center justify-between text-white/60 text-xs px-2">
                <span>Data Explorer v1.0</span>
                <a href="#" className="text-mint hover:underline">Documentation</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarWrapper>
  );
};

// Styled component for custom scrollbar and global sidebar styles
const SidebarWrapper = styled.div`
  .custom-scrollbar {
    /* For Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(122, 220, 180, 0.4);
      border-radius: 3px;
      transition: all 0.3s ease;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: rgba(122, 220, 180, 0.7);
    }
    
    /* For Firefox */
    scrollbar-width: thin;
    scrollbar-color: rgba(122, 220, 180, 0.4) rgba(0, 0, 0, 0.1);
  }
`;

// Export both the component and the data for reusability
export { dataQuestions };
export default Sidebar; 