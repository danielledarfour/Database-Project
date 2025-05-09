import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../ui/Card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from '../../ui/Loader';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const HousingTypeAnalysis = ({ state, city, year }) => {
  const [loading, setLoading] = useState(true);
  const [housingData, setHousingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Using the housing endpoint that gets data for a state
        const response = await axios.get(`/api/housing/${state}/${year-1}/${year}`);
        
        if (response.data && response.data.length > 0) {
          // Process data to find most popular housing type and most expensive houses
          const processedData = processHousingData(response.data);
          setHousingData(processedData);
        } else {
          setError("No housing data available for the selected criteria.");
        }
      } catch (err) {
        console.error("Error fetching housing data:", err);
        setError("Failed to load housing data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (state) {
      fetchData();
    }
  }, [state, city, year]);

  const processHousingData = (data) => {
    // Group by property type to find most popular types
    const propertyTypes = {};
    const cityPrices = {};
    
    data.forEach(item => {
      // Count property types
      if (propertyTypes[item.propertytype]) {
        propertyTypes[item.propertytype] += 1;
      } else {
        propertyTypes[item.propertytype] = 1;
      }
      
      // Track prices by city
      if (!cityPrices[item.city]) {
        cityPrices[item.city] = {
          city: item.city,
          avgPrice: 0,
          count: 0,
          totalPrice: 0
        };
      }
      
      // Some items might not have avgsaleprice, handle this case
      if (item.avgsaleprice) {
        cityPrices[item.city].totalPrice += parseFloat(item.avgsaleprice);
        cityPrices[item.city].count += 1;
      }
    });
    
    // Calculate average price for each city
    Object.keys(cityPrices).forEach(city => {
      if (cityPrices[city].count > 0) {
        cityPrices[city].avgPrice = cityPrices[city].totalPrice / cityPrices[city].count;
      }
    });
    
    // Convert to arrays for charts
    const propertyTypeData = Object.keys(propertyTypes).map(type => ({
      name: type,
      value: propertyTypes[type]
    })).sort((a, b) => b.value - a.value);
    
    const expensiveCities = Object.values(cityPrices)
      .filter(city => city.avgPrice > 0)
      .sort((a, b) => b.avgPrice - a.avgPrice)
      .slice(0, 5);
    
    return {
      propertyTypeData,
      expensiveCities,
      mostPopularType: propertyTypeData.length > 0 ? propertyTypeData[0].name : 'N/A',
      mostExpensiveCity: expensiveCities.length > 0 ? expensiveCities[0].city : 'N/A'
    };
  };

  if (loading) {
    return (
      <div className="col-span-1 lg:col-span-2 h-96 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-1 lg:col-span-2 h-96 flex items-center justify-center">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg shadow border border-white/20">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-[#00C49F]">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderPriceTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg shadow border border-white/20">
          <p className="font-medium">{payload[0].payload.city}</p>
          <p className="text-[#00C49F]">{`Average Price: $${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card 
        title="Most Popular Housing Type"
        content={`Distribution of property types in ${state} (${year}): ${housingData.mostPopularType}`}
        month="Housing"
        date="Types"
      >
        {housingData && housingData.propertyTypeData.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={housingData.propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {housingData.propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No property type data available</p>
          </div>
        )}
      </Card>

      <Card
        title="Most Expensive Cities"
        content={`Top 5 cities with highest average housing prices in ${state}`}
        month="Price"
        date="Data"
      >
        {housingData && housingData.expensiveCities.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={housingData.expensiveCities}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="city" width={100} />
                <Tooltip content={renderPriceTooltip} />
                <Bar dataKey="avgPrice" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No price data available</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HousingTypeAnalysis; 