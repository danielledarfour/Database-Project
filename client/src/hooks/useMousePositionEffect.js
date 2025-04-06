import { useEffect } from 'react';

const useMousePositionEffect = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('.mouse-position-border');
    
    const handleMouseMove = (e) => {
      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      element.style.setProperty('--x', `${x}px`);
      element.style.setProperty('--y', `${y}px`);
      
      // Position the pseudo-element using custom properties
      const beforeElement = window.getComputedStyle(element, '::before');
      if (beforeElement) {
        element.style.setProperty('--mouse-x', `${x}px`);
        element.style.setProperty('--mouse-y', `${y}px`);
      }
    };
    
    elements.forEach(element => {
      element.addEventListener('mousemove', handleMouseMove);
    });
    
    return () => {
      elements.forEach(element => {
        element.removeEventListener('mousemove', handleMouseMove);
      });
    };
  }, []);
};

export default useMousePositionEffect; 