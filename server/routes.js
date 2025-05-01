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
const danielle = "./src/assets/danielle3.jpg";
const sean = "./src/assets/sean.png";
const christian = "./src/assets/chris.jpg";
const rena = "./src/assets/rena.jpg";
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
    image: rena,
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

// ROUTE FOR QUESTION 1
router.get("/crime/:state/:year", (req, res) => {
  let { state, year } = req.params;
  // NOTE: CALLBACK STYLE POOL QUERY DOESN'T NEED ASYNC/AWAIT
  pool.query(
    `SELECT c.City, SUM(c.Incident) AS TotalIncidents 
    FROM Crime c JOIN State s ON c.StateID = s.StateID WHERE s.StateName = $1 AND 
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

// ROUTE FOR QUESTION 2
router.get("/housing/:state/:city/:propertyType", (req, res) => {
  let { state, city, propertyType } = req.params;
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

// ROUTE FOR QUESTION 3
// The question: For each city in a selected state, what is the average sale price and number 
// of homes sold per property type?

router.get("/state/:state", (req, res) => {
  let year = req.params.year;
  pool.query(`
    SELECT 
    h.City,
    h.PropertyType,
    ROUND(AVG(h.MedianSalePrice), 2) AS AvgSalePrice,
    SUM(h.HomesSold) AS TotalHomesSold
    FROM HousingRecord h
    JOIN State s ON h.StateID = s.StateID
      JOIN Job b on s.StateID = b.StateId
    WHERE s.StateName = $1
    GROUP BY h.City, h.PropertyType
    RDER BY TotalHomesSold DESC;

    `, [state], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

// ROUTE FOR QUESTION 4
// For a given state and year, what are the top 5 cities with the highest average crime incidents, and
// how do their housing prices (median sale price) compare across property types?
router.get("/housing/:state/:year", (req, res) => {
  let { state, year } = req.params;
  pool.query(`
  SELECT
    c.City,
    h.PropertyType,
    ROUND(AVG(c.Incident), 2) AS AvgIncidents,
    ROUND(AVG(h.MedianSalePrice), 2) AS AvgSalePrice
    FROM
        Crime c
    JOIN
        State s ON c.StateID = s.StateID
    JOIN
        HousingRecord h ON h.City = c.City AND h.StateID = c.StateID
    WHERE
        s.StateName = $1
        AND c.Year = $2
    GROUP BY
        c.City, h.PropertyType
    ORDER BY
        AvgIncidents DESC
    LIMIT 5;
    `, [state, year], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

// ROUTE FIVE
// Given a state and a year, what are the average wages for each occupation in that state considering 
// that the state has both the housing and crime data for such a year.

router.get("/state/:state/:year/", (req, res) => {
  let { year, pct } = req.params;
  pool.query(`
    SELECT 
    j.OccupationTitle,
    ROUND(AVG(j.AnnualMeanWage), 2) AS AvgWage
    FROM Job j
    JOIN State s ON j.StateID = s.StateID
    JOIN Crime c ON c.StateID = j.StateID
    JOIN HousingRecord h ON h.StateID = j.StateID
    WHERE s.StateName = $1
    AND c.Year = $2
    GROUP BY j.OccupationTitle
    ORDER BY AvgWage DESC;
    `, [year, pct], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results.rows);
    }
  });
});

// ROUTE SIX for question 6
// The Question: How have crime incidents changed over the last 5 years in a given state?

router.get("/crime/:state", (req, res) => {
  let state = req.params;
  pool.query(
    `
    SELECT c.Year, SUM(c.Incident) AS TotalIncidents
    FROM 
      Crime c JOIN State s ON c.StateID = s.StateID
    WHERE 
      s.StateName = $1
    GROUP BY 
      c.Year
    ORDER BY 
      c.Year
    `,
    [state],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Error: " + error.message });
      } else {
        res.json(results.rows);
      }
    }
  );
});

// ROUTE SEVEN
// The question:
// For a given city in a given state, how did the average job wage, total crime incidents, and median
// housing sale price change over a selected range of years?
router.get("/housing/affordability", (req, res) => {
  pool.query(`
    WITH state_wage AS (
        SELECT stateid, AVG(annualmeanwage)::numeric AS avg_wage          
        FROM job
        GROUP BY stateid
    ),
    state_price AS (
        SELECT stateid,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY mediansaleprice)::numeric
            AS median_price                                   
        FROM housingRecord
        GROUP BY stateid
    )
    SELECT s.statename,
    sp.median_price,
    sw.avg_wage,
    ROUND(sp.median_price / sw.avg_wage, 2) AS price_to_income_ratio
    FROM state s
    JOIN state_price sp USING (stateid)
    JOIN state_wage sw USING (stateid)
    ORDER BY price_to_income_ratio;
    `, [], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

// ROUTE FOR QUESTION 8 COMPLEX
// The question:
// For every state, which occupation titles have a combined share of the workforce
// under X%, and average wage more than Y% above the state’s overall average wage?
// ~54 sec runtime

router.get("/job/:pct-workforce/:pct-wage", (req, res) => {
  pool.query(`
    WITH Occupations AS (
      SELECT
        s.StateID,
        s.StateName,
        j.OccupationTitle,
        SUM(j.PctOfTotalEmployment) AS WorkforcePct,
        AVG(j.AnnualMeanWage) AS OccupationAvgWage,
        AVG(j.AnnualMeanWage) -
        (SELECT AVG(j2.AnnualMeanWage)
        FROM Job j2
        WHERE j2.StateID = s.StateID) AS AmountAboveStateAvg
      FROM State s
        JOIN Job j ON j.StateID = s.StateID
      GROUP BY s.StateID, s.StateName, j.OccupationTitle
      HAVING
        SUM(j.PctOfTotalEmployment) < $1
        AND AVG(j.AnnualMeanWage) >
             (1 + $2 / 100) * (SELECT AVG(j3.AnnualMeanWage)
                    FROM Job j3
                    WHERE j3.StateID = s.StateID)
    )
    SELECT *
    FROM Occupations o
    ORDER BY o.StateName, o.AmountAboveStateAvg DESC;
  `, [pct-workforce, pct-wage], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

// ROUTE FOR QUESTION 9
router.get("/jobs/:state", (req, res) => {
  const { state } = req.params;
  pool.query(`
    SELECT 
      j.OccupationTitle,
      j.PctOfTotalEmployment
    FROM 
      Job j
    JOIN 
      State s ON j.StateID = s.StateID
    WHERE 
      s.StateName = $1
    ORDER BY 
      j.PctOfTotalEmployment DESC
    LIMIT 10;
    `, [state], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error: " + error.message });
    } else {
      res.json(results);
    }
  });
});

// ROUTE FOR QUESTION 10
// The question: For a selected state, what is the total number of crimes per year?

<<<<<<< HEAD
router.get("/crime", (req, res) => {
  pool.query(
    `
=======
router.get("/crime/:state", (req, res) => {
  pool.query(`
>>>>>>> 115d770 (Add route 8)
    SELECT c.Year, SUM(c.Incident) AS TotalIncidents
    FROM  Crime c JOIN State s ON c.StateID = s.StateID
    WHERE
      s.StateName = $1
    GROUP BY
      c.Year
    ORDER BY
      c.Year;
    `,
    [state],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Error: " + error.message });
      } else {
        res.json(results.rows);
      }
    }
  );
});

module.exports = router;
