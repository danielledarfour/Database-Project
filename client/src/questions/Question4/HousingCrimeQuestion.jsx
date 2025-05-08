import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../ui/Input";
import axios from "axios";
import styled from "styled-components";
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

const yearRange = {
    start: 1980,
    end: 2014
};

const yearOptions = Array.from({ length: yearRange.end - yearRange.start + 1 }, (_, i) => yearRange.start + i);

export default function HousingCrimeQuestion() {
    const [selectedState, setSelectedState] = useState("");
    const [startYear, setStartYear] = useState(yearRange.start);
    const [endYear, setEndYear] = useState(yearRange.end);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('incidents');

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
    };

    const handleStartYearChange = (e) => {
        const newStartYear = parseInt(e.target.value);
        setStartYear(newStartYear);
        // Ensure end year is not less than start year
        if (newStartYear > endYear) {
            setEndYear(newStartYear);
        }
    };

    const handleEndYearChange = (e) => {
        const newEndYear = parseInt(e.target.value);
        setEndYear(newEndYear);
        // Ensure start year is not greater than end year
        if (newEndYear < startYear) {
            setStartYear(newEndYear);
        }
    };

    const fetchData = async () => {
        if (!selectedState) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const formattedState = selectedState.replace(/ /g, '_');
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/housing/${formattedState}/${startYear}/${endYear}`);
            setResults(response.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when inputs change
    useEffect(() => {
        if (selectedState && startYear && endYear) {
            fetchData();
        }
    }, [selectedState, startYear, endYear]);

    // Process data for visualization
    const processDataForCharts = () => {
        if (!results || results.length === 0) return { incidents: [], prices: [], bubble: [] };

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
                avgIncidents: data.reduce((sum, item) => sum + item.avgincidents, 0) / data.length
            }))
            .sort((a, b) => b.avgIncidents - a.avgIncidents)
            .slice(0, 5);

        // Process for prices chart (top 5 cities by avg sale price)
        const prices = Object.entries(cityData)
            .map(([city, data]) => ({
                city,
                avgSalePrice: data.reduce((sum, item) => sum + item.avgsaleprice, 0) / data.length
            }))
            .sort((a, b) => b.avgSalePrice - a.avgSalePrice)
            .slice(0, 5);

        // Process for bubble chart (comparing incidents, prices and employment)
        const bubble = Object.entries(cityData)
            .map(([city, data]) => {
                const avgData = data.reduce((acc, item) => {
                    acc.incidents += item.avgincidents;
                    acc.price += item.avgsaleprice;
                    acc.employment += item.avgemployment;
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
    };

    const { incidents, prices, bubble } = processDataForCharts();

    const formatDollar = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <QuestionContainer>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-eerie-black/95 backdrop-blur-md rounded-xl p-6 shadow-xl border border-mint/20"
            >
                <h2 className="text-2xl font-bold text-mint mb-4">Housing Metrics Over Time</h2>
                <p className="text-white/80 mb-6">
                    Explore housing metrics, crime incidents, and employment data across a year range for a specific state.
                </p>

                <FormGrid>
                    <FormField>
                        <label className="text-white">Select State:</label>
                        <select
                            value={selectedState}
                            onChange={handleStateChange}
                            className="bg-eerie-black/50 text-white p-2 rounded border border-mint/30 w-full focus:border-mint focus:outline-none"
                        >
                            <option value="">-- Select a State --</option>
                            {usStates.map((state) => (
                                <option key={state.id} value={state.name}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField>
                        <label className="text-white">Start Year:</label>
                        <select
                            value={startYear}
                            onChange={handleStartYearChange}
                            className="bg-eerie-black/50 text-white p-2 rounded border border-mint/30 w-full focus:border-mint focus:outline-none"
                        >
                            {yearOptions.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField>
                        <label className="text-white">End Year:</label>
                        <select
                            value={endYear}
                            onChange={handleEndYearChange}
                            className="bg-eerie-black/50 text-white p-2 rounded border border-mint/30 w-full focus:border-mint focus:outline-none"
                            min={startYear}
                        >
                            {yearOptions
                                .filter(year => year >= startYear)
                                .map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                        </select>
                    </FormField>
                </FormGrid>

                {error && (
                    <ErrorMessage className="bg-red-600/20 border border-red-500 text-white p-4 rounded-lg my-4">
                        {error}
                    </ErrorMessage>
                )}

                <AnimatePresence>
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center my-8"
                        >
                            <Loader size={50} />
                        </motion.div>
                    ) : results.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <TabContainer>
                                <TabButton 
                                    active={activeTab === 'incidents'} 
                                    onClick={() => setActiveTab('incidents')}
                                >
                                    Crime Incidents
                                </TabButton>
                                <TabButton 
                                    active={activeTab === 'prices'} 
                                    onClick={() => setActiveTab('prices')}
                                >
                                    Sale Prices
                                </TabButton>
                                <TabButton 
                                    active={activeTab === 'comparison'} 
                                    onClick={() => setActiveTab('comparison')}
                                >
                                    Data Comparison
                                </TabButton>
                            </TabContainer>

                            <ChartContainer>
                                {activeTab === 'incidents' && incidents.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-medium text-mint mb-4 text-center">
                                            Top Cities by Average Crime Incidents ({startYear} - {endYear})
                                        </h3>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={incidents}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                <XAxis dataKey="city" tick={{ fill: 'white' }} />
                                                <YAxis tick={{ fill: 'white' }} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1c1d1f', color: 'white', border: '1px solid #47B39C' }}
                                                    formatter={(value) => [value.toFixed(0), 'Incidents']}
                                                />
                                                <Legend />
                                                <Bar dataKey="avgIncidents" name="Avg. Crime Incidents" fill="#FF6B6B" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                        <p className="text-white/70 text-sm mt-4 text-center">
                                            This chart shows the top 5 cities with the highest average crime incidents during the selected time period.
                                        </p>
                                    </div>
                                )}

                                {activeTab === 'prices' && prices.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-medium text-mint mb-4 text-center">
                                            Top Cities by Average Sale Price ({startYear} - {endYear})
                                        </h3>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={prices}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                <XAxis dataKey="city" tick={{ fill: 'white' }} />
                                                <YAxis tick={{ fill: 'white' }} tickFormatter={formatDollar} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1c1d1f', color: 'white', border: '1px solid #47B39C' }}
                                                    formatter={(value) => [formatDollar(value), 'Avg. Sale Price']}
                                                />
                                                <Legend />
                                                <Bar dataKey="avgSalePrice" name="Avg. Sale Price" fill="#47B39C" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                        <p className="text-white/70 text-sm mt-4 text-center">
                                            This chart shows the top 5 cities with the highest average housing sale prices during the selected time period.
                                        </p>
                                    </div>
                                )}

                                {activeTab === 'comparison' && bubble.length > 0 && (
            <div>
                                        <h3 className="text-xl font-medium text-mint mb-4 text-center">
                                            City Data Comparison ({startYear} - {endYear})
                                        </h3>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <ScatterChart>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                <XAxis 
                                                    dataKey="avgIncidents" 
                                                    name="Crime Incidents" 
                                                    tick={{ fill: 'white' }} 
                                                    label={{ value: 'Crime Incidents', fill: 'white', position: 'insideBottom', offset: -5 }}
                                                />
                                                <YAxis 
                                                    dataKey="avgPrice" 
                                                    name="Avg. Sale Price" 
                                                    tick={{ fill: 'white' }} 
                                                    tickFormatter={formatDollar}
                                                    label={{ value: 'Avg. Sale Price', angle: -90, fill: 'white', position: 'insideLeft' }}
                                                />
                                                <ZAxis 
                                                    dataKey="avgEmployment" 
                                                    range={[50, 400]} 
                                                    name="Avg. Wage" 
                                                />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1c1d1f', color: 'white', border: '1px solid #47B39C' }}
                                                    formatter={(value, name) => {
                                                        if (name === 'Avg. Sale Price') return [formatDollar(value), name];
                                                        if (name === 'Avg. Wage') return [formatDollar(value), name];
                                                        return [value.toFixed(0), name];
                                                    }}
                                                    cursor={{ strokeDasharray: '3 3' }}
                                                />
                                                <Legend />
                                                <Scatter 
                                                    name="Cities" 
                                                    data={bubble} 
                                                    fill="#47B39C"
                                                >
                                                    {bubble.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Scatter>
                                            </ScatterChart>
                                        </ResponsiveContainer>
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-4">
                                            {bubble.map((city, index) => (
                                                <div 
                                                    key={city.city} 
                                                    className="flex items-center"
                                                >
                                                    <div 
                                                        className="w-3 h-3 rounded-full mr-2" 
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
                            </ChartContainer>

                            <SummaryContainer>
                                <SummaryCard>
                                    <h4 className="text-lg font-medium text-mint">Crime Insight</h4>
                                    <p className="text-white/80">
                                        {incidents[0]?.city || "N/A"} has the highest average crime incidents with {incidents[0]?.avgIncidents.toFixed(0) || "N/A"} reported cases.
                                    </p>
                                </SummaryCard>
                                <SummaryCard>
                                    <h4 className="text-lg font-medium text-mint">Housing Insight</h4>
                                    <p className="text-white/80">
                                        {prices[0]?.city || "N/A"} has the highest average sale price at {formatDollar(prices[0]?.avgSalePrice || 0)}.
                                    </p>
                                </SummaryCard>
                                <SummaryCard>
                                    <h4 className="text-lg font-medium text-mint">Value Insight</h4>
                                    {bubble.length > 0 && (
                                        <p className="text-white/80">
                                            {
                                                // Find city with best ratio of low crime, high wages, moderate prices
                                                (() => {
                                                    const valueCity = [...bubble].sort((a, b) => {
                                                        const scoreA = (a.avgEmployment / 100000) / ((a.avgIncidents / 1000) * (a.avgPrice / 1000000));
                                                        const scoreB = (b.avgEmployment / 100000) / ((b.avgIncidents / 1000) * (b.avgPrice / 1000000));
                                                        return scoreB - scoreA;
                                                    })[0];
                                                    
                                                    return `${valueCity.city} offers potentially good value with lower crime, reasonable prices and good wages.`;
                                                })()
                                            }
                                        </p>
                                    )}
                                </SummaryCard>
                            </SummaryContainer>
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
                            Please select a state to view housing and crime metrics.
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </QuestionContainer>
    );
}

const QuestionContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
`;

const FormField = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const ErrorMessage = styled.div`
    animation: pulse 2s infinite;
    
    @keyframes pulse {
        0% { opacity: 0.8; }
        50% { opacity: 1; }
        100% { opacity: 0.8; }
    }
`;

const TabContainer = styled.div`
    display: flex;
    border-bottom: 1px solid rgba(71, 179, 156, 0.3);
    margin-bottom: 1.5rem;
    overflow-x: auto;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
        display: none;
    }
`;

const TabButton = styled.button`
    padding: 0.75rem 1.5rem;
    color: ${props => props.active ? '#47B39C' : 'white'};
    background: ${props => props.active ? 'rgba(71, 179, 156, 0.1)' : 'transparent'};
    border: none;
    border-bottom: 2px solid ${props => props.active ? '#47B39C' : 'transparent'};
    font-weight: ${props => props.active ? '600' : '400'};
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    
    &:hover {
        background: rgba(71, 179, 156, 0.05);
        color: ${props => props.active ? '#47B39C' : 'rgba(255, 255, 255, 0.9)'};
    }
`;

const ChartContainer = styled.div`
    background: rgba(28, 29, 31, 0.7);
    border: 1px solid rgba(71, 179, 156, 0.2);
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
`;

const SummaryContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
`;

const SummaryCard = styled.div`
    background: rgba(28, 29, 31, 0.7);
    border: 1px solid rgba(71, 179, 156, 0.2);
    border-radius: 0.75rem;
    padding: 1.25rem;
`;
