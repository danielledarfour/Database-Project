import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    id: 6,
    title: "Crime Trends",
    description: "How crime incidents changed over time in a state",
    endpoint: "/crime/:state",
    inputs: ["state"],
    route: "/crime"
  },
  {
    id: 7,
    title: "City Metrics Over Time",
    description: "Job wages, crime incidents, and housing prices over time for a location",
    endpoint: "/city/:state/:city/:startYear/:endYear",
    inputs: ["state", "city", "startYear", "endYear"],
    route: "/city"
  }
];

const Sidebar = ({ 
  showSidebar, 
  setShowSidebar, 
  isPinned, 
  setIsPinned, 
  selectedQuestion, 
  setSelectedQuestion 
}) => {
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Handle clicking outside sidebar to close it if not pinned
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) && 
        !isPinned &&
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
  }, [isPinned, setShowSidebar]);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <motion.button
        ref={toggleButtonRef}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-mint text-eerie-black p-2 rounded-r-md z-50"
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {showSidebar ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          )}
        </svg>
      </motion.button>

      {/* Questions Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            ref={sidebarRef}
            className="fixed left-0 top-0 h-full bg-eerie-black/95 border-r border-mint/30 backdrop-blur-md z-40 overflow-y-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: "350px" }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6 border-b border-mint/20 pb-4">
                <h2 className="text-mint text-xl font-bold">Data Questions</h2>
                <div className="flex items-center gap-2">
                  <button 
                    className={`p-1.5 rounded-md ${isPinned ? 'bg-mint text-eerie-black' : 'text-mint border border-mint/30'}`}
                    onClick={() => setIsPinned(!isPinned)}
                    title={isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                  <button 
                    className="text-mint p-1.5 rounded-md border border-mint/30 hover:bg-mint/10"
                    onClick={() => setShowSidebar(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {dataQuestions.map((question) => (
                  <motion.button
                    key={question.id}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedQuestion === question.id 
                        ? 'bg-mint text-eerie-black' 
                        : 'bg-eerie-black/50 text-white hover:bg-eerie-black/80 border border-mint/20'
                    }`}
                    onClick={() => {
                      setSelectedQuestion(question.id);
                      if (!isPinned) {
                        setShowSidebar(false);
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="font-medium">{question.title}</h3>
                    <p className={`text-sm mt-1 ${selectedQuestion === question.id ? 'text-eerie-black/80' : 'text-white/70'}`}>
                      {question.description}
                    </p>
                    <div className={`text-xs mt-2 font-mono ${selectedQuestion === question.id ? 'text-eerie-black/60' : 'text-mint/50'}`}>
                      {question.endpoint}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Export both the component and the data for reusability
export { dataQuestions };
export default Sidebar; 