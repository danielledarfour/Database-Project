// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import Loader from '../../ui/Loader';

// const PopularOccupation = ({ state }) => {
//   const [loading, setLoading] = useState(true);
//   const [occupationData, setOccupationData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Using the job endpoint that gets occupation data for a state
//         const response = await axios.get(`/api/job/${state}`);
        
//         if (response.data && response.data.length > 0) {
//           // Process data - matching the API response field names
//           const processedData = response.data.map(item => ({
//             occupationtitle: item.occupationtitle,
//             totalemployees: parseInt(item.emp) || 0,
//             percentage: parseFloat(item.truepct) || 0,
//             // Format for display
//             formattedPercentage: `${(parseFloat(item.truepct) * 100).toFixed(2)}%`
//           }));
          
//           setOccupationData({
//             occupations: processedData,
//             mostPopular: processedData[0]
//           });
//         } else {
//           setError("No occupation data available for the selected state.");
//         }
//       } catch (err) {
//         console.error("Error fetching occupation data:", err);
//         setError("Failed to load occupation data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (state) {
//       fetchData();
//     }
//   }, [state]);

//   if (loading) {
//     return (
//       <Card className="col-span-1 lg:col-span-2 h-96">
//         <CardContent className="flex items-center justify-center h-full">
//           <Loader />
//         </CardContent>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="col-span-1 lg:col-span-2 h-96">
//         <CardContent className="flex items-center justify-center h-full">
//           <p className="text-center text-red-500">{error}</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   const renderTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg shadow border border-white/20">
//           <p className="font-medium">{payload[0].payload.occupationtitle}</p>
//           <p className="text-[#00C49F]">{`Employees: ${payload[0].value.toLocaleString()}`}</p>
//           <p className="text-amber-400">{`Workforce: ${payload[0].payload.formattedPercentage}`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <Card className="col-span-1 lg:col-span-2">
//       <CardHeader>
//         <CardTitle>Most Popular Occupations in {state}</CardTitle>
//         <p className="text-sm text-muted-foreground">
//           {occupationData && occupationData.mostPopular && (
//             <>
//               Most popular: <span className="font-semibold">{occupationData.mostPopular.occupationtitle}</span>{' '}
//               ({occupationData.mostPopular.formattedPercentage} of workforce)
//             </>
//           )}
//         </p>
//       </CardHeader>
//       <CardContent className="h-96">
//         {occupationData && occupationData.occupations.length > 0 ? (
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={occupationData.occupations}
//               layout="vertical"
//               margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
//             >
//               <XAxis type="number" tickFormatter={(value) => `${(value).toLocaleString()}`} />
//               <YAxis 
//                 type="category" 
//                 dataKey="occupationtitle" 
//                 width={140}
//                 tick={{ fontSize: 12 }}
//               />
//               <Tooltip content={renderTooltip} />
//               <Bar dataKey="totalemployees" fill="#8884d8" />
//             </BarChart>
//           </ResponsiveContainer>
//         ) : (
//           <div className="flex items-center justify-center h-full">
//             <p>No occupation data available</p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default PopularOccupation; 