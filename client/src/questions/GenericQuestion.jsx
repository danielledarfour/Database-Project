import React from "react";
import { motion } from "framer-motion";

const GenericQuestion = ({ questionData }) => {
  return (
    <div className="bg-eerie-black/50 rounded-lg border border-mint/20 p-6">
      <div className="text-center py-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-6 text-mint/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-2xl font-medium text-white mb-2">
            {questionData?.title || "Coming Soon"}
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">
            {questionData?.description || "This visualization is under development."}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="bg-mint hover:bg-mint/90 text-white px-5 py-2 rounded-md transition-colors inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Create Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GenericQuestion; 