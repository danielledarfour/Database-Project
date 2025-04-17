import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import heroVideo from "../assets/hero_video.mp4";
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

const HeroPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [hoveredMember, setHoveredMember] = useState(null);

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      // Get the server URL from environment variables with fallback
      const serverBaseUrl =
        import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

      // Fallback data in case API request fails
      const fallbackData = [
        {
          name: "Sean Donovan",
          position: "Head of Frontend",
          bio: "Designs and builds user interfaces for the data dashboard",
          image: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          name: "Christian Ishimwe",
          position: "Backend Support",
          bio: "Develops complex cross-dataset queries",
          image: "https://randomuser.me/api/portraits/men/68.jpg",
        },
        {
          name: "Danielle Darfour",
          position: "Backend Support",
          bio: "Develops complex cross-dataset queries",
          image: "https://randomuser.me/api/portraits/women/68.jpg",
        },
        {
          name: "Rena Li",
          position: "Backend Support",
          bio: "Develops complex cross-dataset queries",
          image: "https://randomuser.me/api/portraits/women/68.jpg",
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
      icon: <BrainCircuit className="h-5 w-5" />,
      description: "Data correlation insights",
      color: "red",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="bg-eerie-black relative py-30 md:py-32 mb-[83px] mt-[83px] mouse-position-border">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left lg:col-span-2"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
                Uncover the stories behind crime and employment data
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto lg:mx-0">
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
              className="hidden lg:block lg:col-span-3"
            >
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="People analyzing data on screen"
                className="rounded-lg shadow-custom w-full h-auto"
              />
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

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card2
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

            <Card2
              title="USA Map Analytics Page"
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

            <Card2
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
           */}
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
              className={`min-w-full divide-y divide-gray-200 ${
                hoveredMember ? "w-3/4" : "w-full"
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
              <div className="bg-white shadow-card rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                  alt="Data analysis dashboard"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="max-w-6xl mx-auto relative mt-[100px] z-10">
        2{" "}
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
          ? `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${
              mousePosition.x * -10
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
        className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${
          isHovered ? "opacity-60" : ""
        }`}
        style={{
          background: `radial-gradient(circle at ${
            (mousePosition.x + 0.5) * 100
          }% ${(mousePosition.y + 0.5) * 100}%, rgba(${
            tech.color === "red" ? "255, 50, 50" : "50, 255, 100"
          }, 0.3) 0%, transparent 70%)`,
          transform: isHovered ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.3s ease-out",
        }}
      />

      <div
        className={`relative z-10 p-2 w-10 h-10 rounded-full bg-${tech.color}-900/20 mb-3 flex items-center justify-center`}
        style={{
          transform: isHovered
            ? `translateZ(20px) translateX(${
                mousePosition.x * 10
              }px) translateY(${mousePosition.y * 10}px)`
            : "translateZ(0)",
          transition: "transform 0.2s ease",
        }}
      >
        {tech.icon}
      </div>

      <h3
        className={`relative z-10 text-lg font-thin text-white mb-1 transition-colors duration-300 ${
          isHovered ? `text-${tech.color}-400` : ""
        }`}
        style={{
          transform: isHovered
            ? `translateZ(30px) translateX(${
                mousePosition.x * 5
              }px) translateY(${mousePosition.y * 5}px)`
            : "translateZ(0)",
          transition: "transform 0.2s ease, text-shadow 0.2s ease",
          textShadow: isHovered
            ? `0 0 15px rgba(${
                tech.color === "red" ? "255, 50, 50" : "50, 255, 100"
              }, 0.5)`
            : "none",
        }}
      >
        {tech.name}
      </h3>

      <p
        className="relative z-10 text-gray-500 text-xs"
        style={{
          transform: isHovered
            ? `translateZ(15px) translateX(${
                mousePosition.x * -3
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
          className={`text-xs transition-colors duration-300 ${
            isHovered ? `text-${tech.color}-400` : "text-white"
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

export default HeroPage;
