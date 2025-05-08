import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle, ExternalLink, Lock, Info, AlertCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import styled from 'styled-components';

// Styled component for the glowing border effect
const GlowingContainer = styled.div`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #10b981, #121212, #195d30, #121212);
    z-index: -1;
    background-size: 400%;
    border-radius: 14px;
    filter: blur(7px);
    opacity: 0.7;
    transition: opacity 0.3s ease-in-out;
    animation: glowing 10s linear infinite;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  @keyframes glowing {
    0% { background-position: 0 0; }
    50% { background-position: 400% 0; }
    100% { background-position: 0 0; }
  }
`;

// Memoized navigation card component to prevent unnecessary re-renders
const NavigationCard = memo(({ card, setIsOpen }) => {
  return (
    <motion.div
      className="bg-eerie-black/90 border border-mint/20 rounded-lg p-3 mt-2 shadow-md hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="flex flex-col">
        <h4 className="font-thin text-mint text-sm mb-1">{card.title}</h4>
        <p className="text-gray-300 text-xs mb-2 font-thin">{card.description}</p>
        <Link 
          to={card.link} 
          className="flex items-center text-xs font-thin text-mint hover:text-mint/80 mt-1"
          onClick={() => setIsOpen(false)} // Close chat when navigating
        >
          <span>Go to {card.title}</span>
          <ExternalLink size={12} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  );
});

// Step by Step Guide component for structured instructions
const StepByStepGuide = memo(({ guide, setIsOpen }) => {
  return (
    <motion.div
      className="bg-eerie-black/90 border border-mint/20 rounded-lg p-3 mt-2 shadow-md hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="flex flex-col">
        <h4 className="font-thin text-mint text-sm mb-1">{guide.task}</h4>
        
        <div className="mt-2 space-y-3">
          {guide.steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-mint/20 flex items-center justify-center mt-0.5">
                <span className="text-mint text-xs font-medium">{step.step_number}</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-200 text-xs font-thin">{step.instruction}</p>
                {step.element_description && (
                  <p className="text-gray-400 text-xs italic mt-0.5 font-thin">{step.element_description}</p>
                )}
                <div className="flex items-center mt-1">
                  <div className="px-1.5 py-0.5 text-[10px] font-thin bg-mint/10 rounded text-mint">
                    {step.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {guide.destination_page && (
          <Link 
            to={guide.destination_page} 
            className="flex items-center text-xs font-thin text-mint hover:text-mint/80 mt-3 self-end"
            onClick={() => setIsOpen(false)} // Close chat when navigating
          >
            <span>Go to {guide.destination_page.replace('/', '')}</span>
            <ExternalLink size={12} className="ml-1" />
          </Link>
        )}
      </div>
    </motion.div>
  );
});

const MessageContent = memo(({ message, setIsOpen }) => {
  // If the message has a card attached, show text + card
  if (message.card) {
    return (
      <div className="flex flex-col">
        {message.text && <div className="mb-2 font-thin">{message.text}</div>}
        <NavigationCard card={message.card} setIsOpen={setIsOpen} />
      </div>
    );
  }
  
  if (message.guide) {
    return (
      <div className="flex flex-col">
        {message.text && <div className="mb-2 font-thin">{message.text}</div>}
        <StepByStepGuide guide={message.guide} setIsOpen={setIsOpen} />
      </div>
    );
  }
  
  // Otherwise just show the text
  return <div className="font-thin">{message.text}</div>;
});

// Conversation starter component
const ConversationStarter = memo(({ text, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="text-left text-xs font-thin py-1.5 px-3 rounded-full bg-mint/10 border border-mint/20 hover:bg-mint/20 text-mint transition-colors flex items-center space-x-1.5"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <HelpCircle size={12} />
      <span>{text}</span>
    </motion.button>
  );
});

// Create a context to store and manage intent state
const IntentContext = React.createContext();

// Intent toggle button component with improved styling
const IntentButton = memo(({ active, text, value, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
        active 
          ? 'bg-gradient-to-r from-mint to-mint/80 text-eerie-black shadow-lg scale-105' 
          : 'bg-eerie-black border border-mint/20 text-mint hover:bg-mint/10'
      }`}
    >
      {text}
    </button>
  );
});

// Intent Provider component to manage intent state
function IntentProvider({ children }) {
  const [currentIntent, setCurrentIntent] = useState('where_is');
  
  const setIntent = useCallback((intent) => {
    console.log(`Setting intent to: ${intent}`);
    setCurrentIntent(intent);
  }, []);
  
  const contextValue = useMemo(() => ({
    intent: currentIntent,
    setIntent,
    isWhereIs: currentIntent === 'where_is',
    isHowDoI: currentIntent === 'how_do_i'
  }), [currentIntent, setIntent]);
  
  return (
    <IntentContext.Provider value={contextValue}>
      {children}
    </IntentContext.Provider>
  );
}

// Custom hook to use intent context
function useIntent() {
  const context = React.useContext(IntentContext);
  if (!context) {
    throw new Error('useIntent must be used within an IntentProvider');
  }
  return context;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [apiKeyError, setApiKeyError] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Example conversation starters with intents
  const conversationStarters = [
    { intent: 'where_is', text: "the search page?" },
    { intent: 'where_is', text: "the Map visualization?" },
    { intent: 'where_is', text: "the dashboard?" },
    { intent: 'how_do_i', text: "find prices of Condos in Georgia?" },
    { intent: 'how_do_i', text: "compare crime rates between states?" },
  ];

  // Maintain conversation history for context
  useEffect(() => {
    // When messages change, update the conversation history for the API
    if (messages.length > 0) {
      const apiMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
        // If it's an assistant message with a card, include function call info
        ...((!msg.isUser && msg.card) ? {
          function_call: {
            name: "navigation_card",
            arguments: JSON.stringify(msg.card)
          }
        } : {}),
        // If it's an assistant message with a guide, include function call info
        ...((!msg.isUser && msg.guide) ? {
          function_call: {
            name: "step_by_step_guide",
            arguments: JSON.stringify(msg.guide)
          }
        } : {})
      }));
      
      // Store for potential future use, but we're not sending it to the backend anymore
      setConversationHistory(apiMessages);
    }
  }, [messages]);

  // Check for stored API key on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsApiKeyValid(true);
      setShowApiKeyInput(false);
    }
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get DOM content as a string for context
  const getPageDOM = () => {
    // Get basic info
    const basicInfo = {
      title: document.title,
      url: window.location.href,
      pathname: window.location.pathname
    };
    
    // Get headings
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
      .map(h => h.textContent);
    
    // Get navigation links
    const navLinks = Array.from(document.querySelectorAll('nav a'))
      .map(a => ({
        text: a.textContent,
        href: a.getAttribute('href')
      }));
    
    // Get important UI elements with their spatial positions
    const uiElements = Array.from(document.querySelectorAll('.card, .chart, .button, .option, .input'))
      .map(el => {
        const rect = el.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Determine quadrant location
        let quadrant;
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);
        
        if (centerY < viewportHeight / 2) {
          quadrant = centerX < viewportWidth / 2 ? "top-left" : "top-right";
        } else {
          quadrant = centerX < viewportWidth / 2 ? "bottom-left" : "bottom-right";
        }
        
        return {
          type: el.tagName,
          id: el.id || null,
          class: el.className,
          text: el.textContent?.trim().slice(0, 50),
          dataElement: el.getAttribute('data-element') || null,
          dataPurpose: el.getAttribute('data-purpose') || null,
          position: {
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            quadrant
          }
        };
      });
    
    // Get specific important UI sections like filters, search bars, etc.
    const uiSections = {
      hasSidebar: document.querySelector('nav, .sidebar, aside') !== null,
      hasTopBar: document.querySelector('header, .navbar, .top-bar') !== null,
      hasFilters: document.querySelector('.filters, [data-purpose="filter"]') !== null,
      hasCharts: document.querySelector('.chart, [data-purpose="visualization"]') !== null,
      hasSearch: document.querySelector('input[type="search"], .search-bar') !== null
    };
    
    return JSON.stringify({
      ...basicInfo,
      headings,
      navLinks,
      uiElements,
      uiSections,
      screenDimensions: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  };

  // Process any raw function calls that might be embedded in text
  const processRawFunctionCalls = (text) => {
    if (!text) return { text: '', card: null, guide: null };
    
    // Attempt to find raw function calls in various formats
    const functionRegexes = [
      // Match ```javascript functions.navigation_card({ ... }) ```
      /```(?:javascript|js)?\s*(?:functions\.)?navigation_card\(\s*(\{[\s\S]*?\})\s*\)\s*;?\s*```/gi,
      // Match navigation_card({ ... }) without code blocks
      /(?:functions\.)?navigation_card\(\s*(\{[\s\S]*?\})\s*\)\s*;?/gi,
      // Match raw JSON in ```json format
      /```json\s*(\{[\s\S]*?\})\s*```/gi
    ];
    
    // First check for navigation_card
    for (const regex of functionRegexes) {
      const match = regex.exec(text);
      if (match && match[1]) {
        try {
          // Try to parse the object inside the function call
          const cardData = JSON.parse(match[1].replace(/'/g, '"'));
          
          // Remove the function call from the text
          const cleanedText = text.replace(match[0], '').trim();
          
          // Check if the parsed object has the required fields
          if (cardData.title && cardData.description && cardData.link) {
            return {
              text: cleanedText,
              card: cardData,
              guide: null
            };
          }
        } catch (e) {
          console.error("Failed to parse embedded function call:", e);
        }
      }
    }
    
    // Check for step_by_step_guide in case it's embedded in text
    const stepGuideRegexes = [
      // Match ```javascript functions.step_by_step_guide({ ... }) ```
      /```(?:javascript|js)?\s*(?:functions\.)?step_by_step_guide\(\s*(\{[\s\S]*?\})\s*\)\s*;?\s*```/gi,
      // Match step_by_step_guide({ ... }) without code blocks
      /(?:functions\.)?step_by_step_guide\(\s*(\{[\s\S]*?\})\s*\)\s*;?/gi,
    ];
    
    for (const regex of stepGuideRegexes) {
      const match = regex.exec(text);
      if (match && match[1]) {
        try {
          // Try to parse the guide data
          const guideData = JSON.parse(match[1].replace(/'/g, '"'));
          
          // Remove the function call from the text
          const cleanedText = text.replace(match[0], '').trim();
          
          // Check if it has required fields
          if (guideData.task && guideData.steps && Array.isArray(guideData.steps)) {
            return {
              text: cleanedText,
              card: null,
              guide: guideData
            };
          }
        } catch (e) {
          console.error("Failed to parse step guide function call:", e);
        }
      }
    }
    
    return { text, card: null, guide: null };
  };

  // Wrap the Chat UI in the IntentProvider
  return (
    <IntentProvider>
      <ChatBotUI 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        messages={messages}
        setMessages={setMessages}
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        apiKey={apiKey}
        setApiKey={setApiKey}
        isApiKeyValid={isApiKeyValid}
        setIsApiKeyValid={setIsApiKeyValid}
        showApiKeyInput={showApiKeyInput}
        setShowApiKeyInput={setShowApiKeyInput}
        apiKeyError={apiKeyError}
        setApiKeyError={setApiKeyError}
        conversationStarters={conversationStarters}
        messagesEndRef={messagesEndRef}
        chatContainerRef={chatContainerRef}
        getPageDOM={getPageDOM}
        processRawFunctionCalls={processRawFunctionCalls}
      />
    </IntentProvider>
  );
};

// Separate UI component to use the intent context
const ChatBotUI = memo(({
  isOpen, setIsOpen, messages, setMessages, input, setInput, 
  isLoading, setIsLoading, apiKey, setApiKey, isApiKeyValid, 
  setIsApiKeyValid, showApiKeyInput, setShowApiKeyInput, 
  apiKeyError, setApiKeyError, conversationStarters, 
  messagesEndRef, chatContainerRef, getPageDOM, processRawFunctionCalls
}) => {
  // Get intent from context
  const { intent, setIntent, isWhereIs, isHowDoI } = useIntent();
  
  // Add event listener for toggleChatbot event
  useEffect(() => {
    const handleToggleChatbot = () => {
      setIsOpen(true);
      console.log('Chatbot opened via custom event');
    };
    
    // Add event listener
    document.addEventListener('toggleChatbot', handleToggleChatbot);
    
    // Clean up
    return () => {
      document.removeEventListener('toggleChatbot', handleToggleChatbot);
    };
  }, [setIsOpen]);
  
  // Handle clicking a conversation starter
  const handleStarterClick = (starter) => {
    // Set the input text
    setInput(starter.text);
    
    // Set the intent using the context
    setIntent(starter.intent);
    console.log(`Starter clicked, setting intent to: ${starter.intent}`);
    
    // Submit it immediately if valid
    if (isApiKeyValid) {
      // We need to manually call handleSubmitWithIntent with this text and intent
      handleSubmitWithIntent(starter.text, starter.intent);
    }
  };
  
  // New function to handle submission with explicit intent
  const handleSubmitWithIntent = async (text, explicitIntent) => {
    if (!text.trim() || !isApiKeyValid) return;
    
    // Use the explicit intent if provided, otherwise use the context intent
    const submissionIntent = explicitIntent || intent;
    console.log(`Submitting with intent (explicit): ${submissionIntent}`);
    
    // Format the message to display with intent prefix
    const displayText = `${submissionIntent === 'where_is' ? 'Where is' : 'How do I'} ${text}`;
    
    // Add user message to chat
    setMessages(prev => [...prev, { text: displayText, isUser: true }]);
    setInput(''); // Clear input field
    setIsLoading(true);
    
    try {
      // Get DOM content for context
      const pageDOM = getPageDOM();
      
      // Debug the request before sending
      console.log(`SENDING REQUEST:`, {
        message: text,
        intent: submissionIntent, 
        intentType: typeof submissionIntent
      });
      
      // Call backend API with user's API key, intent, and message
      const response = await axios.post('/api/chatbot', {
        message: text,
        pageDOM,
        apiKey,
        intent: submissionIntent // Send the intent to help the backend determine function call
      });
      
      // Debug the response
      console.log(`RESPONSE RECEIVED:`, {
        success: response.data.success,
        hasCard: !!response.data.card,
        hasGuide: !!response.data.guide,
        responseType: response.data.card ? 'navigation_card' : (response.data.guide ? 'step_by_step_guide' : 'text')
      });
      
      // Handle the response
      if (response.data.success) {
        let botMessage;
        
        if (response.data.card) {
          console.log('Received navigation card response:', response.data.card);
          // Server sent a proper card object
          botMessage = {
            isUser: false,
            text: response.data.reply || '',
            card: response.data.card
          };
        } else if (response.data.guide) {
          console.log('Received step-by-step guide response:', response.data.guide);
          // Server sent a step-by-step guide
          botMessage = {
            isUser: false,
            text: response.data.reply || '',
            guide: response.data.guide
          };
        } else {
          console.log('Received text-only response, checking for embedded functions');
          // Try to extract function calls from text
          const processed = processRawFunctionCalls(response.data.reply || '');
          botMessage = {
            isUser: false,
            text: processed.text,
            card: processed.card,
            guide: processed.guide
          };
        }
        
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Error handling
      if (error.response && (error.response.status === 401 || error.response.data?.error?.includes('api key'))) {
        setApiKeyError('Your API key appears to be invalid. Please check and update it.');
        setShowApiKeyInput(true);
        setIsApiKeyValid(false);
        localStorage.removeItem('openai_api_key');
        setMessages(prev => [...prev, { 
          text: "Your OpenAI API key appears to be invalid. Please provide a valid API key to continue.", 
          isUser: false 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
          isUser: false 
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    
    if (!input.trim() || !isApiKeyValid) return;
    
    const userMessage = input;
    
    // Use the current intent from context
    console.log(`Submit button clicked with intent from context: ${intent}`);
    setInput('');
    
    // Use the explicit handleSubmitWithIntent function
    await handleSubmitWithIntent(userMessage, intent);
  };

  // Verify and save the API key
  const handleSaveApiKey = () => {
    if (!apiKey || apiKey.trim().length < 20) {
      setApiKeyError('Please enter a valid OpenAI API key');
      return;
    }
    
    // Basic validation (OpenAI keys start with "sk-" and are quite long)
    if (!apiKey.startsWith('sk-') || apiKey.length < 40) {
      setApiKeyError('This doesn\'t look like a valid OpenAI API key. Keys typically start with "sk-" and are at least 40 characters long.');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('openai_api_key', apiKey);
    setIsApiKeyValid(true);
    setShowApiKeyInput(false);
    setApiKeyError('');
    
    // Add system message and reset conversation
    setMessages([{ 
      text: "Thank you! Your API key has been saved. You can now use the chatbot. What would you like to know about our dashboard?", 
      isUser: false 
    }]);
  };

  // Reset API key
  const handleResetApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsApiKeyValid(false);
    setShowApiKeyInput(true);
    setMessages([]); // Clear message history
  };

  // Fix the setIsOpen reference in NavigationCard by creating a stable callback
  const handleCloseChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Floating chat button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Chat button with mint glow effect */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-eerie-black border-2 border-mint/20 overflow-hidden relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="absolute inset-0 opacity-0 bg-gradient-to-br from-mint/10 via-transparent to-mint/20"
              animate={{ 
                opacity: [0, 0.2, 0],
                rotate: [0, 360] 
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                ease: "linear" 
              }}
            />
            <img src={logo} alt="Logo" className="w-12 h-12 z-10 rounded-full" />
          </motion.button>
      </motion.div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-eerie-black rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ maxHeight: 'calc(100vh - 150px)' }}
          >
            <GlowingContainer>
              <div className="relative rounded-lg overflow-hidden bg-eerie-black">
                {/* Chat header */}
                <div className="flex items-center justify-between p-4 bg-eerie-black text-white font-thin">
                  <div className="flex items-center">
                    <img src={logo} alt="Logo" className="w-6 h-6 mr-2 rounded-full" />
                    <h3 className="font-thin">DataDash Assistant</h3>
                  </div>
                  <div className="flex items-center">
                    {isApiKeyValid && (
                      <button 
                        onClick={handleResetApiKey}
                        className="mr-2 p-1 rounded-full hover:bg-gray-800 transition-colors"
                        title="Change API Key"
                      >
                        <Lock size={16} className="text-mint" />
                      </button>
                    )}
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Intent selector - Make it more prominent as a tab system */}
                {isApiKeyValid && !showApiKeyInput && (
                  <div className="px-4 py-2 border-b border-gray-800">
                    <div className="flex space-x-2 justify-center">
                      <IntentButton 
                        active={isWhereIs} 
                        text="Where is" 
                        value="where_is"
                        onClick={setIntent} 
                      />
                      <IntentButton 
                        active={isHowDoI} 
                        text="How do I" 
                        value="how_do_i"
                        onClick={setIntent} 
                      />
                    </div>
                    <div className="mt-2 text-xs text-center text-gray-400 font-thin">
                      {isWhereIs 
                        ? "Ask about finding pages or features" 
                        : "Ask about how to perform specific tasks"}
                    </div>
                  </div>
                )}
                
                {/* API Key Input Form */}
                <AnimatePresence>
                  {showApiKeyInput && (
                    <motion.div
                      className="p-4 border-b border-gray-800 bg-eerie-black"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start mb-3">
                        <Info size={16} className="text-mint mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-300 font-thin">
                          To use this chatbot, you need to provide your own OpenAI API key. 
                          Your key is stored locally in your browser and sent directly to OpenAI.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="apiKey" className="block text-xs font-thin text-gray-300 mb-1">
                            OpenAI API Key
                          </label>
                          <input
                            type="password"
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                            className="w-full px-3 py-2 text-sm border border-mint/30 rounded-md focus:outline-none focus:ring-1 focus:ring-mint bg-eerie-black text-white font-thin"
                          />
                          {apiKeyError && (
                            <p className="mt-1 text-xs text-red-400 font-thin">{apiKeyError}</p>
                          )}
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={handleSaveApiKey}
                            className="px-3 py-1.5 text-sm bg-mint/80 text-eerie-black rounded-md hover:bg-mint transition-colors font-thin"
                          >
                            Save & Continue
                          </button>
                        </div>
                        
                        <p className="text-xs text-gray-400 font-thin">
                          Don't have an API key? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-mint hover:underline">Get one here</a>.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Chat messages area with updated message rendering */}
                <div 
                  ref={chatContainerRef}
                  className="flex-1 p-4 overflow-y-auto space-y-4 bg-eerie-black"
                  style={{ maxHeight: '350px' }}
                >
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-300 py-8">
                      <div className="mx-auto mb-2 flex justify-center">
                        <motion.div
                          className="w-10 h-10 rounded-full bg-mint/10 flex items-center justify-center"
                          animate={{ 
                            boxShadow: ['0 0 0 rgba(16, 185, 129, 0)', '0 0 15px rgba(16, 185, 129, 0.5)', '0 0 0 rgba(16, 185, 129, 0)']
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <MessageCircle className="text-mint" size={20} />
                        </motion.div>
                      </div>
                      <p className="font-thin mb-6">
                        {isApiKeyValid 
                          ? `Hi there! Ask me anything about the data dashboard using the ${isWhereIs ? '"Where is"' : '"How do I"'} format.`
                          : "Please provide your OpenAI API key to start chatting."}
                      </p>
                      
                      {/* Conversation starters */}
                      {isApiKeyValid && (
                        <div className="mt-4">
                          <p className="font-thin text-xs text-gray-400 mb-3">Try asking:</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {conversationStarters
                              .filter(starter => starter.intent === intent)
                              .map((starter, index) => (
                                <ConversationStarter 
                                  key={index} 
                                  text={starter.text} 
                                  onClick={() => handleStarterClick(starter)} 
                                />
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Existing messages rendering */}
                      {messages.map((msg, index) => (
                        <motion.div
                          key={index}
                          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div 
                            className={`max-w-[85%] rounded-lg px-4 py-2 ${
                              msg.isUser 
                                ? 'bg-mint/80 text-eerie-black rounded-br-none' 
                                : 'bg-eerie-black text-gray-200 rounded-bl-none border border-mint/30'
                            }`}
                          >
                            {msg.isUser 
                              ? <span className="font-thin">{msg.text}</span> 
                              : <MessageContent message={msg} setIsOpen={handleCloseChat} />
                            }
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Show conversation starters again if more than 4 messages */}
                      {messages.length > 0 && messages.length % 4 === 0 && !messages[messages.length - 1].isUser && !isLoading && (
                        <motion.div
                          className="mt-6 mb-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <p className="font-thin text-xs text-gray-400 mb-2 text-center">Ask something else:</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {conversationStarters
                              .filter(starter => starter.intent === intent)
                              .slice(0, 3)
                              .map((starter, index) => (
                                <ConversationStarter 
                                  key={index} 
                                  text={starter.text} 
                                  onClick={() => handleStarterClick(starter)} 
                                />
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                  
                  {/* Existing loading indicator */}
                  {isLoading && (
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="bg-eerie-black text-gray-200 rounded-lg px-4 py-2 rounded-bl-none border border-gray-800">
                        <div className="flex space-x-1">
                          <motion.div 
                            className="w-2 h-2 bg-mint/60 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-mint/60 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-mint/60 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Chat input area - redesigned */}
                <form 
                  onSubmit={handleSubmit}
                  className="border-t border-gray-800 p-3 bg-eerie-black"
                >
                  <div className="flex">
                    <div className="flex-1 relative">
                      {/* Active intent display */}
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <div className={`
                          text-xs font-semibold py-2 px-3 rounded-l-lg
                          ${isWhereIs 
                            ? 'bg-mint/90 text-black border-r border-mint' 
                            : 'bg-white text-black border-r border-gray-800'}
                        `}>
                          {isWhereIs ? 'Where is' : 'How do I'}
                        </div>
                      </div>
                      
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isApiKeyValid 
                          ? (isWhereIs ? "the search page?" : "find housing prices?") 
                          : "Enter your API key to start chatting"
                        }
                        className={`
                          flex-1 w-full py-2 pr-3 rounded-l-lg focus:outline-none 
                          border border-r-0 border-mint/30 bg-eerie-black text-white font-thin 
                          placeholder-gray-500 pl-[75px]
                        `}
                        disabled={!isApiKeyValid}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className={`${isApiKeyValid 
                        ? (isWhereIs ? 'bg-mint/80 hover:bg-mint' : 'bg-white hover:bg-blue-500') + ' text-eerie-black' 
                        : 'bg-gray-700 cursor-not-allowed text-gray-400'
                      } px-4 rounded-r-lg flex items-center justify-center`}
                      disabled={!input.trim() || isLoading || !isApiKeyValid}
                      whileHover={isApiKeyValid ? { scale: 1.05 } : {}}
                      whileTap={isApiKeyValid ? { scale: 0.95 } : {}}
                    >
                      <Send size={18} />
                    </motion.button>
                  </div>
                  
                  {/* Show what mode we're in - extra help text */}
                  <div className="mt-2 text-center">
                    <span className="text-xs text-gray-400">
                      Currently in <span className={isWhereIs ? "text-mint" : "text-blue-400"}>
                        {isWhereIs ? '"Where is"' : '"How do I"'}
                      </span> mode
                    </span>
                  </div>
                </form>
              </div>
            </GlowingContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default ChatBot; 