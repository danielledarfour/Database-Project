import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  
  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      // Get the server URL from environment variables with fallback
      const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5001';
      try {
        console.log(`Fetching team members from ${serverBaseUrl}/api/team-members`);
        const response = await fetch(`${serverBaseUrl}/api/team-members`, {
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data);
          console.log('Successfully fetched team members');
        } else {
          throw new Error('API response not OK');
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };
    fetchTeamMembers();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-hunter-green py-16">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
              Our Story
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Learn about our mission to make crime, housing, and employment data accessible and actionable for everyone.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container-custom mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-4">
              At InvestiGator, we're dedicated to transforming complex crime, housing, and employment data into accessible insights that drive informed decision-making for policy makers, urban planners, and researchers.
            </p>
            <p className="text-gray-700 mb-4">
              Our goal is to provide a comprehensive platform that allows users to explore the intricate relationships between crime statistics, housing, and employment trends across the United States, helping communities create safer and more prosperous environments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <div className="flex items-center">
                <div className="bg-primary/20 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Data-Driven</span>
              </div>
              <div className="flex items-center">
                <div className="bg-secondary/20 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Secure</span>
              </div>
              <div className="flex items-center">
                <div className="bg-accent/20 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">AI-Powered</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl overflow-hidden shadow-md"
          >
            <img 
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
              alt="Team meeting" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
        
        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-4">
              Our Team
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Meet the team behind InvestiGator.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm"
              >
                <img src={member.image} alt={member.name} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage 