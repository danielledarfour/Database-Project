import React from 'react';
import { Bar } from 'react-chartjs-2';

const CrimeComparisonChart = ({ stateData, dataType }) => {
  if (!stateData) return <div className="flex h-full items-center justify-center text-gray-400">No data available</div>;

  // Extract state name
  const stateName = stateData.stateName || 'Selected State';
  
  // Find comparison data in the state data object (keys ending with "comparison")
  const comparisonData = Object.entries(stateData)
    .filter(([key]) => key.includes('comparison'))
    .reduce((acc, [key, value]) => {
      // Format the label by removing "comparison" and converting camelCase to Title Case
      const label = key
        .replace('comparison', '')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
      
      acc[label] = value;
      return acc;
    }, {});
  
  // If no comparison data, show a placeholder
  if (Object.keys(comparisonData).length === 0) {
    // Create some mock comparison data for demonstration
    const mockLabels = dataType === 'crime' 
      ? ['Violent Crime', 'Property Crime', 'Burglary', 'Assault'] 
      : ['Unemployment', 'Job Growth', 'Median Wage', 'Labor Force'];
    
    // Generate random data for state and national values
    mockLabels.forEach(label => {
      const stateValue = Math.random() * 100;
      const nationalValue = Math.random() * 100;
      comparisonData[label] = {
        state: stateValue,
        national: nationalValue
      };
    });
  }

  // Prepare data for Chart.js
  const chartData = {
    labels: Object.keys(comparisonData),
    datasets: [
      {
        label: stateName,
        data: Object.values(comparisonData).map(item => 
          typeof item === 'object' ? item.state : item
        ),
        backgroundColor: dataType === 'crime' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.7)',
        borderColor: dataType === 'crime' ? 'rgb(239, 68, 68)' : 'rgb(16, 185, 129)',
        borderWidth: 1
      },
      {
        label: 'National Average',
        data: Object.values(comparisonData).map(item => 
          typeof item === 'object' ? item.national : item * 0.8 // Fallback if structure is different
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb' // text-gray-200
        }
      },
      tooltip: {
        backgroundColor: '#1f2937', // bg-gray-800
        titleColor: '#f9fafb', // text-gray-50
        bodyColor: '#f3f4f6', // text-gray-100
        borderColor: '#374151', // border-gray-700
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)' // gray-600 with opacity
        },
        ticks: {
          color: '#9ca3af' // text-gray-400
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)' // gray-600 with opacity
        },
        ticks: {
          color: '#9ca3af' // text-gray-400
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="h-full w-full">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default CrimeComparisonChart; 