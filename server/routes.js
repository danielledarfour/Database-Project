const express = require('express');
const router = express.Router();

const danielle = "./src/assets/danielle.png"
const sean = "./src/assets/sean.png"
const christian = "./src/assets/christian.png"

// Team members data
const teamMembers = [
  {
    name: "Christian Ishimwe",
    position: "Backend Support",
    bio: "Develops complex cross-dataset queries",
    image: christian
  },
  {
    name: "Danielle Darfour",
    position: "Backend Support",
    bio: "Develops complex cross-dataset queries",
    image: danielle
  },
  {
    name: "Rena Li",
    position: "Backend Support",
    bio: "Develops complex cross-dataset queries",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }, 
  {
    name: "Sean Donovan",
    position: "Head of Frontend",
    bio: "Designs and builds user interfaces for the data dashboard",
    image: sean
  },
];

// GET team members
router.get('/team-members', (req, res) => {
  res.json(teamMembers);
});

// TODO: Implement crime data endpoints
// GET crime data
router.get('/crime-data', (req, res) => {
  // TODO: Fetch and return crime data from database
  res.status(501).json({ message: 'Crime data endpoint not yet implemented' });
});

// TODO: Implement employment/jobs data endpoints
// GET employment data
router.get('/employment-data', (req, res) => {
  // TODO: Fetch and return employment data from database
  res.status(501).json({ message: 'Employment data endpoint not yet implemented' });
});


module.exports = router; 