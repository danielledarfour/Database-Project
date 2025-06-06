import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useRef,
  useMemo,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../ui/Loader";
import cityData from "../utils/cityData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import useDashboardData from "../hooks/useDashboardData";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Set global chart defaults for modern styling
ChartJS.defaults.font.family = "'Inter', 'Helvetica', 'Arial', sans-serif";
ChartJS.defaults.color = "rgba(255, 255, 255, 0.8)";
ChartJS.defaults.borderColor = "rgba(255, 255, 255, 0.1)";
ChartJS.defaults.elements.bar.borderRadius = 4;
ChartJS.defaults.elements.bar.borderWidth = 0;
ChartJS.defaults.elements.bar.backgroundColor = "rgba(53, 162, 235, 0.7)";
ChartJS.defaults.elements.bar.hoverBackgroundColor = "rgba(53, 162, 235, 0.9)";
ChartJS.defaults.plugins.tooltip.padding = 10;
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
ChartJS.defaults.plugins.tooltip.backgroundColor = "rgba(0, 0, 0, 0.8)";
ChartJS.defaults.plugins.tooltip.titleColor = "rgba(255, 255, 255, 1)";
ChartJS.defaults.plugins.tooltip.bodyColor = "rgba(255, 255, 255, 0.9)";

// Lazy-loaded components for better initial load performance
const KeyMetricsSection = lazy(() =>
  import("../components/dashboard/KeyMetricsSection")
);
const WageAnalysisChart = lazy(() =>
  import("../components/dashboard/WageAnalysisChart")
);
const CrimeDistributionChart = lazy(() =>
  import("../components/dashboard/CrimeDistributionChart")
);
const KeyInsightsSection = lazy(() =>
  import("../components/dashboard/KeyInsightsSection")
);
const TopCrimesByCityChart = lazy(() =>
  import("../components/dashboard/TopCrimesByCityChart")
);
const HousingPriceAnalysisChart = lazy(() =>
  import("../components/dashboard/HousingPriceAnalysisChart")
);
const PopularCitiesChart = lazy(() =>
  import("../components/dashboard/PopularCitiesChart")
);
const PropertyTypeAnalysisChart = lazy(() =>
  import("../components/dashboard/PropertyTypeAnalysisChart")
);

// Reusable loading component
const ChartLoader = ({ height = "16rem" }) => (
  <div className={`flex justify-center items-center`} style={{ height }}>
    <Loader />
  </div>
);

// Define available years and decades
const yearRange = {
  min: 1980,
  max: 2014,
};

// Available years
const availableYears = Array.from(
  { length: yearRange.max - yearRange.min + 1 },
  (_, i) => yearRange.max - i
);

const decades = {
  "1980s": { start: 1980, end: 1989 },
  "1990s": { start: 1990, end: 1999 },
  "2000s": { start: 2000, end: 2009 },
  "2010s": { start: 2010, end: 2014 },
};

// Crime rate and income benchmarks
const PROPERTY_CRIME_BENCHMARKS = {
  high: 3000, // High crime rate threshold
  medium: 2000, // Medium crime rate threshold
  low: 1000, // Low crime rate threshold
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract URL params for initial state
  const urlParams = new URLSearchParams(location.search);
  const initialFilters = {
    state: urlParams.get("state") || "Florida",
    city: urlParams.get("city") || "Miami",
    year: urlParams.get("year") ? parseInt(urlParams.get("year")) : 1981,
    propertyType: urlParams.get("propertyType") || "Single-Family Residential",
  };

  // Use the custom hook for data management
  const {
    filters,
    updateFilter,
    data,
    loadingStates,
    searchData,
    searchError,
  } = useDashboardData(initialFilters);

  // UI state for dropdowns
  const [activeChart, setActiveChart] = useState("crimeRate");
  const [isCityPickerOpen, setIsCityPickerOpen] = useState(false);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

  // Get available cities for the selected state
  const availableCities = useMemo(() => {
    const stateData = cityData[filters.state];
    return stateData ? stateData.cities : [];
  }, [filters.state]);

  const availablePropertyTypes = [
    "Single-Family Residential",
    "Multi-Family Residential",
    "Condo/Co-op",
    "All-Residential",
  ];

  // Sync URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("state", filters.state);
    params.set("year", filters.year.toString());

    if (filters.city) {
      params.set("city", filters.city);
    }

    if (filters.propertyType) {
      params.set("propertyType", filters.propertyType);
    }

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true }
    );
  }, [filters, navigate, location.pathname]);

  // Generate data based on API results
  const generateKeyMetricsData = () => {
    // Initialize with empty values to show loading state
    const metrics = [
      {
        title: "Maximum Incidents Across All Years",
        value: "—",
        change: "—",
        isPositive: true,
      },
      {
        title: "Minimum Incidents Across All Years",
        value: "—",
        change: "—",
        isPositive: true,
      },
      {
        title: "Housing Affordability",
        value: "—",
        change: "—",
        isPositive: false,
      },
    ];
    
    if (data.affordabilityData && data.affordabilityData.length > 0) {
      const stateData = data.affordabilityData.find(
        (d) => d.statename && d.statename.toLowerCase() === filters.state.toLowerCase()
      );

      if (stateData) {
        metrics[2] = {
          title: "Housing Affordability",
          value: stateData.price_to_income_ratio || "—",
          change: parseFloat(stateData.price_to_income_ratio) > 5 ? "High" : "Moderate",
          isPositive: parseFloat(stateData.price_to_income_ratio) <= 5,
        };
      }
    }

    // If we have crime data, update crime rate metrics
    if (data.crimeTrendData && data.crimeTrendData.length >= 2) {
      const sortedData = [...data.crimeTrendData].sort(
        (a, b) => parseInt(a.year) - parseInt(b.year)
      );

      // Calculate average property crime rate across all available years
      if (sortedData.length > 0) {
        // Find minimum incidents across all available years
        const minIncidents = Math.min(
          ...sortedData.map((yearData) => parseInt(yearData.totalincidents || 0))
        );

        // Determine severity level based on benchmarks
        let minSeverityLevel;
        if (minIncidents >= PROPERTY_CRIME_BENCHMARKS.high) {
          minSeverityLevel = "High";
        } else if (minIncidents >= PROPERTY_CRIME_BENCHMARKS.medium) {
          minSeverityLevel = "Medium";
        } else if (minIncidents >= PROPERTY_CRIME_BENCHMARKS.low) {
          minSeverityLevel = "Low";
        } else {
          minSeverityLevel = "Very Low";
        }

        // Update min incidents metric
        metrics[1] = {
          title: "Minimum Incidents Across All Years",
          value: minIncidents.toString(),
          change: minSeverityLevel,
          isPositive: minIncidents < PROPERTY_CRIME_BENCHMARKS.medium,
        };

        // Find maximum incidents across all available years
        const maxIncidents = Math.max(
          ...sortedData.map((yearData) => parseInt(yearData.totalincidents || 0))
        );

        // Determine severity level for max incidents
        let maxSeverityLevel;
        if (maxIncidents >= 500) {
          maxSeverityLevel = "High";
        } else if (maxIncidents >= 300) {
          maxSeverityLevel = "Medium";
        } else if (maxIncidents >= 200) {
          maxSeverityLevel = "Low";
        } else {
          maxSeverityLevel = "Very Low";
        }

        // Update max incidents metric
        metrics[0] = {
          title: "Maximum Incidents Across All Years",
          value: maxIncidents.toString(),
          change: maxSeverityLevel,
          isPositive: maxIncidents < 300,
        };
      }
    }

    return metrics;
  };

  // Main loading state for the entire dashboard
  const isDashboardLoading =
    loadingStates.affordability ||
    loadingStates.occupations ||
    loadingStates.housing ||
    loadingStates.crimeTrend;

  // Show full-page loader while initial data loads
  if (
    isDashboardLoading &&
    !data.affordabilityData &&
    !data.crimeTrendData &&
    !data.topOccupationsData &&
    !data.housingPriceData
  ) {
    return (
      <div className="min-h-screen bg-eerie-black flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-eerie-black">
      {/* Header Section */}
      <div className="bg-hunter-green text-white py-12 px-4 relative">
        <div className="container mx-auto text-center">
          <motion.h1
            className="text-3xl font-bold mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Data Dashboard
          </motion.h1>
          <motion.p
            className="text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Interactive visualizations of crime and employment statistics across
            the United States.
          </motion.p>
        </div>
      </div>

      {/* Filters Section - Now using the extracted component */}
      <DashboardFilters
        filters={filters}
        availableCities={availableCities}
        availablePropertyTypes={availablePropertyTypes}
        onFilterChange={updateFilter}
        onSearch={searchData}
        isSearching={loadingStates.searching}
        searchError={searchError}
        isCityPickerOpen={isCityPickerOpen}
        isYearPickerOpen={isYearPickerOpen}
        setIsCityPickerOpen={setIsCityPickerOpen}
        setIsYearPickerOpen={setIsYearPickerOpen}
        decades={decades}
        availableYears={availableYears}
      />

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Key Metrics */}
        <Suspense fallback={<ChartLoader height="12rem" />}>
          <KeyMetricsSection
            metrics={generateKeyMetricsData()}
            isLoading={loadingStates.affordability}
          />
        </Suspense>


        {/* Chart Tabs */}
        <div className="bg-eerie-black rounded-lg shadow-md border border-white/40 mb-6">
          <div className="border-b border-gray-800">
            <nav className="flex space-x-4 p-4">
              {[
                { id: "wageAnalysis", label: "Wage Analysis" },
                { id: "topCrimes", label: "Top Crime Cities" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChart(tab.id)}
                  className={`px-3 py-2 font-medium text-sm rounded-md ${
                    activeChart === tab.id
                      ? "bg-hunter-green text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <Suspense fallback={<ChartLoader height="20rem" />}>
              {activeChart === "wageAnalysis" && (
                <WageAnalysisChart
                  selectedState={filters.state}
                  selectedYear={filters.year}
                />
              )}

              {activeChart === "topCrimes" && (
                <TopCrimesByCityChart
                  selectedState={filters.state}
                  selectedYear={filters.year}
                />
              )}
            </Suspense>
          </div>
        </div>

        {/* City Housing Price Analysis - Only visible when a city is selected */}
        {filters.city && (
          <motion.div
            className="bg-eerie-black rounded-lg shadow-md border border-gray-800 p-6 my-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={<ChartLoader height="24rem" />}>
              <HousingPriceAnalysisChart
                selectedState={filters.state}
                selectedCity={filters.city}
              />
            </Suspense>
          </motion.div>
        )}

        {/* Property Type Analysis - Only visible when a city is selected */}
        {filters.city && (
          <motion.div
            className="bg-eerie-black rounded-lg shadow-md border border-gray-800 p-6 my-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Suspense fallback={<ChartLoader height="24rem" />}>
              <PropertyTypeAnalysisChart
                selectedState={filters.state}
                selectedCity={filters.city}
              />
            </Suspense>
          </motion.div>
        )}

        {/* Popular Cities Chart - Always visible */}
        <motion.div
          className="bg-eerie-black rounded-lg shadow-md border border-gray-800 p-6 my-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Suspense fallback={<ChartLoader height="24rem" />}>
            <PopularCitiesChart selectedState={filters.state} />
          </Suspense>
        </motion.div>

        {/* Distribution Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Crime Distribution */}
          <motion.div
            className="mouse-position-border bg-eerie-black rounded-lg shadow-md border border-gray-800 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-medium text-mint mb-1">
              Crime Distribution by Type
            </h3>
            <p className="text-gray-400 mb-4">
              Breakdown of crime incidents by category for {filters.year}.
            </p>
            <Suspense fallback={<ChartLoader height="16rem" />}>
              <CrimeDistributionChart
                selectedState={filters.state}
                selectedCity={filters.city}
                selectedYear={filters.year}
                isLoading={loadingStates.crimeTrend}
              />
            </Suspense>
          </motion.div>
        </div>

        {/* Key Insights */}
        <Suspense fallback={<ChartLoader height="12rem" />}>
          <KeyInsightsSection
            selectedState={filters.state}
            selectedCity={filters.city}
            housingData={data.housingPriceData}
            crimeData={data.crimeTrendData}
            occupationData={data.topOccupationsData}
            isLoading={
              loadingStates.housing ||
              loadingStates.crimeTrend ||
              loadingStates.occupations
            }
          />
        </Suspense>

        {/* Get More Data CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-eerie-black rounded-xl overflow-hidden shadow-card mb-4"
        >
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl font-bold text-white mb-3">
                Want deeper insights?
              </h2>
              <p className="text-white/80 max-w-xl">
                Explore our AI-powered analysis tools to discover patterns and
                correlations between crime and employment data.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to={`/ai-insights?state=${filters.state}${
                  filters.city ? `&city=${filters.city}` : ""
                }&year=${filters.year}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-hunter-green hover:bg-hunter-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hunter-green"
              >
                Explore AI Insights
                <svg
                  className="ml-2 -mr-1 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
