import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import Loader from '../../ui/Loader';

/**
 * CrimeDistributionChart - Shows crime distribution by type as a pie chart
 * 
 * @param {Object} props - Component props
 * @param {string} props.selectedState - The selected state
 * @param {number} props.selectedYear - The selected year
 * @param {boolean} props.isLoading - Whether data is loading
 * @returns {JSX.Element} Pie chart of crime distribution
 */
const CrimeDistributionChart = ({ selectedState, selectedYear, isLoading }) => {
  const chartData = useMemo(() => {
    // Crime category labels
    const labels = ['Theft', 'Assault', 'Burglary', 'Robbery', 'Vehicle Theft', 'Other'];
    
    const stateId = selectedState.charCodeAt(0) + selectedState.charCodeAt(selectedState.length - 1);
    const yearFactor = parseInt(selectedYear) % 10;
    
    // Generate pseudo-random values using state and year as a seed
    const data = [
      30 + (stateId % 10) - yearFactor,         
      15 + (stateId % 5) + (yearFactor % 3),
      20 - (yearFactor % 4),                 
      10 + (stateId % 3),                   
      18 - (yearFactor % 5),                   
      7 + (stateId % 8)                         
    ];
    
    // Normalize to ensure values sum to 100
    const total = data.reduce((sum, value) => sum + value, 0);
    const normalizedData = data.map(value => Math.round((value / total) * 100));
    
    return {
      labels,
      datasets: [
        {
          label: 'Crime Distribution',
          data: normalizedData,
          backgroundColor: [
            'rgba(61, 217, 214, 0.6)',  // Turquoise
            'rgba(61, 170, 101, 0.6)',  // Green
            'rgba(43, 107, 57, 0.6)',   // Dark Green
            'rgba(43, 107, 57, 0.8)',   // Darker Green
            'rgba(20, 28, 28, 0.6)',    // Dark Gray
            'rgba(20, 28, 28, 0.8)',    // Darker Gray
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [selectedState, selectedYear]);

  // Chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + '%';
            }
            return label;
          }
        }
      }
    },
  };

  // If loading, show loader
  if (isLoading) {
    return (
      <div className="h-64 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-64">
      <Pie data={chartData} options={pieOptions} />
    </div>
  );
};

export default CrimeDistributionChart; 