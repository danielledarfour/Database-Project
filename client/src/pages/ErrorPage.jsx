import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const catNames = [
  "Whiskers", "Mittens", "Luna", "Oliver", "Bella", "Leo", 
  "Simba", "Chloe", "Max", "Lucy", "Charlie", "Lily", 
  "Milo", "Kitty", "Shadow", "Cleo", "Felix", "Tiger", 
  "Oscar", "Daisy", "Jasper", "Sophie", "Smokey", "Nala"
];

// Free-to-use cat GIFs from GIPHY
const catGifs = [
  "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif", // Confused cat
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif", // Surprised cat
  "https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif", // Cat in box
  "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif", // Keyboard cat
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif", // Startled cat
  "https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif", // Floating space cat
  "https://media.giphy.com/media/BzyTuYCmvSORqs1ABM/giphy.gif", // Cat waving
  "https://media.giphy.com/media/33OrjzUFwkwEg/giphy.gif", // Computer cat
];

const ErrorPage = () => {
  const [catName, setCatName] = useState('');
  const [catGif, setCatGif] = useState('');

  useEffect(() => {
    // Select random cat name and gif when component mounts
    const randomName = catNames[Math.floor(Math.random() * catNames.length)];
    const randomGif = catGifs[Math.floor(Math.random() * catGifs.length)];
    
    setCatName(randomName);
    setCatGif(randomGif);
  }, []);

  return (
    <div className="min-h-screen bg-eerie-black/5 flex flex-col items-center justify-center p-4">
      <motion.div 
        className="max-w-lg w-full bg-eerie-black/70 backdrop-blur-md p-8 rounded-xl shadow-lg text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-2 text-white">404 Error</h1>
        <h2 className="text-2xl font-bold mb-6 text-white">
          Meow No, it seems you are lost 😭
        </h2>
        
        <div className="mb-6 rounded-lg shadow-inner">
          {catGif && (
            <motion.img 
              src={catGif} 
              alt={`${catName} the cat`} 
              className="w-full h-64 object-cover rounded-lg mx-auto"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
        
        <p className="text-lg text-white/80 mb-8">
          <span className="font-bold">{catName}</span> says the page you're looking for doesn't exist or has moved to a new location.
        </p>
        
        <Link 
          to="/" 
          className="bg-mint hover:bg-mint/90 text-white text-base px-8 py-3 rounded-md shadow-sm transition-colors inline-flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back home
        </Link>
        
        <div className="mt-8 text-sm text-white/80">
          <p>Feline lost? Need a helping paw? Try using the meow-vigation menu at the top of the page.</p>
        </div>
      </motion.div>
      
      <div className="mt-8 text-center text-sm text-white/80">
        <p>You encountered {catName} the cat - Error Assistant</p>
      </div>
    </div>
  );
};

export default ErrorPage; 