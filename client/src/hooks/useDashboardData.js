import { useState, useEffect } from 'react';
import axios from 'axios';

const useDashboardData = (initialFilters = {}) => {
  // Filter states
  const [filters, setFilters] = useState({
    state: initialFilters.state || 'California',
    city: initialFilters.city || '',
    year: initialFilters.year || 2021,
    ...initialFilters
  });

  // Data states
  const [data, setData] = useState({
    affordabilityData: null,
    topOccupationsData: null,
    housingPriceData: null,
    crimeTrendData: null,
    crimeByStateYearData: null,
    housingDetailData: null,
    stateGeneralData: null,
    housingByStateYearData: null,
    stateByYearData: null
  });

  // Loading states as a single object
  const [loadingStates, setLoadingStates] = useState({
    affordability: false,
    occupations: false,
    housing: false,
    crimeTrend: false,
    searching: false
  });

  const [searchError, setSearchError] = useState(null);

  // Helper to update loading states
  const setLoading = (key, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [key]: isLoading }));
  };

  // Helper to update data
  const setDataByKey = (key, newData) => {
    setData(prev => ({ ...prev, [key]: newData }));
  };

  // Update filter and manage URL
  const updateFilter = (key, value) => {
    setFilters(prev => {
      // Special case: reset city when state changes
      if (key === 'state' && prev.city) {
        return { ...prev, [key]: value, city: '' };
      }
      return { ...prev, [key]: value };
    });
  };

  // Initial data load - affordability
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading('affordability', true);
      try {
        const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${serverBaseUrl}/housing/affordability`);
        setDataByKey('affordabilityData', response.data);
      } catch (error) {
        console.error('Error fetching affordability data:', error);
      } finally {
        setLoading('affordability', false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Load state-specific data when state changes
  useEffect(() => {
    if (!filters.state) return;
    
    const fetchStateData = async () => {
      setLoading('occupations', true);
      setLoading('housing', true);
      setLoading('crimeTrend', true);
      
      try {
        const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api';
        
        // Jobs data
        const jobsResponse = await axios.get(`${serverBaseUrl}/jobs/${filters.state}`);
        setDataByKey('topOccupationsData', jobsResponse.data);
        
        // Housing data
        const housingResponse = await axios.get(`${serverBaseUrl}/housing/${filters.state}`);
        setDataByKey('housingPriceData', housingResponse.data);
        
        // Crime trend data
        const crimeResponse = await axios.get(`${serverBaseUrl}/five-years/${filters.state}`);
        setDataByKey('crimeTrendData', crimeResponse.data);
        
      } catch (error) {
        console.error('Error fetching state data:', error);
      } finally {
        setLoading('occupations', false);
        setLoading('housing', false);
        setLoading('crimeTrend', false);
      }
    };
    
    fetchStateData();
  }, [filters.state]);

  // Search function for explicit data fetching
  const searchData = async () => {
    setLoading('searching', true);
    setSearchError(null);
    
    try {
      const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api';
      const requests = [];
      const endpoints = [];
      
      // Check which endpoints can be called with our parameters
      const { state, city, year } = filters;
      
      // 1. Crime data by state and year
      if (state && year) {
        requests.push(axios.get(`${serverBaseUrl}/crime/${state}/${year}`));
        endpoints.push('crimeByStateYearData');
      }
      
      // 2. Housing data by state, city and property type
      if (state && city) {
        // For demo purposes, fetch data for Single Family Residential
        const propertyType = 'Single Family Residential';
        requests.push(axios.get(`${serverBaseUrl}/housing/${state}/${city}/${propertyType}`));
        endpoints.push('housingDetailData');
      }
      
      // 3. State general data
      if (state) {
        requests.push(axios.get(`${serverBaseUrl}/state/${state}`));
        endpoints.push('stateGeneralData');
      }
      
      // 4. Housing data by state and year
      if (state && year) {
        requests.push(axios.get(`${serverBaseUrl}/housing/${state}/${year}`));
        endpoints.push('housingByStateYearData');
      }
      
      // 5. State data by year
      if (state && year) {
        requests.push(axios.get(`${serverBaseUrl}/state/${state}/${year}`));
        endpoints.push('stateByYearData');
      }
      
      // 6. Five year crime trend
      if (state) {
        requests.push(axios.get(`${serverBaseUrl}/five-years/${state}`));
        endpoints.push('crimeTrendData');
      }
      
      // 7. Housing affordability (no parameters)
      requests.push(axios.get(`${serverBaseUrl}/housing/affordability`));
      endpoints.push('affordabilityData');
      
      // 8. Jobs by state
      if (state) {
        requests.push(axios.get(`${serverBaseUrl}/jobs/${state}`));
        endpoints.push('topOccupationsData');
      }
      
      // 9. Housing by state
      if (state) {
        requests.push(axios.get(`${serverBaseUrl}/housing/${state}`));
        endpoints.push('housingPriceData');
      }
      
      // Execute all requests in parallel
      const responses = await Promise.all(requests);
      
      // Process the responses and update state
      responses.forEach((response, index) => {
        const endpoint = endpoints[index];
        setDataByKey(endpoint, response.data);
      });
      
      console.log('Search completed successfully');
      
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchError(error.message || 'An error occurred during search');
    } finally {
      setLoading('searching', false);
    }
  };

  return {
    filters,
    updateFilter,
    data,
    loadingStates,
    searchData,
    searchError
  };
};

export default useDashboardData; 