import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Card = ({ title, content, icon, linkText, linkTo, month, date, statValue, statLabel }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  
  // Handle 3D effect based on mouse position
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setCoords({ x, y });
  };
  
  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
    setCurrentCount(0);
  };
  
  // Animate counter when card is hovered
  useEffect(() => {
    if (!isHovered || !statValue) return;
    
    let start = 0;
    const end = parseInt(statValue);
    const duration = 1500;
    const increment = end / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      setCurrentCount(Math.min(Math.floor(start), end));
      
      if (start >= end) clearInterval(timer);
    }, 16);
    
    return () => clearInterval(timer);
  }, [isHovered, statValue]);

  return (
    <div
      ref={cardRef}
      className={`relative h-full overflow-hidden rounded-xl bg-eerie-black p-6 border border-green-700/20 transition-all duration-500 ${
        isHovered ? "shadow-xl shadow-green-700/10" : "shadow-md"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${coords.y * 10}deg) rotateY(${coords.x * -10}deg) scale3d(1.02, 1.02, 1.02)` 
          : "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
        transition: "transform 0.2s ease"
      }}
    >
      {/* Floating particles */}
      {isHovered && (
        <>
          <div className="particle-1"></div>
          <div className="particle-2"></div>
          <div className="particle-3"></div>
        </>
      )}
      
      {/* Glow effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-hunter-green/20 to-transparent rounded-xl opacity-0 transition-opacity duration-500 ${
          isHovered ? "opacity-40" : ""
        }`}
        style={{
          transform: isHovered 
            ? `translateX(${coords.x * 20}px) translateY(${coords.y * 20}px)` 
            : "translateX(0) translateY(0)",
          transition: "transform 0.2s ease"
        }}
      ></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Calendar badge */}
        <div className="flex justify-between items-start mb-6">
          <div 
            className="rounded-lg bg-gradient-to-br from-hunter-green to-hunter-green/70 p-2 text-white"
            style={{
              transform: isHovered 
                ? `translateX(${coords.x * -15}px) translateY(${coords.y * -15}px)` 
                : "translateX(0) translateY(0)",
              transition: "transform 0.3s ease"
            }}
          >
            <span className="block text-xs font-semibold">{month}</span>
            <span className="block text-2xl font-bold leading-none">{date}</span>
          </div>
          
          {/* Icon with parallax effect */}
          <div 
            className={`text-hunter-green transition-all duration-500 ${
              isHovered ? "scale-110" : ""
            }`}
            style={{
              transform: isHovered 
                ? `translateX(${coords.x * 20}px) translateY(${coords.y * 20}px)` 
                : "translateX(0) translateY(0)",
              transition: "transform 0.3s ease"
            }}
          >
            {icon}
          </div>
        </div>
        
        {/* Card content */}
        <div 
          className="flex-grow"
          style={{
            transform: isHovered 
              ? `translateX(${coords.x * -5}px) translateY(${coords.y * -5}px)` 
              : "translateX(0) translateY(0)",
            transition: "transform 0.3s ease"
          }}
        >
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 mb-4">{content}</p>
        </div>
        
        {/* Statistics counter */}
        {statValue && statLabel && (
          <div 
            className={`flex items-baseline mb-4 transition-all duration-500 ${
              isHovered ? "text-green-400" : "text-hunter-green"
            }`}
            style={{
              transform: isHovered 
                ? `translateX(${coords.x * -10}px) translateY(${coords.y * -10}px)` 
                : "translateX(0) translateY(0)",
              transition: "transform 0.3s ease"
            }}
          >
            <span className="text-2xl font-bold mr-1">
              {isHovered ? currentCount : "0"}
            </span>
            <span className="text-sm">{statLabel}</span>
          </div>
        )}
        
        {/* CTA Link */}
        {linkText && linkTo && (
          <Link 
            to={linkTo}
            className={`relative inline-flex items-center mt-auto font-medium transition-colors duration-300 ${
              isHovered ? "text-green-400" : "text-hunter-green"
            }`}
          >
            <span>{linkText}</span>
            {/* Animated underline */}
            <span 
              className="absolute bottom-0 left-0 h-0.5 bg-current transition-all duration-300"
              style={{ width: isHovered ? "100%" : "0" }}
            ></span>
          </Link>
        )}
      </div>
      
      {/* Pulsing background effect */}
      <div 
        className={`absolute inset-0 bg-hunter-green/5 rounded-xl transition-all duration-1000 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: isHovered ? "scale(1)" : "scale(0.8)",
          animation: isHovered ? "pulse 2s infinite" : "none"
        }}
      ></div>
    </div>
  );
}

const StyledWrapper = styled.div`
  .parent {
    width: 300px;
    height: 400px;
    padding: 20px;
    perspective: 1200px;
    transition: all 0.3s ease;
  }

  .card {
    padding-top: 30px;
    border: 2px solid rgba(16, 185, 129, 0.3); /* mint with transparency */
    transform-style: preserve-3d;
    background: linear-gradient(135deg, #0000 18.75%, #121212 0 31.25%, #0000 0),
        repeating-linear-gradient(45deg, #121212 -6.25% 6.25%, #1a1a1a 0 18.75%);
    background-size: 60px 60px;
    background-position: 0 0, 0 0;
    background-color: #121212; /* eerie-black */
    width: 100%;
    height: 100%;
    box-shadow: 
      rgba(0, 0, 0, 0.4) 0px 30px 30px -10px,
      ${props => props.$isHovered ? '0 0 30px rgba(16, 185, 129, 0.2)' : 'none'};
    transition: all 0.5s ease;
    position: relative;
    overflow: hidden;
    transform: 
      rotateY(${props => props.$mouseX * 20}deg) 
      rotateX(${props => -props.$mouseY * 20}deg)
      translateZ(10px);
  }
  
  .glow {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: radial-gradient(
      circle at ${props => (props.$mouseX + 0.5) * 100}% ${props => (props.$mouseY + 0.5) * 100}%,
      rgba(16, 185, 129, 0.4) 0%,
      transparent 50%
    );
    opacity: ${props => props.$isHovered ? 0.7 : 0};
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  /* Floating particles animation */
  .particles {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: rgba(16, 185, 129, 0.6);
    border-radius: 50%;
    transform: translateZ(30px);
    filter: blur(2px);
    opacity: 0;
  }

  .p1 {
    top: 20%;
    left: 20%;
    animation: ${props => props.$isHovered ? 'float1 5s ease-in-out infinite' : 'none'};
    animation-delay: 0.2s;
  }

  .p2 {
    top: 60%;
    left: 80%;
    animation: ${props => props.$isHovered ? 'float2 7s ease-in-out infinite' : 'none'};
    animation-delay: 0.5s;
  }

  .p3 {
    top: 80%;
    left: 10%;
    animation: ${props => props.$isHovered ? 'float3 6s ease-in-out infinite' : 'none'};
    animation-delay: 0.1s;
  }

  .p4 {
    top: 30%;
    left: 60%;
    animation: ${props => props.$isHovered ? 'float4 8s ease-in-out infinite' : 'none'};
    animation-delay: 0.7s;
  }

  @keyframes float1 {
    0% { transform: translate(0, 0) translateZ(30px); opacity: 0; }
    20% { opacity: 0.8; }
    100% { transform: translate(50px, -50px) translateZ(30px); opacity: 0; }
  }

  @keyframes float2 {
    0% { transform: translate(0, 0) translateZ(30px); opacity: 0; }
    20% { opacity: 0.6; }
    100% { transform: translate(-70px, -40px) translateZ(30px); opacity: 0; }
  }

  @keyframes float3 {
    0% { transform: translate(0, 0) translateZ(30px); opacity: 0; }
    20% { opacity: 0.7; }
    100% { transform: translate(40px, -60px) translateZ(30px); opacity: 0; }
  }

  @keyframes float4 {
    0% { transform: translate(0, 0) translateZ(30px); opacity: 0; }
    20% { opacity: 0.5; }
    100% { transform: translate(-50px, -70px) translateZ(30px); opacity: 0; }
  }

  .content-box {
    background: rgba(25, 93, 48, 0.9); /* hunter green with transparency */
    transition: all 0.5s ease;
    padding: 30px 25px 25px 25px;
    transform-style: preserve-3d;
    position: relative;
    height: calc(100% - 80px);
    display: flex;
    flex-direction: column;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 5px;
      height: 100%;
      background: #10b981; /* mint */
      transform: translateZ(10px);
    }
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
  }

  .content-box .card-title {
    display: inline-block;
    color: white;
    font-size: 22px;
    font-weight: 900;
    transition: all 0.5s ease;
    transform: translateZ(50px);
    text-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .stat-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    transform: translateZ(40px);
  }
  
  .stat-value {
    font-size: 28px;
    font-weight: 900;
    color: #10b981; /* mint */
    transition: all 0.5s ease;
  }
  
  .stat-label {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
  }

  .content-box .card-content {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 700;
    color: #f2f2f2;
    transition: all 0.5s ease;
    transform: translateZ(30px);
    flex-grow: 1;
    line-height: 1.6;
  }

  .see-more-link {
    text-decoration: none;
    margin-top: auto;
    transform-style: preserve-3d;
  }

  .content-box .see-more {
    cursor: pointer;
    display: inline-block;
    font-weight: 900;
    font-size: 10px;
    text-transform: uppercase;
    color: #ffffff;
    background: #10b981; /* mint */
    padding: 0.6rem 1rem;
    transition: all 0.3s ease;
    transform: translateZ(40px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
  }

  .content-box .see-more:hover {
    transform: translateZ(60px);
    background: #0d9668; /* darker mint */
  }
  
  .content-box .see-more::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%; 
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s ease;
  }
  
  .content-box .see-more:hover::before {
    left: 100%;
  }

  .date-box {
    position: absolute;
    top: 20px;
    right: 20px;
    height: 60px;
    width: 60px;
    background: #121212; /* eerie-black */
    border: 1px solid #10b981; /* mint */
    padding: 10px;
    transform: translateZ(80px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    transform-style: preserve-3d;
    z-index: 2;
  }
  
  .date-content {
    position: relative;
    z-index: 2;
  }

  .date-box span {
    display: block;
    text-align: center;
  }

  .date-box .month {
    color: #10b981; /* mint */
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .date-box .date {
    font-size: 20px;
    font-weight: 900;
    color: #ffffff;
  }
  
  .pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #10b981; /* mint */
    opacity: 0;
    z-index: 1;
    animation: ${props => props.$isHovered ? 'pulse 1.5s ease-in-out infinite' : 'none'};
  }
  
  @keyframes pulse {
    0% { opacity: 0; transform: scale(0.8); }
    50% { opacity: 0.3; }
    100% { opacity: 0; transform: scale(1.2); }
  }
`;

export default Card;
