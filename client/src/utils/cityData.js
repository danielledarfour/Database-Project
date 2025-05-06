// List of major cities for each US state
const cityData = {
  "Alabama": {
    id: "AL",
    cities: ["Birmingham", "Montgomery", "Huntsville", "Mobile", "Tuscaloosa"]
  },
  "Alaska": {
    id: "AK",
    cities: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"]
  },
  "Arizona": {
    id: "AZ",
    cities: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"]
  },
  "Arkansas": {
    id: "AR",
    cities: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"]
  },
  "California": {
    id: "CA",
    cities: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"]
  },
  "Colorado": {
    id: "CO",
    cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood"]
  },
  "Connecticut": {
    id: "CT",
    cities: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury"]
  },
  "Delaware": {
    id: "DE",
    cities: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"]
  },
  "Florida": {
    id: "FL",
    cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "St. Petersburg"]
  },
  "Georgia": {
    id: "GA",
    cities: ["Atlanta", "Savannah", "Athens", "Augusta", "Columbus"]
  },
  "Hawaii": {
    id: "HI",
    cities: ["Honolulu", "Hilo", "Kailua", "Kaneohe", "Waipahu"]
  },
  "Idaho": {
    id: "ID",
    cities: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"]
  },
  "Illinois": {
    id: "IL",
    cities: ["Chicago", "Aurora", "Naperville", "Peoria", "Springfield"]
  },
  "Indiana": {
    id: "IN",
    cities: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel"]
  },
  "Iowa": {
    id: "IA",
    cities: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"]
  },
  "Kansas": {
    id: "KS",
    cities: ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka"]
  },
  "Kentucky": {
    id: "KY",
    cities: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"]
  },
  "Louisiana": {
    id: "LA",
    cities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"]
  },
  "Maine": {
    id: "ME",
    cities: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"]
  },
  "Maryland": {
    id: "MD",
    cities: ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie"]
  },
  "Massachusetts": {
    id: "MA",
    cities: ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge"]
  },
  "Michigan": {
    id: "MI",
    cities: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor"]
  },
  "Minnesota": {
    id: "MN",
    cities: ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington"]
  },
  "Mississippi": {
    id: "MS",
    cities: ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi"]
  },
  "Missouri": {
    id: "MO",
    cities: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"]
  },
  "Montana": {
    id: "MT",
    cities: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte"]
  },
  "Nebraska": {
    id: "NE",
    cities: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"]
  },
  "Nevada": {
    id: "NV",
    cities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"]
  },
  "New Hampshire": {
    id: "NH",
    cities: ["Manchester", "Nashua", "Concord", "Derry", "Dover"]
  },
  "New Jersey": {
    id: "NJ",
    cities: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Trenton"]
  },
  "New Mexico": {
    id: "NM",
    cities: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"]
  },
  "New York": {
    id: "NY",
    cities: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse"]
  },
  "North Carolina": {
    id: "NC",
    cities: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"]
  },
  "North Dakota": {
    id: "ND",
    cities: ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"]
  },
  "Ohio": {
    id: "OH",
    cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"]
  },
  "Oklahoma": {
    id: "OK",
    cities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond"]
  },
  "Oregon": {
    id: "OR",
    cities: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro"]
  },
  "Pennsylvania": {
    id: "PA",
    cities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"]
  },
  "Rhode Island": {
    id: "RI",
    cities: ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"]
  },
  "South Carolina": {
    id: "SC",
    cities: ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Rock Hill"]
  },
  "South Dakota": {
    id: "SD",
    cities: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"]
  },
  "Tennessee": {
    id: "TN",
    cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"]
  },
  "Texas": {
    id: "TX",
    cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"]
  },
  "Utah": {
    id: "UT",
    cities: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"]
  },
  "Vermont": {
    id: "VT",
    cities: ["Burlington", "South Burlington", "Rutland", "Essex Junction", "Bennington"]
  },
  "Virginia": {
    id: "VA",
    cities: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News"]
  },
  "Washington": {
    id: "WA",
    cities: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"]
  },
  "West Virginia": {
    id: "WV",
    cities: ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"]
  },
  "Wisconsin": {
    id: "WI",
    cities: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"]
  },
  "Wyoming": {
    id: "WY",
    cities: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"]
  }
};

// Array of all US states for dropdown selection
export const usStates = Object.entries(cityData).map(([name, data]) => ({
  id: data.id,
  name,
  cities: data.cities
}));

export default cityData; 