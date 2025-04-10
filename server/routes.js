const express = require("express");
const router = express.Router();

const config = require("./config.json");
const { Pool, types } = require("pg");

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, (val) => parseInt(val, 10));

// SET THE POOL FOR FASTER QUERY PROCESSINGS IN HIGH VOLUME TIME PERIODS
const pool = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  database: config.rds_db,
  port: config.rds_port,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ERROR MESSAGE IF DATABASE CONNECTION FAILS
pool.connect((error) => error && console.log(error));
// if the error is an error object then print it out

// We will first start by setting up the team members endpoint
//  for our frontend display

// Team members data
const danielle = "./src/assets/danielle.png";
const sean = "./src/assets/sean.png";
const christian = "./src/assets/christian.png";
const teamMembers = [
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
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Sean Donovan",
    position: "Head of Frontend",
    bio: "Designs and builds user interfaces for the data dashboard",
    image: sean,
  },
];

// GET team members
router.get("/team-members", (req, res) => {
  res.json(teamMembers);
});

router.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "Welcome to my 4500 API;" });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
});

/**
 *  Endpoints begin with "/" + "state, crime, job, or housing" denoting
 *  the type of data being requested. The endpoint then continues with the
 *  specific data being requested. For example, "/state/California" would
 *  return the state data for California.
 **/
router.get("/crime/:state/:year", (req, res) => {
  const { state, year } = req.params;
  // NOTE: CALLBACK STYLE POOL QUERY DOESN'T NEED ASYNC/AWAIT
  pool.query(
    `SELECT c.City, SUM(c.Incident) AS TotalIncidents FROM Crime c JOIN
     State s ON c.StateID = s.StateID WHERE s.StateName = $1 AND 
     c.Year = $2 GROUP BY c.City ORDER BY TotalIncidents DESC LIMIT 5;`,
    [state, year],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Error: " + error.message });
      } else {
        res.json(results);
      }
    }
  );
});

router.get("/housing/:state/:city/:propertyType", (req, res) => {
  const { state, city, propertyType } = req.params;
  pool.query(
    `SELECT h.City, h.PropertyType, h.MedianListPrice, 
    h.MedianSalePrice, (h.MedianListPrice - h.MedianSalePrice) AS PriceDifference 
    FROM HousingRecord h JOIN State s ON h.StateID = s.StateID WHERE s.StateName
    = $1 AND h.City = $2 AND h.PropertyType = $3;`,
    [state, city, propertyType],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Error: " + error.message });
      } else {
        res.json(results);
      }
    }
  );
});

// The question:
// For a selected year, list the top 5 states with the highest total crime incidents, along with:
// their average job wage, and
// the total number of homes sold (summed across all cities and property types).
router.get("/state/:year", (req, res) => {
  const year = req.params.year;
  pool.query(``, [year], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

// For a given state and year, what are the top 5 cities with the highest average crime incidents, and
// how do their housing prices (median sale price) compare across property types?
router.get("/", (req, res) => {
  pool.query(``, [], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

router.get("/", (req, res) => {
  pool.query(``, [], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

router.get("/", (req, res) => {
  pool.query(``, [], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

router.get("/", (req, res) => {
  pool.query(``, [], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

router.get("/", (req, res) => {
  pool.query(``, [], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

router.get("/", (req, res) => {
  pool.query(``, [], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

router.get("/", (req, res) => {
  pool.query(``, [], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
