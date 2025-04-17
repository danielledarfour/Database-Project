import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const AIInsightsPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Welcome to the AI Insights Assistant. I can help you analyze crime and employment data relationships. What would you like to know?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample questions the user might ask
  const sampleQuestions = [
    "What's the correlation between unemployment and property crime?",
    "Which states have the highest violent crime rates?",
    "How has the job market changed in the last decade?",
    "Is there a relationship between education levels and crime rates?",
    "What economic factors most strongly influence crime statistics?",
  ];

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI response generation
  const generateResponse = (query) => {
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      let response = "";

      // Very simple pattern matching for demo purposes
      if (
        query.toLowerCase().includes("correlation") ||
        query.toLowerCase().includes("relationship")
      ) {
        response =
          "Based on our analysis of data from 1980-2023, there is a moderate positive correlation (r=0.53) between unemployment rates and property crime. For every 1% increase in unemployment, we observe approximately a 2.3% increase in property crime rates nationally. However, this relationship varies significantly by state and is influenced by other socioeconomic factors such as income inequality, education levels, and social safety net programs.";
      } else if (
        query.toLowerCase().includes("highest") &&
        query.toLowerCase().includes("crime")
      ) {
        response =
          "According to our most recent data (2023), the states with the highest violent crime rates per 100,000 population are:\n\n1. Mississippi (660.4)\n2. Louisiana (639.4)\n3. New Mexico (627.5)\n4. Missouri (568.2)\n5. Arkansas (543.8)\n\nIt's important to note that crime rates can vary significantly within states, with urban areas typically experiencing higher rates than rural areas.";
      } else if (
        query.toLowerCase().includes("job market") ||
        query.toLowerCase().includes("employment")
      ) {
        response =
          "The U.S. job market has undergone significant transformation over the past decade (2013-2023). Key changes include:\n\n• Growth in service sector jobs, particularly in healthcare (+31%) and technology (+47%)\n• Decline in manufacturing employment (-5%)\n• Increase in remote work opportunities, accelerated by the COVID-19 pandemic\n• Rising demand for digital skills across all sectors\n• Growing wage gap between high-skill and low-skill positions\n\nThe national unemployment rate decreased from 7.4% in 2013 to 3.7% in 2023, though this improvement has not been evenly distributed across all demographic groups and regions.";
      } else if (query.toLowerCase().includes("education")) {
        response =
          "Education levels show a strong inverse relationship with crime rates. According to our analysis:\n\n• States with higher percentages of residents with bachelor's degrees or higher tend to have lower crime rates\n• For every 10% increase in college graduation rates, violent crime decreases by approximately 13% on average\n• The effect is particularly pronounced for property crimes\n\nHowever, this relationship is complex and influenced by other factors such as economic opportunity, income inequality, and access to social services. Education appears to serve as both a direct protective factor against crime and as a pathway to better economic outcomes that indirectly reduce crime.";
      } else {
        response =
          "That's an interesting question about crime and employment data. While I don't have a specific pre-programmed answer for this query, I can tell you that our analysis shows multiple factors influence crime rates, including unemployment, poverty rates, population density, and social support systems. Would you like me to focus on a particular aspect of this relationship or provide general trends from our database?";
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: response },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: inputMessage },
    ]);

    // Generate AI response
    generateResponse(inputMessage);

    // Clear input
    setInputMessage("");
  };

  const handleSampleQuestion = (question) => {
    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: question },
    ]);

    // Generate AI response
    generateResponse(question);
  };

  return (
    <div className="bg-eerie-black min-h-screen text-white">
      {/* Hero Section */}
      <div className="bg-hunter-green py-8">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-3">
              AI Insights
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Dummy AI insights Page
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-eerie-black rounded-lg shadow-md border border-gray-800 p-5 mb-6">
              <h2 className="text-xl font-bold text-mint mb-4">How It Works</h2>
              <p className="text-gray-300 mb-4">
                Our AI assistant analyzes relationships between crime statistics
                and employment data to provide insights that might not be
                immediately obvious.
              </p>
              <p className="text-gray-300 mb-4">
                Ask questions about trends, correlations, or specific data
                points to explore the complex relationship between crime and
                economic factors.
              </p>
              <div className="border-t border-gray-800 pt-4 mt-4">
                <h3 className="text-md font-semibold text-white mb-3">
                  Sample Questions
                </h3>
                <ul className="space-y-2">
                  {sampleQuestions.map((question, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleSampleQuestion(question)}
                        className="text-left text-mint hover:text-mint/80 text-sm hover:underline w-full"
                      >
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-eerie-black rounded-lg shadow-md border border-gray-800 p-5">
              <div className="flex items-center mb-4">
                <div className="bg-hunter-green p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  How We Use AI
                </h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Our AI model has been trained on three datasets
              </p>
              <p className="text-gray-300 text-sm mb-3">
                We process this data through advanced machine learning
                algorithms to provide insights that can help inform policy
                decisions and research.
              </p>
              <p className="text-gray-300 text-sm">
                All insights are based on statistical analysis and should be
                considered as part of a broader research approach.
              </p>
            </div>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-eerie-black rounded-lg shadow-md border border-gray-800 overflow-hidden flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="bg-hunter-green text-white px-5 py-3">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">AI Insights Assistant</h2>
                    <p className="text-white/70 text-sm">
                      Analyzing crime and employment data correlations
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-eerie-black">
                <div className="space-y-4">
                  {messages.map(
                    (message, index) =>
                      message.role !== "system" && (
                        <div
                          key={index}
                          className={`flex ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-3/4 rounded-lg px-4 py-3 ${
                              message.role === "user"
                                ? "bg-hunter-green text-white rounded-br-none"
                                : "bg-gray-800 text-white rounded-bl-none"
                            }`}
                          >
                            <div className="whitespace-pre-line">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      )
                  )}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 rounded-lg rounded-bl-none px-4 py-3">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 bg-mint rounded-full animate-bounce"
                            style={{ animationDelay: "0s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-mint rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-mint rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-800 p-4 bg-eerie-black">
                <form onSubmit={handleSubmit} className="flex items-center">
                  <input
                    type="text"
                    className="flex-1 border border-gray-700 bg-gray-800 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent"
                    placeholder="Ask a question about crime and employment data..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-hunter-green text-white px-4 py-2 rounded-r-lg hover:bg-hunter-green/90 focus:outline-none focus:ring-2 focus:ring-mint focus:ring-opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-6 bg-eerie-black rounded-lg shadow-md border border-gray-800 p-5">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-hunter-green p-2 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Want More In-depth Analysis?
                  </h3>
                  <p className="text-gray-300 mb-3">
                    The AI assistant provides quick insights, but our full
                    reports offer deeper analysis with detailed methodology and
                    source citations.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-hunter-green hover:bg-hunter-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hunter-green">
                      Download Full Report
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint">
                      View Methodology
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPage;
