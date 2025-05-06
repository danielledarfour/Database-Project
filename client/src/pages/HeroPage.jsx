import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import Card from "../ui/Card";
import Card2 from "../ui/Card2";
import {
  Code,
  BrainCircuit,
  Cpu,
  Database,
  Sparkles,
  Layers,
  BarChart2,
  MapPin,
  Cloud,
  Network,
  AlignLeft,
  ArrowUpRightFromCircle,
  ArrowDownAzIcon,
  LucideArrowDownLeftFromCircle,
  GitPullRequestCreateArrow,
  ArrowLeftSquare,
  ArrowUpFromDotIcon,
  ArrowUpLeft,
  SquareArrowUpRightIcon,
  CircleArrowOutUpRightIcon,
  ArrowUpRight,
  ArrowLeftFromLine,
  ArrowRightFromLine,
} from "lucide-react";
import styled from "styled-components";
import { OpenAI } from "@lobehub/icons";
import people from "../assets/Greenpeople.jpeg";

import rena from "../assets/rena.jpg";
import christian from "../assets/chris.jpg";
import sean from "../assets/sean.png";
import danielle from "../assets/danielle3.jpg";

import video1 from "../assets/videoOne.gif";
import video2 from "../assets/videoTwo.gif";
import video3 from "../assets/videoThree.gif";
import heroImage from "../assets/heropage.png";

const StyledWrapper = styled.div`
  .video-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 8px;
  }

  .video-glow,
  .video-border-layer,
  .video-white-layer,
  .video-border-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    z-index: 1;
  }

  .video-glow {
    filter: blur(30px);
    opacity: 0.4;
    z-index: 1;
  }

  .video-glow::before {
    content: "";
    z-index: 1;
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
      #000 38%,
      #000 50%,
      #195d30 60%,
      #000 87%
    );
    transition: all 2s;
  }

  .video-white-layer {
    border-radius: 10px;
    filter: blur(2px);
    z-index: 2;
  }

  .video-white-layer::before {
    content: "";
    z-index: 2;
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
      rgba(0, 0, 0, 0) 8%,
      rgba(0, 0, 0, 0) 50%,
      #195d30,
      rgba(0, 0, 0, 0) 58%
    );
    transition: all 2s;
  }

  .video-border-layer {
    border-radius: 11px;
    filter: blur(0.5px);
    z-index: 3;
  }

  .video-border-layer::before {
    content: "";
    z-index: 3;
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
      #10b981 5%,
      #121212 14%,
      #121212 50%,
      #195d30 60%,
      #121212 64%
    );
    transition: all 2s;
  }

  .video-border-bg {
    z-index: 4;
  }

  .video-border-bg::before {
    content: "";
    z-index: 4;
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
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 50%,
      #195d30,
      rgba(0, 0, 0, 0) 60%
    );
    transition: all 2s;
  }

  .video-container:hover .video-border-bg::before {
    transform: translate(-50%, -50%) rotate(262deg);
    transition: all 4s;
  }

  .video-container:hover .video-glow::before {
    transform: translate(-50%, -50%) rotate(240deg);
    transition: all 4s;
  }

  .video-container:hover .video-white-layer::before {
    transform: translate(-50%, -50%) rotate(263deg);
    transition: all 4s;
  }

  .video-container:hover .video-border-layer::before {
    transform: translate(-50%, -50%) rotate(250deg);
    transition: all 4s;
  }
`;

const HeroPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [hoveredMember, setHoveredMember] = useState(null);
  let prevHeroImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      // Get the server URL from environment variables with fallback
      const serverBaseUrl =
        import.meta.env.VITE_SERVER_URL.replace("/api", "") || "http://localhost:5000";

      // Fallback data in case API request fails
      const fallbackData = [
        {
          name: "Sean Donovan",
          position: "Head of Frontend",
          bio: "Designs and builds user interfaces for the data dashboard",
          image: sean,
        },
        {
          name: "Christian Ishimwe",
          position: "Backend Support",
          bio: "Develops complex cross-dataset queries",
          image: christian,
        },
        {
          name: "Danielle Darfour",
          position: "Backend Support",
          bio: "Develops complex cross-dataset queries",
          image: danielle,
        },
        {
          name: "Rena Li",
          position: "Backend Support",
          bio: "Develops complex cross-dataset queries",
          image: rena,
        },
      ];

      try {
        console.log(
          `Fetching team members from ${serverBaseUrl}/api/team-members`
        );
        const response = await fetch(`${serverBaseUrl}/api/team-members`, {
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data);
          console.log("Successfully fetched team members");
        } else {
          throw new Error("API response not OK");
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        // Use fallback data if API request fails
        setTeamMembers(fallbackData);
      }
    };

    fetchTeamMembers();
  }, []);

  const techStack = [
    {
      name: "React",
      icon: <Code className="h-5 w-5" />,
      description: "Interactive UI components",
      color: "red",
    },
    {
      name: "Tailwind CSS",
      icon: <Layers className="h-5 w-5" />,
      description: "Responsive dark theme",
      color: "green",
    },
    {
      name: "Google Maps API",
      icon: <MapPin className="h-5 w-5" />,
      description: "Interactive state mapping",
      color: "red",
    },
    {
      name: "PostgreSQL",
      icon: <Database className="h-5 w-5" />,
      description: "Crime & employment data storage",
      color: "green",
    },
    {
      name: "Node.js",
      icon: <Cpu className="h-5 w-5" />,
      description: "API & data processing",
      color: "green",
    },
    {
      name: "AWS RDS",
      icon: <Cloud className="h-5 w-5" />,
      description: "Database hosting",
      color: "red",
    },
    {
      name: "D3.js",
      icon: <BarChart2 className="h-5 w-5" />,
      description: "Statistical visualizations",
      color: "green",
    },
    {
      name: "OpenAI",
      icon: <OpenAI className="h-5 w-5" />,
      description: "Data correlation insights",
      color: "red",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-eerie-black relative py-[82px] md:py-[140px]  mouse-position-border">
          <div className="container-custom mx-auto px-4 md:px-3">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left lg:col-span-2"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                  Leverage data to make informed decisions on housing, crime, & employment
                </h1>
                <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0">
                  Explore how crime rates and employment trends intertwine in U.S.
                  cities. Our platform provides clear insights for policy makers
                  and urban planners.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/dashboard"
                    className="bg-mint/40  inline-flex items-center hover:bg-mint/90 text-white text-base px-8 py-3 rounded-md shadow-sm transition-colors"
                  >
                    Gain insights <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    to="/search"
                    className="border-2 inline-flex items-center  border-mint/30 bg-transparent hover:bg-mint/10 text-white text-base px-8 py-3 rounded-md transition-colors"
                  >
                    Begin your journey
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden lg:block lg:col-span-3 relative"
              >
                <div className="hero-container relative ">
                  <div className="hero-glow-border relative">
                    <div className="hero-glow-effect"></div>
                    <div className="hero-border-bg"></div>
                    <div className="hero-white-layer"></div>
                    <div className="hero-border-layer"></div>
                    <img
                      src={heroImage}
                      alt="People analyzing data on screen"
                      className="rounded-lg  shadow-custom relative z-10 md:h-[450px] md:w-[1080px] lg:h-[450px] lg:w-[1080px]"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16 md:py-24">
          <div className="container-custom mx-auto px-4 md:px-8">
            <div className="flex justify-center">
              <div className="inline-flex items-center px-4 py-1 mb-[40px] glow-border-white rounded-full bg-eerie-black text-white text-sm mb-4">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Our Features</span>
              </div>
            </div>

            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-eerie-black mb-4">
                Uncover the link between crime and jobs
              </h2>
              <p className="text-lg text-eerie-black/70 max-w-3xl mx-auto">
                Explore how crime rates and employment trends intertwine in U.S.
                cities. Our platform provides clear insights for policy makers and
                urban planners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card
                title="Dynamic data boards"
                content="Visualize data effortlessly to spot trends and connections in crime and employment statistics."
                linkText="See it now →"
                linkTo="/dashboard"
                month="DATA"
                date="01"
                statValue={85}
                statLabel="% accuracy"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
              />

              <Card
                title="USA Map Analytics"
                content="Explore data through an interactive map of the United States with detailed state-by-state breakdowns."
                linkText="View the map →"
                linkTo="/map"
                month="MAP"
                date="02"
                statValue={50}
                statLabel="states"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                }
              />

              <Card
                title="Advanced search tools"
                content="Quickly find data by state, year, crime type, and job sector to gain valuable insights."
                linkText="Search now →"
                linkTo="/search"
                month="FIND"
                date="03"
                statValue={500}
                statLabel="K rows"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </div>

            {/*
            ** This is the video demo section - StateHousePrices Showcase
            */}

            <div className="mt-32 mb-24 relative bg-white">
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[10%] -right-[5%] w-[30%] h-[30%] bg-eerie-black/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[5%] -left-[5%] w-[25%] h-[25%] bg-eerie-black/5 blur-[120px] rounded-full"></div>
              </div>

              <div className="relative z-10 container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  {/* Marketing content */}
                  <div className="lg:w-[40%] space-y-8">
                    <h2 className="text-3xl md:text-4xl font-heading font-extralight text-eerie-black mb-4 leading-tight">
                      Advanced Search Tools At Your<span className="text-green-700"> Fingertips</span>
                    </h2>

                    <p className="text-eerie-black text-lg font-light">
                      Analyze crime patterns, job market trends, and housing costs in <span className="font-medium text-green-700">seconds.</span>
                    </p>

                    {/* Animated stats */}
                    <div className="grid grid-cols-2 gap-6">
                      <motion.div
                        className="bg-white border border-eerie-black/10 rounded-lg p-5 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-green-700 text-sm uppercase tracking-wider mb-1 font-extralight">Complex Queries</p>
                        <motion.div
                          className="text-eerie-black text-3xl font-bold"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4, type: "spring" }}
                        >
                          5+
                        </motion.div>
                        <span className="text-eerie-black/50 text-sm font-thin">Complexity Simplified</span>
                      </motion.div>

                      <motion.div
                        className="bg-white border border-eerie-black/10 rounded-lg p-5 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                      >
                        <p className="text-green-700 text-sm uppercase tracking-wider mb-1 font-extralight">Search Speed</p>
                        <motion.div
                          className="text-3xl font-bold"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          <CountdownNumber
                            start={10000}
                            end={15}
                            duration={3.0}
                            suffix=" ms"
                            thresholds={{ 200: "text-green-700" }}
                            initialColor="text-red-500"
                          />
                        </motion.div>
                        <span className="text-eerie-black/50 text-sm font-thin">Optimized for speed</span>
                      </motion.div>
                    </div>

                    {/* Feature highlights */}
                    <ul className="space-y-4">
                      <motion.li /* Crime mapping */
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="text-mint bg-mint/10 p-1 rounded-full mt-0.5">
                          {/* Check icon */}
                        </div>
                        <div>
                          <p className="text-eerie-black font-medium">Visualize Crime Density</p>
                          <p className="text-eerie-black/60 text-sm">Filter incidents by type, date, and severity</p>
                        </div>
                      </motion.li>

                      <motion.li /* Employment insights */
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                      >
                        <div className="text-mint bg-mint/10 p-1 rounded-full mt-0.5">
                          {/* Check icon */}
                        </div>
                        <div>
                          <p className="text-eerie-black font-medium">Compare Job Growth</p>
                          <p className="text-eerie-black/60 text-sm">Identify industries expanding fastest near you</p>
                        </div>
                      </motion.li>

                      <motion.li /* Housing costs */
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className="text-mint bg-mint/10 p-1 rounded-full mt-0.5">
                          {/* Check icon */}
                        </div>
                        <div>
                          <p className="text-eerie-black font-medium">Analyze Rental Trends</p>
                          <p className="text-eerie-black/60 text-sm">See median rents vs. local income levels</p>
                        </div>
                      </motion.li>
                    </ul>
                  </div>


                  {/* Video showcase with enhanced styling */}
                  <motion.div
                    className="lg:w-[60%]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <div className="relative video-container">
                      {/* Video border layers */}
                      <div className="video-glow"></div>
                      <div className="video-border-bg"></div>
                      <div className="video-white-layer"></div>
                      <div className="video-border-layer"></div>

                      {/* Main image */}
                      <img
                        src={video1}
                        alt="Interactive Housing Data Explorer"
                        className="w-full h-auto rounded-lg relative z-10 transform hover:scale-[1.01] transition-all duration-700"
                      />

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <Link to="/search">
                          <motion.div
                            className="w-16 h-16 rounded-full bg-mint flex items-center justify-center cursor-pointer shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0.9 }}
                            animate={{
                              opacity: [0.9, 1, 0.9],
                              scale: [1, 1.05, 1],
                              boxShadow: [
                                '0 0 0 0 rgba(122,220,180,0.7)',
                                '0 0 0 10px rgba(122,220,180,0)',
                                '0 0 0 0 rgba(122,220,180,0)'
                              ]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2.5
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-eerie-black" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        </Link>
                      </div>
                    </div>

                    {/* Caption under the video */}
                    <div className="mt-4 text-center">
                      <p className="text-eerie-black/70 text-sm">
                        <span className="font-medium text-mint">New:</span> Interactive housing price comparisons across multiple cities
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/*
            ** This is the second image section - HousingQuestion Showcase
            */}

            <div className="mt-32 mb-24 relative bg-white">
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[5%] -left-[5%] w-[30%] h-[30%] bg-eerie-black/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[10%] -right-[5%] w-[25%] h-[25%] bg-eerie-black/5 blur-[120px] rounded-full"></div>
              </div>

              <div className="relative z-10 container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  {/* Video showcase with enhanced styling - LEFT SIDE */}
                  <motion.div
                    className="lg:w-[55%]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <div className="relative video-container">
                      {/* Video border layers */}
                      <div className="video-glow"></div>
                      <div className="video-border-bg"></div>
                      <div className="video-white-layer"></div>
                      <div className="video-border-layer"></div>

                      <img
                        src={video2}
                        alt="Interactive Housing Price Analysis Tool"
                        className="rounded-lg relative z-10 w-full h-auto object-cover"
                      />

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <Link to="/search">
                          <motion.div
                            className="w-16 h-16 rounded-full bg-mint flex items-center justify-center cursor-pointer shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0.9 }}
                            animate={{
                              opacity: [0.9, 1, 0.9],
                              scale: [1, 1.05, 1],
                              boxShadow: [
                                '0 0 0 0 rgba(122,220,180,0.7)',
                                '0 0 0 10px rgba(122,220,180,0)',
                                '0 0 0 0 rgba(122,220,180,0)'
                              ]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2.5
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-eerie-black" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        </Link>
                      </div>
                    </div>

                    {/* Caption under the video */}
                    <div className="mt-4 text-center">
                      <p className="text-eerie-black/70 text-sm">
                        <span className="font-medium text-mint">Real-time demo:</span> Explore housing prices across cities and states
                      </p>
                    </div>
                  </motion.div>

                  {/* Marketing content - RIGHT SIDE */}
                  <div className="lg:w-[45%] space-y-8">
                    <h2 className="text-3xl md:text-4xl font-heading font-extralight text-eerie-black mb-4 leading-tight">
                      Make <span className="text-green-700">Data-Driven</span> Real Estate Decisions
                    </h2>

                    <p className="text-eerie-black text-lg font-light">
                      Analyze 100K+ property transactions on interactive maps to uncover <span className="font-medium text-green-700">under-valued markets.</span>
                    </p>

                    {/* Feature highlights */}
                    <ul className="space-y-4">
                      <motion.li
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="text-green-700 bg-green-700/10 p-1 rounded-full mt-0.5">
                          {/* Map Pin Icon */}
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-eerie-black font-medium">Interactive Map Integration</p>
                          <p className="text-eerie-black/60 text-sm">Explore sale vs. listing prices by neighborhood</p>
                        </div>
                      </motion.li>

                      <motion.li
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                      >
                        <div className="text-green-700 bg-green-700/10 p-1 rounded-full mt-0.5">
                          {/* Lightbulb Icon */}
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-eerie-black font-medium">Smart Area Comparisons</p>
                          <p className="text-eerie-black/60 text-sm">Automatically surface similar markets for better deals</p>
                        </div>
                      </motion.li>

                      <motion.li
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className="text-green-700 bg-green-700/10 p-1 rounded-full mt-0.5">
                          {/* Chart Icon */}
                          <BarChart2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-eerie-black font-medium">Visual Price Analysis</p>
                          <p className="text-eerie-black/60 text-sm">Interactive charts reveal pricing trends and disparities</p>
                        </div>
                      </motion.li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>

            {/*
            ** This is the third image section - Meet the Team
            */}

            <div className="mt-32 mb-24 relative bg-white">
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[5%] -left-[5%] w-[30%] h-[30%] bg-mint/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[10%] -right-[5%] w-[25%] h-[25%] bg-mint/5 blur-[120px] rounded-full"></div>
              </div>

              <div className="relative z-10 container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  {/* Left side: Marketing copy */}
                  <div className="lg:w-[45%] space-y-8">
                    <h2 className="text-3xl md:text-4xl font-heading font-extralight text-eerie-black mb-4 leading-tight">
                      Less Clicking, More <span className="text-green-700">Doing</span>
                    </h2>

                    <p className="text-eerie-black text-lg font-light">
                      Get instant answers to your questions with your own personal AI-powered assistant using state-of-the-art <span className="font-medium text-green-700">intelligent intent recognition.</span>
                    </p>

                    {/* Pain-point–focused feature highlights */}
                    <ul className="space-y-4">
                      <motion.li
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="text-green-700 bg-green-700/10 p-1 rounded-full mt-0.5">
                          <Network className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-eerie-black font-medium">Instant Page Locator</p>
                          <p className="text-eerie-black/60 text-sm">“Show me the documentation page” and it appears with one click.</p>
                        </div>
                      </motion.li>

                      <motion.li
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                      >
                        <div className="text-green-700 bg-green-700/10 p-1 rounded-full mt-0.5">
                          <BrainCircuit className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-eerie-black font-medium">Natural-Language Guidance</p>
                          <p className="text-eerie-black/60 text-sm">Ask “How do I find the cost of living in California?” and get instant help.</p>
                        </div>
                      </motion.li>

                      <motion.li
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className="text-green-700 bg-green-700/10 p-1 rounded-full mt-0.5">
                          <OpenAI className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-eerie-black font-medium">Adaptive Context Memory</p>
                          <p className="text-eerie-black/60 text-sm">Remembers your interactions, so you never repeat yourself.</p>
                        </div>
                      </motion.li>
                    </ul>

                    {/* CTA for mobile */}
                    <div className="block lg:hidden">
                      <button
                        onClick={() => document.dispatchEvent(new CustomEvent('toggleChatbot'))}
                        className="w-full bg-green-700 hover:bg-green-700/90 text-white py-3 px-6 rounded-lg flex items-center justify-center"
                      >
                        Get Unstuck Now
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right side: Video showcase */}
                  <motion.div
                    className="lg:w-[55%]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <div className="relative video-container">
                      {/* Video border and glow layers */}
                      <div className="video-glow"></div>
                      <div className="video-border-bg"></div>
                      <div className="video-white-layer"></div>
                      <div className="video-border-layer"></div>

                      <img
                        src={video3}
                        alt="AI Assistant Demo"
                        className="rounded-lg relative z-10 w-full object-cover"
                      />

                      {/* “Try it!” button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <button
                          onClick={() => document.dispatchEvent(new CustomEvent('toggleChatbot'))}
                          className="relative group"
                        >
                          <motion.div
                            className="w-24 h-24 rounded-full bg-mint/90 flex items-center justify-center cursor-pointer shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0.9 }}
                            animate={{
                              opacity: [0.9, 1, 0.9],
                              scale: [1, 1.05, 1],
                              boxShadow: [
                                '0 0 0 0 rgba(16,185,129,0.7)',
                                '0 0 0 15px rgba(16,185,129,0)',
                                '0 0 0 0 rgba(16,185,129,0)',
                              ],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2.5,
                            }}
                          >
                            <span className="text-eerie-black font-bold text-lg">Try it!</span>
                          </motion.div>
                          <motion.div
                            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-eerie-black text-white px-4 py-1 rounded-full text-sm whitespace-nowrap"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                          >
                            Click to launch chatbot
                          </motion.div>
                        </button>
                      </div>
                    </div>

                    {/* Video caption */}
                    <div className="mt-4 text-center">
                      <p className="text-eerie-black/70 text-sm">
                        <span className="font-medium text-green-700">New Feature:</span> AI-powered chatbot for an enhanced user experience
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>



          </div>
        </div>

        {/* Meet the Team Section */}
        <div className="bg-gray-50 py-16 md:py-24">
          <div className="container-custom mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-eerie-black mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-eerie-black/70 max-w-3xl mx-auto">
                Our dedicated specialists work tirelessly to bring you the most
                comprehensive crime and employment data analysis.
              </p>
            </div>

            <div className="relative overflow-hidden bg-white shadow-md rounded-lg">
              {hoveredMember && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 top-0 h-full w-1/4 border-l border-gray-200 p-4 bg-white"
                >
                  <img
                    src={hoveredMember.image}
                    alt={hoveredMember.name}
                    className="w-full h-64 object-cover rounded-lg shadow-sm mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {hoveredMember.name}
                  </h3>
                  <p className="text-eerie-black text-sm font-medium mb-2">
                    {hoveredMember.position}
                  </p>
                  <p className="text-gray-600 text-sm">{hoveredMember.bio}</p>
                </motion.div>
              )}

              <table
                className={`min-w-full divide-y divide-gray-200 ${hoveredMember ? "w-3/4" : "w-full"
                  }`}
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Position
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((member, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onMouseEnter={() => setHoveredMember(member)}
                      onMouseLeave={() => setHoveredMember(null)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {member.position}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Data Section */}
        <div className="bg-white py-16 md:py-24">
          <div className="container-custom mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-eerie-black mb-6">
                  Gain Insights on Crime and Employment
                </h2>
                <p className="text-lg text-eerie-black/70 mb-8">
                  Explore the dynamic relationship between crime rates and
                  employment trends across the U.S. Our platform provides
                  user-friendly tools to help you identify significant patterns
                  and connections.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/dashboard"
                    className="bg-eerie-black inline-flex items-center hover:bg-eerie-black/90 text-white text-base px-8 py-3 rounded-md shadow-sm transition-colors"
                  >
                    Start Now <ArrowUpRightFromCircle className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    to="/about"
                    className="border-2 inline-flex items-center border-mint/30 bg-transparent hover:bg-mint/10 text-eerie-black text-base px-8 py-3 rounded-md transition-colors"
                  >
                    Find Out More
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white shadow-card rounded-xl">
                  <img
                    src={people}
                    alt="Data analysis dashboard"
                    className="w-full h-auto b-shadow"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="bg-eerie-black py-16 md:py-24">
          <div className="max-w-6xl mx-auto relative mt-[100px] z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center px-4 py-1 mb-[40px] glow-border-white rounded-full bg-white/90 text-eerie-black text-sm mb-4">
                <Cpu className="mr-2 h-4 w-4" />
                <span>Our Tech Stack</span>
              </div>

              <h2 className="text-3xl font-thin mb-4 text-white tracking-tight">
                Built with Cutting-Edge Technology
              </h2>
              <p className="text-white font-extralight max-w-2xl mx-auto">
                Our application leverages the latest advanced technologies to create
                a powerful, responsive, and intelligent platform.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 mb-[100px] gap-4">
              {techStack.map((tech, index) => (
                <TechCard key={index} tech={tech} index={index} />
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

const TechCard = ({ tech, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`relative overflow-hidden bg-eerie-black rounded-xl p-4 border border-tech-stack hover:border-${tech.color}-500/30 transition-all duration-300 group`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * -10
          }deg) scale3d(1.02, 1.02, 1.02)`
          : "perspective(1000px) rotateX(0) rotateY(0)",
        transition: "transform 0.2s ease",
      }}
      whileHover={{ scale: 1.02, y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
    >
      {/* Dynamic glow effect */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${isHovered ? "opacity-60" : ""
          }`}
        style={{
          background: `radial-gradient(circle at ${(mousePosition.x + 0.5) * 100
            }% ${(mousePosition.y + 0.5) * 100}%, rgba(${tech.color === "red" ? "255, 50, 50" : "50, 255, 100"
            }, 0.3) 0%, transparent 70%)`,
          transform: isHovered ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.3s ease-out",
        }}
      />

      <div
        className={`relative z-10 p-2 w-10 h-10 rounded-full bg-${tech.color}-900/20 mb-3 flex items-center justify-center`}
        style={{
          transform: isHovered
            ? `translateZ(20px) translateX(${mousePosition.x * 10
            }px) translateY(${mousePosition.y * 10}px)`
            : "translateZ(0)",
          transition: "transform 0.2s ease",
        }}
      >
        {tech.icon}
      </div>

      <h3
        className={`relative z-10 text-lg font-thin text-white mb-1 transition-colors duration-300 ${isHovered ? `text-${tech.color}-400` : ""
          }`}
        style={{
          transform: isHovered
            ? `translateZ(30px) translateX(${mousePosition.x * 5
            }px) translateY(${mousePosition.y * 5}px)`
            : "translateZ(0)",
          transition: "transform 0.2s ease, text-shadow 0.2s ease",
          textShadow: isHovered
            ? `0 0 15px rgba(${tech.color === "red" ? "255, 50, 50" : "50, 255, 100"
            }, 0.5)`
            : "none",
        }}
      >
        {tech.name}
      </h3>

      <p
        className="relative z-10 text-slate=700 text-xs"
        style={{
          transform: isHovered
            ? `translateZ(15px) translateX(${mousePosition.x * -3
            }px) translateY(${mousePosition.y * -3}px)`
            : "translateZ(0)",
          transition: "transform 0.2s ease",
        }}
      >
        {tech.description}
      </p>

      <div
        className="relative z-10 mt-3 pt-2 border-t border-zinc-800 flex justify-between items-center"
        style={{
          transform: isHovered ? `translateZ(10px)` : "translateZ(0)",
          transition: "transform 0.2s ease",
        }}
      >
        <div className="flex space-x-1">
          <motion.div
            className={`w-1 h-1 rounded-full bg-${tech.color}-400`}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, delay: 0.1, repeat: Infinity }}
          />
          <motion.div
            className={`w-1 h-1 rounded-full bg-${tech.color}-400`}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
          />
          <motion.div
            className={`w-1 h-1 rounded-full bg-${tech.color}-400`}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, delay: 0.3, repeat: Infinity }}
          />
        </div>

        <div
          className={`text-xs transition-colors duration-300 ${isHovered ? `text-${tech.color}-400` : "text-white"
            } group-hover:text-gray-400`}
        >
          <Network className="h-3 w-3" />
        </div>
      </div>

      {/* Animated particles */}
      {isHovered && (
        <>
          <FloatingParticle
            className={`bg-${tech.color}-500/20 top-[20%] left-[20%]`}
            $mx={mousePosition.x}
            $my={mousePosition.y}
            $delay="0.1s"
            $duration="3s"
          />
          <FloatingParticle
            className={`bg-${tech.color}-500/20 bottom-[30%] right-[20%]`}
            $mx={mousePosition.x}
            $my={mousePosition.y}
            $delay="0.5s"
            $duration="4s"
          />
        </>
      )}
    </motion.div>
  );
};

const FloatingParticle = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: floatAnim ${(props) => props.$duration} ease-in-out infinite;
  animation-delay: ${(props) => props.$delay};

  @keyframes floatAnim {
    0% {
      transform: translate(0, 0);
      opacity: 0;
    }
    25% {
      opacity: 1;
    }
    75% {
      opacity: 1;
    }
    100% {
      transform: translate(
        ${(props) => props.$mx * 30}px,
        ${(props) => props.$my * 30}px
      );
      opacity: 0;
    }
  }
`;

const CountdownNumber = ({ start, end, duration, suffix = "", thresholds = {}, initialColor = "" }) => {
  const countRef = useRef(useMotionValue(start));
  const [textColor, setTextColor] = useState(initialColor);
  const elementRef = useRef(null);
  const isInView = useInView(elementRef, { once: true, amount: 0.5 });

  // Format the number with suffix
  const formattedNumber = useTransform(countRef.current, (latest) => {
    return `${Math.floor(latest)}${suffix}`;
  });

  useEffect(() => {
    // Only start animation when in view
    if (!isInView) return;

    // Check if we should change color based on thresholds
    const updateColor = (latest) => {
      const currentCount = Math.floor(latest);
      const thresholdKeys = Object.keys(thresholds).map(Number).sort((a, b) => b - a);

      for (const threshold of thresholdKeys) {
        if (currentCount <= threshold) {
          setTextColor(thresholds[threshold]);
          break;
        }
      }
    };

    // Add event listener to monitor value changes
    const unsubscribe = countRef.current.on("change", updateColor);

    // Start the animation
    const controls = animate(countRef.current, end, {
      duration: duration,
      ease: "easeOut",
      onComplete: () => {
        // Ensure we set final color
        updateColor(end);
      }
    });

    // Cleanup
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [isInView, start, end, duration, thresholds]);

  return (
    <motion.span ref={elementRef} className={textColor}>
      {formattedNumber}
    </motion.span>
  );
};

export default HeroPage;
