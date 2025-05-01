import React, { useState } from "react";
import styled from "styled-components";

const Input = ({ onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <StyledWrapper $isFocused={isFocused}>
      <div>
        <div className="grid" />
        <div id="poda">
          <div className="glow" />
          <div className="darkBorderBg" />
          <div className="darkBorderBg" />
          <div className="darkBorderBg" />
          <div className="white" />
          <div className="border" />
          <div id="main">
            <input
              className="input"
              name="text"
              type="text"
              placeholder="Search..."
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <div id="pink-mask" />
            <div className="filterBorder" />
            <div id="filter-icon">
              <svg
                fill="none"
                viewBox="4.8 4.56 14.832 15.408"
                width={27}
                height={27}
                preserveAspectRatio="none"
              >
                <path
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeMiterlimit={10}
                  strokeWidth={1}
                  stroke="#d6d6e6"
                  d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z"
                />
              </svg>
            </div>
            <div id="search-icon">
              <svg
                className="feather feather-search"
                fill="none"
                height={24}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                width={24}
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx={11} cy={11} r={8} stroke="url(#search)" />
                <line
                  x1={22}
                  x2="16.65"
                  y1={22}
                  y2="16.65"
                  stroke="url(#searchl)"
                />
                <defs>
                  <linearGradient id="search" gradientTransform="rotate(50)">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="searchl">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#195d30" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

/*
  .grid {
    height: 800px;
    width: 800px;
    background-image: linear-gradient(
        to right,
        rgba(25, 93, 48, 0.3) 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, rgba(25, 93, 48, 0.3) 1px, transparent 1px);
    background-size: 1rem 1rem;
    background-position: center center;
    position: absolute;
    z-index: -1;
    filter: blur(1px);
  }
*/

const StyledWrapper = styled.div`


  .white,
  .border,
  .darkBorderBg,
  .glow {
    max-height: 70px;
    max-width: ${(props) => (props.$isFocused ? "614px" : "314px")};
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    z-index: -1;
    border-radius: 12px;
    filter: blur(3px);
    transition: max-width 0.6s ease-in-out;
  }

  .input {
    background-color: #121212; /* eerie-black */
    color: rgb(181, 255, 184); /* white text */
    border: none;
    width: ${(props) => (props.$isFocused ? "600px" : "301px")};
    height: 56px;
    border-radius: 10px;
    padding-inline: 59px;
    font-size: 18px;
    transition: width 0.6s ease-in-out;
  }

  #poda {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .input::placeholder {
    color: rgba(16, 185, 129, 0.6); /* mint with reduced opacity */
  }

  .input:focus {
    outline: none;
  }

  #main:focus-within > #input-mask {
    display: none;
  }

  #input-mask {
    pointer-events: none;
    width: 100px;
    height: 20px;
    position: absolute;
    background: linear-gradient(90deg, transparent, #121212);
    top: 18px;
    left: 70px;
  }

  #pink-mask {
    pointer-events: none;
    width: 30px;
    height: 20px;
    position: absolute;
    background: #10b981; /* mint */
    top: 10px;
    left: 5px;
    filter: blur(20px);
    opacity: 0.8;
    transition: all 2s;
  }

  #main:hover > #pink-mask {
    opacity: 0;
  }

  .white {
    max-height: 63px;
    max-width: ${(props) => (props.$isFocused ? "607px" : "307px")};
    border-radius: 10px;
    filter: blur(2px);
    transition: max-width 0.6s ease-in-out;
  }

  .white::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(83deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.4);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0) 0%,
      #10b981,
      /* mint */ rgba(0, 0, 0, 0) 8%,
      rgba(0, 0, 0, 0) 50%,
      #195d30,
      /* hunter green */ rgba(0, 0, 0, 0) 58%
    );
    transition: all 2s;
  }

  .border {
    max-height: 59px;
    max-width: ${(props) => (props.$isFocused ? "603px" : "303px")};
    border-radius: 11px;
    filter: blur(0.5px);
    transition: max-width 0.6s ease-in-out;
  }

  .border::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(70deg);
    position: absolute;
    width: 600px;
    height: 600px;
    filter: brightness(1.3);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #121212,
      /* eerie-black */ #10b981 5%,
      /* mint */ #121212 14%,
      /* eerie-black */ #121212 50%,
      /* eerie-black */ #195d30 60%,
      /* hunter green */ #121212 64% /* eerie-black */
    );
    transition: all 2s;
  }

  .darkBorderBg {
    max-height: 65px;
    max-width: ${(props) => (props.$isFocused ? "612px" : "312px")};
    transition: max-width 0.6s ease-in-out;
  }

  .darkBorderBg::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(82deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #10b981,
      /* mint */ rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 50%,
      #195d30,
      /* hunter green */ rgba(0, 0, 0, 0) 60%
    );
    transition: all 2s;
  }

  #poda:hover > .darkBorderBg::before,
  #poda:focus-within > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(262deg);
    transition: all 4s; /* Added transition for focus-within */
  }

  #poda:hover > .glow::before,
  #poda:focus-within > .glow::before {
    transform: translate(-50%, -50%) rotate(240deg);
    transition: all 4s; /* Added transition for focus-within */
  }

  #poda:hover > .white::before,
  #poda:focus-within > .white::before {
    transform: translate(-50%, -50%) rotate(263deg);
    transition: all 4s; /* Added transition for focus-within */
  }

  #poda:hover > .border::before,
  #poda:focus-within > .border::before {
    transform: translate(-50%, -50%) rotate(250deg);
    transition: all 4s; /* Added transition for focus-within */
  }

  .glow {
    overflow: hidden;
    filter: blur(30px);
    opacity: 0.4;
    max-height: 130px;
    max-width: ${(props) => (props.$isFocused ? "654px" : "354px")};
    transition: max-width 0.6s ease-in-out;
  }

  .glow::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(60deg);
    position: absolute;
    width: 999px;
    height: 999px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #000,
      #10b981 5%,
      /* mint */ #000 38%,
      #000 50%,
      #195d30 60%,
      /* hunter green */ #000 87%
    );
    transition: all 2s;
  }

  #filter-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    max-height: 40px;
    max-width: 38px;
    height: 100%;
    width: 100%;
    isolation: isolate;
    overflow: hidden;
    border-radius: 10px;
    background: linear-gradient(
      180deg,
      #195d30,
      #10b981,
      #195d30
    ); /* hunter green to mint gradient */
    border: 1px solid transparent;
  }

  .filterBorder {
    height: 42px;
    width: 40px;
    position: absolute;
    overflow: hidden;
    top: 7px;
    right: 7px;
    border-radius: 10px;
  }

  .filterBorder::before {
    content: "";
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.35);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #10b981,
      /* mint */ rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0) 50%,
      #195d30,
      /* hunter green */ rgba(0, 0, 0, 0) 100%
    );
    animation: rotate 4s linear infinite;
  }

  #main {
    position: relative;
  }

  #search-icon {
    position: absolute;
    left: 20px;
    top: 15px;
    color: rgb(255, 255, 255); /* mint */
  }

  @keyframes rotate {
    100% {
      transform: translate(-50%, -50%) rotate(450deg);
    }
  }
`;

export default Input;
