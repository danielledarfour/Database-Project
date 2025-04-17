import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import USAMap from "../components/USAMap";

// Note: React Router warnings about future changes in v7 can be safely ignored for now
// They're just letting us know about upcoming changes in React Router v7
// When upgrading to React Router v7, we'll need to update our code accordingly

const MapVisualization = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [dataType, setDataType] = useState("crime");
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState("2023");
  const [stateData, setStateData] = useState({});

  // Note about Google Maps API key
  const hasApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY !== undefined;

  // Fetch state data when component mounts or when filters change
  useEffect(() => {
    fetchStateData();
  }, [dataType, timeframe]);

  // TODO: Replace with actual API call
  const fetchStateData = async () => {
    setLoading(true);
    try {
      // TODO: Implement API fetch for state data
      const serverBaseUrl =
        import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

      // TODO: Uncomment and implement once backend is ready
      // let endpoint = dataType === 'crime' ? 'crime-data' : 'employment-data';
      // const response = await fetch(`${serverBaseUrl}/api/${endpoint}/by-state?year=${year}`);
      // const data = await response.json();
      // setStateData(data);

      // Temporary empty placeholder data
      setStateData({
        California: {
          crimeRate: 0,
          employmentRate: 0,
          topCrimes: [],
          topJobs: [],
        },
        Texas: {
          crimeRate: 0,
          employmentRate: 0,
          topCrimes: [],
          topJobs: [],
        },
        "New York": {
          crimeRate: 0,
          employmentRate: 0,
          topCrimes: [],
          topJobs: [],
        },
        Florida: {
          crimeRate: 0,
          employmentRate: 0,
          topCrimes: [],
          topJobs: [],
        },
      });

      setTimeout(() => setLoading(false), 500); // Simulate API delay
    } catch (error) {
      console.error("Error fetching state data:", error);
      setLoading(false);
    }
  };

  // Handle state click - Moved to USAMap component
  const handleStateSelection = async (state) => {
    setLoading(true);
    try {
      // TODO: Implement API fetch for detailed state data
      // const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
      // const response = await fetch(`${serverBaseUrl}/api/state-details/${state}?year=${year}&dataType=${dataType}`);
      // const detailedData = await response.json();

      setSelectedState(state);
    } catch (error) {
      console.error(`Error fetching details for ${state}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Change data type (crime or employment)
  const handleDataTypeChange = (type) => {
    setDataType(type);
    // Data will be fetched in useEffect when dataType changes
  };

  return (
    <div className="py-8 md:py-12 bg-eerie-black">
      <div className="container-custom mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="bg-hunter-green py-4 px-6 rounded-lg shadow-md mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              USA Data Map
            </h1>
            <p className="text-gray-200 text-sm mt-1">
              Explore crime rates and employment statistics across the United
              States
            </p>
          </div>

          <p className="text-gray-300 max-w-3xl mb-4">
            Select a data type and timeframe, then click on any state to view
            detailed information.
          </p>
        </motion.div>

        {!hasApiKey && (
          <div className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-300">
                  Google Maps API key not detected. Please add your API key to
                  the{" "}
                  <code className="font-mono bg-red-900/30 px-1 rounded">
                    .env
                  </code>{" "}
                  file as{" "}
                  <code className="font-mono bg-red-900/30 px-1 rounded">
                    VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
                  </code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Control Panel */}
        <div className="bg-eerie-black rounded-lg shadow-md border border-gray-800 p-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="data-type"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Data Type
              </label>
              <select
                id="data-type"
                value={dataType}
                onChange={(e) => handleDataTypeChange(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 focus:border-mint focus:outline-none focus:ring-mint sm:text-sm"
              >
                <option value="crime">Crime Rate</option>
                <option value="employment">Employment Rate</option>
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="timeframe"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Timeframe
              </label>
              <select
                id="timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 focus:border-mint focus:outline-none focus:ring-mint sm:text-sm"
              >
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Region
              </label>
              <select
                id="region"
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 focus:border-mint focus:outline-none focus:ring-mint sm:text-sm"
              >
                <option value="all">All Regions</option>
                <option value="northeast">Northeast</option>
                <option value="midwest">Midwest</option>
                <option value="south">South</option>
                <option value="west">West</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Map Display - Full Width */}
        <div className="bg-eerie-black rounded-lg shadow-md border border-gray-800 p-4 mb-6">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-800">
            <h2 className="text-lg font-medium text-gray-100">
              United States {dataType === "crime" ? "Crime" : "Employment"} Map
            </h2>
            {selectedState && (
              <div className="bg-gray-800 py-1 px-3 rounded-full text-sm font-medium text-mint">
                Selected: {selectedState}
              </div>
            )}
          </div>

          <USAMap
            setSelectedState={setSelectedState}
            dataType={dataType}
            loading={loading}
          />
        </div>

        {/* State Details - Now below the map */}
        {selectedState && (
          <div className="bg-eerie-black rounded-lg shadow-md border border-gray-800 p-5 mb-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
              <div>
                <h2 className="text-lg font-semibold text-gray-100">
                  {selectedState} Details
                </h2>
                <p className="text-sm text-gray-400">{timeframe} Data</p>
              </div>
              <button
                onClick={() => setSelectedState(null)}
                className="text-gray-500 hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* State data display in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-md font-medium text-mint mb-3 pb-1 border-b border-gray-800">
                  {dataType === "crime"
                    ? "Crime Statistics"
                    : "Employment Statistics"}
                </h3>
                <div className="space-y-4">
                  {dataType === "crime" ? (
                    <>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">
                          Violent Crime Rate
                        </h4>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div
                              className="bg-red-500 h-2.5 rounded-full"
                              style={{ width: "45%" }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-300">
                            45%
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">
                          Property Crime Rate
                        </h4>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div
                              className="bg-red-500 h-2.5 rounded-full"
                              style={{ width: "72%" }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-300">
                            72%
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">
                          Employment Rate
                        </h4>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div
                              className="bg-green-500 h-2.5 rounded-full"
                              style={{ width: "67%" }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-300">
                            67%
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">
                          Job Growth
                        </h4>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div
                              className="bg-green-500 h-2.5 rounded-full"
                              style={{ width: "23%" }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-300">
                            23%
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-mint mb-3 pb-1 border-b border-gray-800">
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-eerie-black p-4 rounded-lg border border-gray-800">
                    <p className="text-sm text-gray-400 mb-1">
                      {dataType === "crime"
                        ? "Total Incidents"
                        : "Total Workforce"}
                    </p>
                    <p className="text-xl font-semibold text-white">
                      {dataType === "crime"
                        ? Math.floor(Math.random() * 10000).toLocaleString()
                        : Math.floor(Math.random() * 5000000).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-eerie-black p-4 rounded-lg border border-gray-800">
                    <p className="text-sm text-gray-400 mb-1">
                      {dataType === "crime" ? "Cost Impact" : "Average Salary"}
                    </p>
                    <p className="text-xl font-semibold text-white">
                      $
                      {dataType === "crime"
                        ? Math.floor(Math.random() * 10000000).toLocaleString()
                        : Math.floor(
                            Math.random() * 80000 + 30000
                          ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-mint mb-3 pb-1 border-b border-gray-800">
                  Historical Trends
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">
                      Year-over-Year Change
                    </h4>
                    <div className="flex items-center text-sm">
                      <span className="text-green-400 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                            clipRule="evenodd"
                          />
                        </svg>
                        3.2% improvement from previous year
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">
                      5-Year Trend
                    </h4>
                    <div className="bg-eerie-black p-2 rounded-md flex justify-between border border-gray-800">
                      {[2019, 2020, 2021, 2022, 2023].map((year) => (
                        <div key={year} className="text-center">
                          <div
                            className={`mx-auto w-2 ${
                              dataType === "crime"
                                ? "bg-red-400"
                                : "bg-green-400"
                            } rounded-t-sm`}
                            style={{ height: `${Math.random() * 40 + 10}px` }}
                          ></div>
                          <div className="text-xs text-gray-400 mt-1">
                            {year}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Insights Section */}
        <div className="bg-eerie-black rounded-lg shadow-md border border-gray-800 p-5">
          <div className="flex items-center mb-4 pb-2 border-b border-gray-800">
            <div className="bg-hunter-green h-6 w-1 rounded mr-2"></div>
            <h2 className="text-lg font-medium text-white">Key Insights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-eerie-black rounded-lg p-4 border border-gray-800">
              <h3 className="text-md font-medium text-mint mb-2 pb-1 border-b border-gray-800">
                {dataType === "crime"
                  ? "Highest Crime Rates"
                  : "Highest Employment"}
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-gray-300">New Mexico</span>
                  <span className="font-medium text-white">
                    {dataType === "crime" ? "XX.XX%" : "XX.XX%"}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-300">Louisiana</span>
                  <span className="font-medium text-white">
                    {dataType === "crime" ? "XX.XX%" : "XX.XX%"}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-300">Nevada</span>
                  <span className="font-medium text-white">
                    {dataType === "crime" ? "XX.XX%" : "XX.XX%"}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-eerie-black rounded-lg p-4 border border-gray-800">
              <h3 className="text-md font-medium text-mint mb-2 pb-1 border-b border-gray-800">
                {dataType === "crime"
                  ? "Lowest Crime Rates"
                  : "Lowest Employment"}
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-gray-300">Maine</span>
                  <span className="font-medium text-white">
                    {dataType === "crime" ? "XX.XX%" : "XX.XX%"}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-300">New Hampshire</span>
                  <span className="font-medium text-white">
                    {dataType === "crime" ? "XX.XX%" : "XX.XX%"}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-300">Vermont</span>
                  <span className="font-medium text-white">
                    {dataType === "crime" ? "XX.XX%" : "XX.XX%"}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-eerie-black rounded-lg p-4 border border-gray-800">
              <h3 className="text-md font-medium text-mint mb-2 pb-1 border-b border-gray-800">
                National Average
              </h3>
              <div className="flex flex-col justify-center h-full">
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">
                      {dataType === "crime" ? "Crime Rate" : "Employment Rate"}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {dataType === "crime" ? "XX.XX%" : "XX.XX%"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        dataType === "crime" ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{
                        width: dataType === "crime" ? "XX.XX%" : "XX.XX%",
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">
                      Year-over-Year Change
                    </span>
                    <span className="text-sm font-medium text-white">
                      {dataType === "crime" ? "XX.XX%" : "XX.XX%"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        dataType === "crime" ? "bg-green-500" : "bg-green-500"
                      }`}
                      style={{
                        width: dataType === "crime" ? "XX.XX%" : "XX.XX%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapVisualization;
