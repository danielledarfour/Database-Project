import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Toast notification handler
  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  const navLinks = [
    {
      path: "/",
      label: "Discover",
      hasDropdown: true,
      mega: true,
      dropdownItems: [
        {
          label: "Search & Filter",
          description: "Filter by states, years, crime types, and job sectors",
          icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
          path: "/search",
        },
        {
          label: "Statistics Dashboard",
          description: "Interactive data visualizations and insights",
          icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
          path: "/dashboard",
        },
        {
          label: "Map Visualization",
          description: "Explore data with interactive USA maps",
          icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
          path: "/map",
        },
        {
          label: "AI Powered Insights",
          description: "Get intelligent analysis from our AI assistant",
          icon: "M9.75 13.5l2.25-3.75L15 13.5M10.5 6.75h3M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z",
          path: "/ai-insights",
        },
      ],
    },
    { path: "/dashboard", label: "Data Insights" },
    { path: "/api-specs", label: "API Specifications" },
    {
      path: "/support",
      label: "Support",
      hasDropdown: true,
      dropdownItems: [
        { label: "Get Help", description: "Access support resources" },
        {
          label: "Common Questions",
          description: "Find answers to frequently asked questions",
        },
        {
          label: "Settings",
          description: "Customize your experience",
          hasSettings: true,
          settings: [
            {
              id: "disableHyperSpeed",
              label: "Skip HyperSpeed Animation",
              description: "Disable the hyperspeed animation when loading search page"
            }
          ]
        },
      ],
    },
  ];

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="container-custom mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-mint/0 flex items-center justify-center rounded">
              <img
                src={logo}
                className="h-[50px] w-[50px]"
                alt="Investigator Logo"
              />
            </div>
            <span className="text-white text-xl font-medium">InvestiGator</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <div key={link.path} className="relative">
                {link.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className={`text-sm font-medium transition-colors flex items-center ${
                        location.pathname === link.path ||
                        openDropdown === link.label
                          ? "text-mint"
                          : "text-gray-300 hover:text-mint"
                      }`}
                    >
                      {link.label}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 transition-transform ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {openDropdown === link.label && (
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div
                          ref={dropdownRef}
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute z-50 ${
                            link.mega
                              ? "left-1/2 transform -translate-x-1/2 w-full max-w-6xl"
                              : "right-0"
                          } top-16`}
                        >
                          {link.mega ? (
                            <div className="bg-eerie-black border border-mint/30 rounded-lg shadow-2xl overflow-hidden mouse-position-border">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                <div>
                                  <h3 className="text-mint text-sm font-medium uppercase tracking-wide mb-4">
                                    MAIN FEATURES
                                  </h3>
                                  <div className="space-y-4">
                                    {link.dropdownItems
                                      .slice(0, 2)
                                      .map((item, idx) => (
                                        <Link
                                          key={idx}
                                          to={item.path}
                                          className="flex items-start hover:bg-cambridge-blue/20 rounded-lg p-3 transition-colors"
                                          onClick={() => setOpenDropdown(null)}
                                        >
                                          <div className="flex-shrink-0 text-mint">
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
                                                d={item.icon}
                                              />
                                            </svg>
                                          </div>
                                          <div className="ml-4">
                                            <p className="text-white text-sm font-medium">
                                              {item.label}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                              {item.description}
                                            </p>
                                          </div>
                                        </Link>
                                      ))}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-mint text-sm font-medium uppercase tracking-wide mb-4">
                                    VISUALIZATION TOOLS
                                  </h3>
                                  <div className="space-y-4">
                                    {link.dropdownItems
                                      .slice(2, 4)
                                      .map((item, idx) => (
                                        <Link
                                          key={idx}
                                          to={item.path}
                                          className="flex items-start hover:bg-cambridge-blue/20 rounded-lg p-3 transition-colors"
                                          onClick={() => setOpenDropdown(null)}
                                        >
                                          <div className="flex-shrink-0 text-mint">
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
                                                d={item.icon}
                                              />
                                            </svg>
                                          </div>
                                          <div className="ml-4">
                                            <p className="text-white text-sm font-medium">
                                              {item.label}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                              {item.description}
                                            </p>
                                          </div>
                                        </Link>
                                      ))}
                                  </div>
                                </div>
                                <div className="md:col-span-2 mt-4 bg-mint/10 rounded-lg p-6">
                                  <div className="flex flex-col md:flex-row items-center justify-between">
                                    <div>
                                      <h3 className="text-xl font-heading font-bold text-mint">
                                        Discover data-driven insights
                                      </h3>
                                      <p className="text-gray-300 mt-2">
                                        Explore the relationships between crime
                                        rates and employment statistics.
                                      </p>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                      <Link
                                        to="/dashboard"
                                        className="flex items-center text-mint font-medium"
                                        onClick={() => setOpenDropdown(null)}
                                      >
                                        <span>Explore dashboard</span>
                                        <svg
                                          className="ml-2 h-6 w-6"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                          />
                                        </svg>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="absolute z-10 right-0 mt-2 w-64 bg-eerie-black rounded-md shadow-card overflow-hidden mouse-position-border">
                              <div className="py-2">
                                {link.dropdownItems.map((item, idx) => (
                                  item.hasSettings ? (
                                    <div key={idx} className="block px-4 py-3">
                                      <span className="block text-sm font-medium text-white mb-1">
                                        {item.label}
                                      </span>
                                      <span className="block text-xs text-gray-400 mb-3">
                                        {item.description}
                                      </span>
                                      <div className="space-y-3 mt-2">
                                        {item.settings.map((setting) => (
                                          <SettingToggle 
                                            key={setting.id} 
                                            setting={setting} 
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <Link
                                      key={idx}
                                      to="#"
                                      className="block px-4 py-3 hover:bg-cambridge-blue/20 transition-colors"
                                      onClick={() => setOpenDropdown(null)}
                                    >
                                      <span className="block text-sm font-medium text-white">
                                        {item.label}
                                      </span>
                                      <span className="block text-xs text-gray-400 mt-0.5">
                                        {item.description}
                                      </span>
                                    </Link>
                                  )
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "text-mint"
                        : "text-gray-300 hover:text-mint"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-gray-300 hover:text-mint focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-mint/20">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <div key={link.path}>
                  {link.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(link.label)}
                        className={`w-full text-left py-2 px-1 text-sm font-medium flex justify-between items-center ${
                          openDropdown === link.label
                            ? "text-mint"
                            : "text-gray-300"
                        }`}
                      >
                        {link.label}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 transition-transform ${
                            openDropdown === link.label ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {openDropdown === link.label && (
                        <div className="pl-4 pt-2 pb-1 space-y-1">
                          {link.dropdownItems.map((item, idx) => (
                            item.hasSettings ? (
                              <div key={idx} className="py-2 px-1">
                                <span className="block text-sm font-medium text-mint mb-1">
                                  {item.label}
                                </span>
                                <div className="space-y-3 mt-2">
                                  {item.settings.map((setting) => (
                                    <SettingToggle 
                                      key={setting.id} 
                                      setting={setting} 
                                    />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <Link
                                key={idx}
                                to={item.path || "#"}
                                className="block py-2 px-1 text-sm text-gray-400 hover:text-mint"
                                onClick={() => {
                                  setOpenDropdown(null);
                                  setIsMenuOpen(false);
                                }}
                              >
                                {item.label}
                              </Link>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`block py-2 px-1 text-sm font-medium ${
                        location.pathname === link.path
                          ? "text-mint"
                          : "text-gray-300 hover:text-mint"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Toast notification */}
      {showToast && (
        <ToastContainer>
          <div className="flex">
            <div className="flex-shrink-0 text-mint">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{toastMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setShowToast(false)}
                  className="inline-flex rounded-md p-1.5 text-mint hover:text-white hover:bg-mint/20 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </ToastContainer>
      )}
    </nav>
  );
};

const SettingToggle = ({ setting }) => {
  const [enabled, setEnabled] = useState(() => {
    // Read initial value from localStorage
    const savedValue = localStorage.getItem(setting.id);
    return savedValue ? JSON.parse(savedValue) : false;
  });

  const toggleSetting = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    // Save to localStorage
    localStorage.setItem(setting.id, JSON.stringify(newValue));
    
    // Show toast notification
    let message = '';
    if (setting.id === 'disableHyperSpeed') {
      message = newValue ? 
        'HyperSpeed animation will be skipped on future visits' : 
        'HyperSpeed animation enabled on search page';
    }
    showNotification(message);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-white">{setting.label}</div>
        <div className="text-xs text-gray-400">{setting.description}</div>
      </div>
      <button
        onClick={toggleSetting}
        type="button"
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          enabled ? 'bg-mint' : 'bg-gray-600'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span className="sr-only">Toggle {setting.label}</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

const ToastContainer = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
  background-color: #121212; /* eerie-black */
  color: white;
  border: 1px solid #10b981; /* mint */
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-width: 20rem;
  animation: slideIn 0.3s ease-out forwards;

  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export default Navbar;
