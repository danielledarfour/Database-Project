const express = require("express");
const router = express.Router();

const config = require("./config.json");
const { Pool, types } = require("pg");
const OpenAI = require("openai");

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
// ROUTE FOR QUESTION 0 (Sanity Check)
router.get("/crime/:id", (req, res) => {
  let { id } = req.params;
  pool.query(
    `SELECT * FROM Crime WHERE crimeid = $1;`,
    [id],
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

function formatStateName(str) {
  // Replace underscores with actual spaces
  str = str.replace(/_/g, " ");
  // Capitalize each word
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

// ROUTE FOR QUESTION 1
// Get the top 5 cities with the highest total crime incidents for a given state and year
router.get("/crime/:state/:year", (req, res) => {
  let { state, year } = req.params;
  // NOTE: CALLBACK STYLE POOL QUERY DOESN'T NEED ASYNC/AWAIT
  // ensure state is camel case
  state = formatStateName(state);
  pool.query(
    `SELECT c.city, SUM(c.Incident) AS TotalIncidents FROM Crime c
    JOIN State s ON c.StateID = s.StateID WHERE s.StateName = $1 AND
     c.Year = $2 GROUP BY c.City ORDER BY TotalIncidents DESC LIMIT 5;`,
    [state, year],
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

// ROUTE FOR QUESTION 2
// For a given state, city, and property type, what is the median sale price, median list price, and the price difference
// between the median list price and the median sale price?
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
        res.json(results.rows);
      }
    }
  );
});

// ROUTE FOR QUESTION 3
// The question: For each city in a selected state, what is the average sale price and number
// of homes sold per property type?

router.get("/state/:state", (req, res) => {
  let { state } = req.params;
  // capitalize the state name
  state = formatStateName(state);

  pool.query(
    `
    SELECT 
    h.City,
    h.PropertyType,
    ROUND(AVG(h.MedianSalePrice), 2) AS AvgSalePrice,
    SUM(h.HomesSold) AS TotalHomesSold
    FROM HousingRecord h
           JOIN State s ON h.StateID = s.StateID
    WHERE s.StateName = $1
    GROUP BY h.City, h.PropertyType
    ORDER BY TotalHomesSold DESC;
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

// ROUTE FOR QUESTION 4
// Across all cities in a given state and year range, what are the average crime incidents,
// housing prices, and employment levels grouped by both city and industry?
router.get("/housing-route/:state/:startYear/:endYear", (req, res) => {
  let { state, startYear, endYear } = req.params;

  state = formatStateName(state);

  pool.query(
    `
    WITH FilteredAgg AS (
      SELECT
        agg.City,
        s.StateName,
        agg.StateID,
        sj.OccupationTitle,
        AVG(agg.AvgIncidents) AS AvgIncidents,
        AVG(agg.AvgSalePrice) AS AvgSalePrice,
        sj.AvgWage AS AvgEmployment
      FROM
        CrimeHousingCityAgg agg
          JOIN State s ON agg.StateID = s.StateID
          JOIN StateJobStatsAgg sj ON sj.StateID = s.StateID
      WHERE
        s.StateName = $1
        AND agg.Year BETWEEN $2 AND $3
      GROUP BY agg.City, s.StateName, agg.StateID, sj.OccupationTitle, sj.AvgWage
    )
    SELECT *
    FROM FilteredAgg
    ORDER BY AvgIncidents DESC, AvgEmployment;
    `,
    [state, startYear, endYear],
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

// ROUTE FOR QUESTION FIVE
// Given a state and a year, what are the average wages for each occupation in that state considering
// that the state has both the housing and crime data for such a year.

router.get("/state/:state/:year", (req, res) => {
  let { state, year } = req.params;
  // capitalize the state name
  state = formatStateName(state);
  pool.query(
    `
    SELECT 
    j.OccupationTitle,
    ROUND(AVG(j.AnnualMeanWage), 2) AS AvgWage
    FROM Job j
           JOIN State s ON j.StateID = s.StateID
    WHERE s.StateName = $1
      AND EXISTS (
      SELECT 1 FROM Crime c
      WHERE c.StateID = j.StateID AND c.Year = $2
    )
      AND EXISTS (
      SELECT 1 FROM HousingRecord h
      WHERE h.StateID = j.StateID
    )
    GROUP BY j.OccupationTitle
    ORDER BY AvgWage DESC;
    `,
    [state, year],
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

// ROUTE SIX for question 6
// The Question: How have crime incidents changed over the last 5 years in a given state?
router.get("/five-years/:state", (req, res) => {
  let { state } = req.params;

  // ensure state is camel case
  state = formatStateName(state);
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
  pool.query(
    `
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
    `,
    [],
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

// ROUTE FOR QUESTION 8 COMPLEX
// The question:
// For every state, which occupation titles have a combined share of the workforce
// under X%, and average wage more than Y% above the state's overall average wage?

router.get("/job/:pctWorkforce/:pctWage", (req, res) => {
  let { pctWorkforce, pctWage } = req.params;
  // console log the params
  pool.query(
    `
      SELECT
        s.StateName,
        sj.OccupationTitle,
        sj.WorkforcePct,
        sj.AvgWage AS OccupationAvgWage,
        sj.AvgWage - sa.StateAvgWage AS AmountAboveStateAvg
      FROM StateJobStatsAgg sj
             JOIN (
        SELECT StateID, AVG(AvgWage) AS StateAvgWage
        FROM StateJobStatsAgg
        GROUP BY StateID
      ) sa ON sj.StateID = sa.StateID
             JOIN State s ON sj.StateID = s.StateID
      WHERE sj.WorkforcePct < $1
        AND sj.AvgWage > sa.StateAvgWage * (1 + $2 / 100.0)
      ORDER BY s.StateName, AmountAboveStateAvg DESC;
    `,
    [pctWorkforce, pctWage],
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

// ROUTE FOR QUESTION 9
// For a given state, which occupation titles have the highest percentage of the workforce?
router.get("/job/:state", (req, res) => {
  let { state } = req.params;
  // Properly capitalize state name
  state = formatStateName(state);
  pool.query(
    `
    WITH state_total AS (
      SELECT
        SUM(j.TotalEmployment) AS TotalEmp
      FROM
        Job j
      JOIN
        State s ON j.StateID = s.StateID
      WHERE
        s.StateName = $1
        AND j.OccupationTitle <> 'All Occupations'
    )
    SELECT
      j.OccupationTitle,
      SUM(j.TotalEmployment) AS Emp,
      SUM(j.TotalEmployment) * 1.0 / st.TotalEmp AS TruePct
    FROM
      Job j
    JOIN
      State s ON j.StateID = s.StateID,
      state_total st
    WHERE
      s.StateName = $1
      AND j.OccupationTitle <> 'All Occupations'
    GROUP BY
      j.OccupationTitle, st.TotalEmp
    ORDER BY
      TruePct DESC
    LIMIT 10;
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

// ROUTE FOR QUESTION 10
// What are the top 20 most expensive cities for Single‑Family Residential in a given state?

router.get("/housing/:state/:propertyType", (req, res) => {
  let { state, propertyType } = req.params;
  // Properly capitalize state name
  state = formatStateName(state);
  pool.query(
    `SELECT city, mediansaleprice
    FROM housingRecord hr
    JOIN state s USING (stateid)
    WHERE s.statename = $1
    AND  propertytype = $2
    ORDER  BY mediansaleprice DESC
    LIMIT 20;
    `,
    [state, propertyType],
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

// ROUTE FOR CHATBOT - simplified with frontend intent
router.post("/chatbot", async (req, res) => {
  const { apiKey, intent, message, pageDOM } = req.body;

  // 1. Auth
  if (!apiKey) {
    return res
      .status(401)
      .json({ message: "API key missing", error: "api key missing" });
  }

  const openai = new OpenAI({ apiKey });

  // 2. Define functions
  const navigationCardDef = {
    name: "navigation_card",
    description: "Emit a UI card for a dashboard page or feature",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        link: { type: "string" },
      },
      required: ["title", "description", "link"],
    },
  };

  const guideDef = {
    name: "step_by_step_guide",
    description: "Walk the user through a UI task step by step",
    parameters: {
      type: "object",
      properties: {
        task: { type: "string" },
        destination_page: { type: "string" },
        steps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              step_number: { type: "integer" },
              instruction: { type: "string" },
              location: { type: "string" },
            },
            required: ["step_number", "instruction", "location"],
          },
        },
      },
      required: ["task", "destination_page", "steps"],
    },
  };

  // 3. Pick the one you need
  let functions, forceCall;
  if (intent === "where_is") {
    functions = [navigationCardDef];
    forceCall = { name: "navigation_card" };
  } else if (intent === "how_do_i") {
    functions = [guideDef];
    forceCall = { name: "step_by_step_guide" };
  } else {
    functions = [];
    forceCall = "auto";
  }

  try {
    // 4. Build messages
    const messages = [
      {
        role: "system",
        content: `You are a dashboard assistant. Use the single function provided to either point users to a page (navigation_card) or walk them through steps (step_by_step_guide). Available routes to search on are:             <Route path="/" element={<HeroPage />} /><Route path="/search" element={<SearchPage />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/map" element={<MapPage />} /><Route path="/ai-insights" element={<AIInsightsPage />} /><Route path="/api-specs" element={<APISpecPage />} />{/* <Route path="/about" element={<About />} /> */}{/* 404 Error Page - catches all other routes */}<Route path="*" element={<ErrorPage />} /> `,
      },
      { role: "system", content: `Page DOM summary: ${pageDOM}` },
      { role: "user", content: message },
    ];

    // 5. Call OpenAI
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages,
      functions,
      function_call: forceCall,
      max_tokens: 600,
    });

    const msg = resp.choices[0].message;

    // 6. If it called a function, parse & return
    if (msg.function_call) {
      const payload = JSON.parse(msg.function_call.arguments);
      const key =
        msg.function_call.name === "navigation_card" ? "card" : "guide";

      console.log(`Sending ${key} response to client`);
      return res.json({ success: true, reply: msg.content, [key]: payload });
    }

    // 7. Otherwise just text
    console.log("Sending text-only response to client");
    res.json({ success: true, reply: msg.content });
  } catch (err) {
    console.error(err);
    const isAuth =
      err.status === 401 || /api key|authentication/i.test(err.message);
    return res.status(isAuth ? 401 : 500).json({
      message: isAuth ? "Invalid API key." : "Internal chatbot error.",
      error: err.message,
    });
  }
});

module.exports = router;
