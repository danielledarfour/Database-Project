import React from 'react';
import { motion } from 'framer-motion';
import Loader from '../../ui/Loader';

/**
 * KeyMetricsSection - A grid display of key metrics with animation
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} props.metrics - Array of metric objects
 * @param {string} props.metrics[].title - Title of the metric
 * @param {string} props.metrics[].value - Value of the metric
 * @param {string} props.metrics[].change - Change value (as string)
 * @param {boolean} props.metrics[].isPositive - Whether the change is positive
 * @param {boolean} props.isLoading - Whether data is being loaded
 * @returns {JSX.Element} The key metrics grid
 */
const KeyMetricsSection = ({ metrics, isLoading }) => {
  // Show a mini loader if we're in initial loading state
  if (isLoading && metrics.every(m => m.value === '—')) {
    return (
      <div className="h-48 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          className="mouse-position-border bg-eerie-black border border-white/40 rounded-lg p-6 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
        >
          <h3 className="text-sm font-medium text-gray-300 mb-1">{metric.title}</h3>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            <span className={`text-sm font-medium ${metric.isPositive ? 'text-mint' : 'text-red-500'} flex items-center`}>
              {metric.change}
              {metric.change !== '—' && (
                metric.isPositive ? (
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )
              )}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KeyMetricsSection; 