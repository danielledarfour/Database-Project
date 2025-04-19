# 🔍 Crime, Housing & Employment Data Visualization Platform

A comprehensive data visualization platform for exploring the relationship between housing, crime rates and employment trends across the United States.

## LIVE SITE URL

[Investigator Official Site](https://databases-five.vercel.app/) - Deployed with Vercel

## ✨ Features

- 🗺️ **Interactive USA Map** - Explore data state-by-state with clickable regions
- 📈 **Dynamic Dashboards** - Visualize trends and patterns with customizable charts
- 🔎 **Advanced Search** - Filter data by state, year, crime type, and job sector
- 🤖 **AI Insights** - Get AI-powered analysis of correlations and patterns
- 🌓 **Dark Theme** - Modern UI with eerie-black backgrounds and hunter green accents

## 🛠️ Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/crime-employment-visualization.git
   cd crime-employment-visualization
   ```

2. **Install dependencies for client**

   ```bash
   cd client
   npm install
   ```

3. **Install dependencies for server**

   ```bash
   cd ../server
   npm install
   ```

4. **Environment setup**

   Create a `.env` file in the client directory:

   ```bash
   VITE_SERVER_URL=http://localhost:5000
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

5. **Start development servers**

   Start client:

   ```bash
   cd client
   npm run dev
   ```

   Start server:

   ```bash
   cd server
   npm run dev
   ```

## 🎨 UI/UX Details

### Color Scheme

- **Background**: Eerie Black (#121212) - Primary dark background
- **Accents**: Hunter Green (#195d30) - Headers and interactive elements
- **Text**: White (#FFFFFF) - For readability against dark backgrounds
- **Interactive Elements**: Mint (#10b981) - Buttons, active states
- **Data Visualization**:
  - Crime data: Red (#ef4444)
  - Employment data: Green (#10b981)

### Key UI Components

- **Navigation**: Dark-themed with smooth transitions
- **Map Visualization**: Interactive Google Maps integration with state polygons
- **Dashboard**: Dynamic charts with filtering capabilities
- **Social Buttons**: Gradient-styled quarter-circle buttons for social sharing

### Design Philosophy

The UI follows a consistent dark theme optimized for data visualization, with:

- High contrast text for readability
- Interactive elements with subtle hover effects
- Consistent spacing and alignment
- Custom button components with platform-specific styling

## 🤝 Contributions

Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using React, Tailwind CSS, and Node.js
