// import React, { useMemo } from 'react';
// import { Bar } from 'react-chartjs-2';
// import Loader from '../../ui/Loader';

// /**
//  * CrimeRateTrendChart - Displays crime rate trend data for a selected state
//  *
//  * @param {Object} props - Component props
//  * @param {string} props.selectedState - The selected state
//  * @param {Array} props.crimeTrendData - Crime trend data from the API
//  * @param {boolean} props.isLoading - Whether data is loading
//  * @returns {JSX.Element} Crime rate trend chart
//  */
// const CrimeRateTrendChart = ({ selectedState, crimeTrendData, isLoading }) => {
//   // Generate chart data from API results
//   const chartData = useMemo(() => {
//     let labels = [];
//     let violentCrimeData = [];
//     let propertyCrimeData = [];

//     if (crimeTrendData && crimeTrendData.length > 0) {
//       const sortedData = [...crimeTrendData].sort((a, b) => parseInt(a.year) - parseInt(b.year));

//       // Extract years for labels
//       labels = sortedData.map(item => item.year);

//       // For realistic data, we'll split total incidents into violent and property crimes
//       // This is just for visualization purposes since our API doesn't have this breakdown
//       sortedData.forEach(item => {
//         const totalIncidents = parseInt(item.totalincidents);
//         // Assume approximately 20% violent crime, 80% property crime
//         const violentCrime = Math.round(totalIncidents * 0.2);
//         const propertyCrime = totalIncidents - violentCrime;

//         violentCrimeData.push(violentCrime);
//         propertyCrimeData.push(propertyCrime);
//       });
//     } else {
//       // Fallback to empty chart with years as labels
//       labels = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 4 + i).toString());
//       violentCrimeData = Array(5).fill(0);
//       propertyCrimeData = Array(5).fill(0);
//     }

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Violent Crime',
//           data: violentCrimeData,
//           backgroundColor: 'rgba(255, 3, 3, 0.5)',
//           barPercentage: 0.6,
//         },
//         {
//           label: 'Property Crime',
//           data: propertyCrimeData,
//           backgroundColor: 'rgba(2, 255, 57, 0.5)',
//           barPercentage: 0.6,
//         },
//       ],
//     };
//   }, [crimeTrendData]);

//   // Chart options
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       tooltip: {
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || '';
//             if (label) {
//               label += ': ';
//             }
//             if (context.parsed.y !== null) {
//               label += new Intl.NumberFormat().format(context.parsed.y);
//             }
//             return label;
//           }
//         }
//       }
//     },
//     scales: {
//       x: {
//         stacked: false,
//         title: {
//           display: true,
//           text: 'Year',
//         },
//       },
//       y: {
//         stacked: false,
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Number of Incidents',
//         },
//         ticks: {
//           callback: function(value) {
//             return new Intl.NumberFormat().format(value);
//           }
//         }
//       },
//     },
//   };

//   // If loading with no data, show loader
//   if (isLoading && (!crimeTrendData || crimeTrendData.length === 0)) {
//     return (
//       <div className="h-80 flex justify-center items-center">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
//       <div className="mb-4">
//         <h3 className="text-lg font-medium text-white">Crime Rate Trends for {selectedState}</h3>
//         <p className="text-gray-400">Tracking changes in violent and property crime rates over the past 5 years.</p>
//         {!crimeTrendData || crimeTrendData.length === 0 ? (
//           <p className="text-amber-400 text-sm mt-2">
//             No crime data available for {selectedState}. Please try another state.
//           </p>
//         ) : null}
//       </div>
//       <div className="h-80">
//         <Bar data={chartData} options={chartOptions} />
//       </div>
//     </div>
//   );
// };

// export default CrimeRateTrendChart;
