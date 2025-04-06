import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const Footer = () => {
  return (
    <footer className="footer bg-eerie-black">
      <div className="container-custom mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-5">
              <div className="bg-aquamarine w-10 h-10 flex items-center justify-center rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-eerie-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8L12 16M8 12L16 12"></path>
                </svg>
              </div>
              <span className="text-white text-xl font-medium">InvestiGator</span>
            </Link>
            <p className="text-gray-300 mb-5 max-w-sm">
              Providing insightful data analysis on the correlation between crime rates and employment statistics across the United States.
            </p>
            <Button />
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-aquamarine font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-aquamarine transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-aquamarine transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-aquamarine transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-aquamarine transition-colors">Search</Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-300 hover:text-aquamarine transition-colors">Map</Link>
              </li>
            </ul>
          </div>
          
          {/* Features */}
          <div>
            <h3 className="text-aquamarine font-semibold uppercase tracking-wider mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-300 hover:text-aquamarine transition-colors">Crime Analysis</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-aquamarine transition-colors">Employment Trends</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-aquamarine transition-colors">Data Visualization</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-aquamarine transition-colors">Interactive Maps</Link>
              </li>
              <li>
                <Link to="/ai-insights" className="text-gray-300 hover:text-aquamarine transition-colors">AI Insights</Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-aquamarine font-semibold uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-300 hover:text-aquamarine transition-colors">Documentation</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-aquamarine transition-colors">Data Sources</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-aquamarine transition-colors">API Access</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-aquamarine transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/this-page-does-not-exist" className="text-gray-300 hover:text-aquamarine transition-colors">
                  <span className="inline-flex items-center">
                    Test 404 Page
                    <svg className="w-4 h-4 ml-1 text-aquamarine" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-aquamarine font-semibold uppercase tracking-wider mb-4">Contact</h3>
            <div className="space-y-3">
              <p className="text-gray-300 flex items-start">
                <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>database@4500.com</span>
              </p>
              <p className="text-gray-300 flex items-start">
                <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(000) 123-4567</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-hunter-green pt-8 mt-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} InvestiGator. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-gray-300 hover:text-aquamarine text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-300 hover:text-aquamarine text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 