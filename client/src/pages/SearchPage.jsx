import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../ui/Input";
import Hyperspeed from "../ui/Hyperspeed";
import styled from "styled-components";

// the component will fill the height/width of its parent container, edit the CSS to change this
// the options below are the default values

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [yearRange, setYearRange] = useState([2010, 2023]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hyperSpeedActive, setHyperSpeedActive] = useState(true);
  const [hyperSpeedAccelerated, setHyperSpeedAccelerated] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const hyperspeedOptions = useRef({
    onSpeedUp: () => {
      setHyperSpeedAccelerated(true);
      setTimeout(() => {
        setContentVisible(true);
        setTimeout(() => {
          setHyperSpeedActive(false);
        }, 1000); // Keep hyperspeed visible briefly while content fades in
      }, 1500); // Delay before content appears
    },
    onSlowDown: () => {},
    distortion: "turbulentDistortion",
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0xffffff,
      brokenLines: 0xffffff,
      leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
      rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
      sticks: 0x03b3c3,
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockResults = generateMockResults(
        searchTerm,
        filterType,
        yearRange
      );
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };

  const generateMockResults = (term, type, years) => {
    // Mock data generation based on search parameters
    const results = [];
    const types = type === "all" ? ["crime", "employment"] : [type];

    for (let i = 0; i < 5; i++) {
      for (const dataType of types) {
        const year =
          Math.floor(Math.random() * (years[1] - years[0] + 1)) + years[0];

        if (dataType === "crime") {
          results.push({
            id: `crime-${i}`,
            type: "crime",
            title: `${term ? term + " related " : ""}Crime Statistics ${year}`,
            description: `Comprehensive crime data analysis from ${year} showing trends across multiple states.`,
            states: ["California", "Texas", "New York"].slice(
              0,
              Math.floor(Math.random() * 3) + 1
            ),
            year,
            metrics: {
              violentCrime: Math.floor(Math.random() * 1000),
              propertyCrime: Math.floor(Math.random() * 5000),
              arrests: Math.floor(Math.random() * 800),
            },
          });
        } else {
          results.push({
            id: `emp-${i}`,
            type: "employment",
            title: `${term ? term + " sector " : ""}Employment Data ${year}`,
            description: `Detailed employment statistics from ${year} analyzing job growth and workforce trends.`,
            states: ["Florida", "Michigan", "Washington"].slice(
              0,
              Math.floor(Math.random() * 3) + 1
            ),
            year,
            metrics: {
              employmentRate: (Math.random() * 10 + 90).toFixed(1) + "%",
              newJobs: Math.floor(Math.random() * 50000),
              averageSalary: "$" + (Math.floor(Math.random() * 50) + 50) + "k",
            },
          });
        }
      }
    }

    return results;
  };

  // Update year range handler
  const handleYearChange = (e, index) => {
    const newYearRange = [...yearRange];
    newYearRange[index] = parseInt(e.target.value);
    setYearRange(newYearRange);
  };

  return (
    <div className="min-h-screen bg-eerie-black relative">
      {/* Hyperspeed Overlay */}
      <AnimatePresence>
        {hyperSpeedActive && (
          <motion.div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <HyperspeedContainer>
              <Hyperspeed effectOptions={hyperspeedOptions.current} />
              
              <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center z-10"
                initial={{ opacity: 1 }}
                animate={{ opacity: hyperSpeedAccelerated ? 0 : 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold text-white mb-8 text-center"
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: hyperSpeedAccelerated ? 1.5 : 1,
                    opacity: hyperSpeedAccelerated ? 0 : 1
                  }}
                  transition={{ duration: 0.8 }}
                >
                  Search our Dataset
                </motion.h1>
                <motion.p 
                  className="text-xl text-white/80 text-center px-4 max-w-2xl"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: hyperSpeedAccelerated ? 0 : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Click anywhere to explore our data
                </motion.p>
              </motion.div>
              
              <div 
                className="absolute inset-0 cursor-pointer z-20"
                onClick={() => hyperspeedOptions.current.onSpeedUp()}
              />
            </HyperspeedContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {contentVisible && (
          <motion.div 
            className="pb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Search Header */}
            <div className="bg-cambridge-blue text-white py-20 px-4 relative">
              <div className="container mx-auto text-center">
                <motion.h1
                  className="text-4xl font-bold mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Search Data Insights
                </motion.h1>
                <motion.p
                  className="text-lg max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Explore our comprehensive database of crime and employment statistics
                </motion.p>
              </div>
            </div>

            {/* Search Form */}
            <div className="container mx-auto px-4 py-8 relative z-10">
              <motion.div
                className="backdrop-blur-md bg-eerie-black/70 p-6 rounded-lg shadow-lg border border-white/20 max-w-4xl mx-auto -mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <form onSubmit={handleSearch}>
                  {/* Search Box New */}

                  <div className="mb-6">
                    <label
                      htmlFor="search"
                      className="block text-sm font-medium text-white mb-1"
                    >
                      Search Term
                    </label>
                    <Input />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-eerie-black/50 backdrop-blur-sm p-4 rounded-md">
                      <label className="block text-sm font-medium text-white mb-2">
                        Data Type
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="filterType"
                            value="all"
                            checked={filterType === "all"}
                            onChange={() => setFilterType("all")}
                            className="text-mint focus:ring-mint h-4 w-4"
                          />
                          <span className="ml-2 text-white">All Data</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="filterType"
                            value="crime"
                            checked={filterType === "crime"}
                            onChange={() => setFilterType("crime")}
                            className="text-mint focus:ring-mint h-4 w-4"
                          />
                          <span className="ml-2 text-white">Crime</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="filterType"
                            value="employment"
                            checked={filterType === "employment"}
                            onChange={() => setFilterType("employment")}
                            className="text-mint focus:ring-mint h-4 w-4"
                          />
                          <span className="ml-2 text-white">Employment</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-eerie-black/50 backdrop-blur-sm p-4 rounded-md">
                      <label className="block text-sm font-medium text-white mb-2">
                        Year Range: {yearRange[0]} - {yearRange[1]}
                      </label>
                      <div className="px-1 py-4">
                        <input
                          type="range"
                          min="2010"
                          max="2023"
                          value={yearRange[0]}
                          onChange={(e) =>
                            setYearRange([parseInt(e.target.value), yearRange[1]])
                          }
                          className="w-full accent-mint"
                        />
                        <input
                          type="range"
                          min="2010"
                          max="2023"
                          value={yearRange[1]}
                          onChange={(e) =>
                            setYearRange([yearRange[0], parseInt(e.target.value)])
                          }
                          className="w-full accent-mint"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
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
                        Processing...
                      </>
                    ) : (
                      "Search Data"
                    )}
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-eerie-black mb-6">
                  Search Results ({searchResults.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((result) => (
                    <motion.div
                      key={result.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`p-1 ${
                          result.type === "crime"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-eerie-black">
                            {result.title}
                          </h3>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              result.type === "crime"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {result.type === "crime" ? "Crime" : "Employment"}
                          </span>
                        </div>
                        <p className="text-eerie-black/70 text-sm mb-3">
                          {result.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {result.states.map((state) => (
                            <span
                              key={state}
                              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                            >
                              {state}
                            </span>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <h4 className="text-sm font-medium text-eerie-black mb-2">
                            Key Metrics:
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(result.metrics).map(([key, value]) => (
                              <div key={key} className="flex flex-col">
                                <span className="text-eerie-black/70 capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span className="font-medium text-eerie-black">
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Link
                          to={`/dataset/${result.id}`}
                          className="mt-4 text-sm font-medium text-mint hover:text-mint/80 inline-block"
                        >
                          View Full Dataset →
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HyperspeedContainer = styled.div`
  position: absolute;
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
  }
`;

export default SearchPage;
