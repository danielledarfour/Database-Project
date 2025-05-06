// List of major cities for each US state
const cityData = {
  "Alabama": {
    id: "AL",
    cities: ["Birmingham", "Montgomery", "Huntsville", "Mobile", "Tuscaloosa"],
    center: { lat: 32.806671, lng: -86.791130 }
  },
  "Alaska": {
    id: "AK",
    cities: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
    center: { lat: 61.370716, lng: -152.404419 }
  },
  "Arizona": {
    id: "AZ",
    cities: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
    center: { lat: 33.729759, lng: -111.431221 }
  },
  "Arkansas": {
    id: "AR",
    cities: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
    center: { lat: 34.969704, lng: -92.373123 }
  },
  "California": {
    id: "CA",
    cities: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
    center: { lat: 36.116203, lng: -119.681564 }
  },
  "Colorado": {
    id: "CO",
    cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood"],
    center: { lat: 39.059811, lng: -105.311104 }
  },
  "Connecticut": {
    id: "CT",
    cities: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury"],
    center: { lat: 41.597782, lng: -72.755371 }
  },
  "Delaware": {
    id: "DE",
    cities: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"],
    center: { lat: 39.318523, lng: -75.507141 }
  },
  "Florida": {
    id: "FL",
    cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "St. Petersburg"],
    center: { lat: 27.766279, lng: -81.686783 }
  },
  "Georgia": {
    id: "GA",
    cities: ["Atlanta", "Savannah", "Athens", "Augusta", "Columbus"],
    center: { lat: 33.040619, lng: -83.643074 }
  },
  "Hawaii": {
    id: "HI",
    cities: ["Honolulu", "Hilo", "Kailua", "Kaneohe", "Waipahu"],
    center: { lat: 21.094318, lng: -157.498337 }
  },
  "Idaho": {
    id: "ID",
    cities: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"],
    center: { lat: 44.240459, lng: -114.478828 }
  },
  "Illinois": {
    id: "IL",
    cities: ["Chicago", "Aurora", "Naperville", "Peoria", "Springfield"],
    center: { lat: 40.349457, lng: -88.986137 }
  },
  "Indiana": {
    id: "IN",
    cities: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel"],
    center: { lat: 39.849426, lng: -86.258278 }
  },
  "Iowa": {
    id: "IA",
    cities: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"],
    center: { lat: 42.011539, lng: -93.210526 }
  },
  "Kansas": {
    id: "KS",
    cities: ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka"],
    center: { lat: 38.526600, lng: -96.726486 }
  },
  "Kentucky": {
    id: "KY",
    cities: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
    center: { lat: 37.668140, lng: -84.670067 }
  },
  "Louisiana": {
    id: "LA",
    cities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"],
    center: { lat: 31.169546, lng: -91.867805 }
  },
  "Maine": {
    id: "ME",
    cities: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"],
    center: { lat: 44.693947, lng: -69.381927 }
  },
  "Maryland": {
    id: "MD",
    cities: ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie"],
    center: { lat: 39.063946, lng: -76.802101 }
  },
  "Massachusetts": {
    id: "MA",
    cities: ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge"],
    center: { lat: 42.230171, lng: -71.530106 }
  },
  "Michigan": {
    id: "MI",
    cities: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor"],
    center: { lat: 43.326618, lng: -84.536095 }
  },
  "Minnesota": {
    id: "MN",
    cities: ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington"],
    center: { lat: 45.694454, lng: -93.900192 }
  },
  "Mississippi": {
    id: "MS",
    cities: ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi"],
    center: { lat: 32.741646, lng: -89.678696 }
  },
  "Missouri": {
    id: "MO",
    cities: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"],
    center: { lat: 38.456085, lng: -92.288368 }
  },
  "Montana": {
    id: "MT",
    cities: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte"],
    center: { lat: 46.921925, lng: -110.454353 }
  },
  "Nebraska": {
    id: "NE",
    cities: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
    center: { lat: 41.125370, lng: -98.268082 }
  },
  "Nevada": {
    id: "NV",
    cities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"],
    center: { lat: 38.313515, lng: -117.055374 }
  },
  "New Hampshire": {
    id: "NH",
    cities: ["Manchester", "Nashua", "Concord", "Derry", "Dover"],
    center: { lat: 43.452492, lng: -71.563896 }
  },
  "New Jersey": {
    id: "NJ",
    cities: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Trenton"],
    center: { lat: 40.298904, lng: -74.521011 }
  },
  "New Mexico": {
    id: "NM",
    cities: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"],
    center: { lat: 34.840515, lng: -106.248482 }
  },
  "New York": {
    id: "NY",
    cities: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse"],
    center: { lat: 42.165726, lng: -74.948051 }
  },
  "North Carolina": {
    id: "NC",
    cities: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
    center: { lat: 35.630066, lng: -79.806419 }
  },
  "North Dakota": {
    id: "ND",
    cities: ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
    center: { lat: 47.528912, lng: -99.784012 }
  },
  "Ohio": {
    id: "OH",
    cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
    center: { lat: 40.388783, lng: -82.764915 }
  },
  "Oklahoma": {
    id: "OK",
    cities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond"],
    center: { lat: 35.565342, lng: -96.928917 }
  },
  "Oregon": {
    id: "OR",
    cities: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro"],
    center: { lat: 44.572021, lng: -122.070938 }
  },
  "Pennsylvania": {
    id: "PA",
    cities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
    center: { lat: 40.590752, lng: -77.209755 }
  },
  "Rhode Island": {
    id: "RI",
    cities: ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"],
    center: { lat: 41.680893, lng: -71.511780 }
  },
  "South Carolina": {
    id: "SC",
    cities: ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Rock Hill"],
    center: { lat: 33.856892, lng: -80.945007 }
  },
  "South Dakota": {
    id: "SD",
    cities: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
    center: { lat: 44.299782, lng: -99.438828 }
  },
  "Tennessee": {
    id: "TN",
    cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"],
    center: { lat: 35.747845, lng: -86.692345 }
  },
  "Texas": {
    id: "TX",
    cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
    center: { lat: 31.054487, lng: -97.563461 }
  },
  "Utah": {
    id: "UT",
    cities: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"],
    center: { lat: 40.150032, lng: -111.862434 }
  },
  "Vermont": {
    id: "VT",
    cities: ["Burlington", "South Burlington", "Rutland", "Essex Junction", "Bennington"],
    center: { lat: 44.045876, lng: -72.710686 }
  },
  "Virginia": {
    id: "VA",
    cities: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News"],
    center: { lat: 37.769337, lng: -78.169968 }
  },
  "Washington": {
    id: "WA",
    cities: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
    center: { lat: 47.400902, lng: -121.490494 }
  },
  "West Virginia": {
    id: "WV",
    cities: ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
    center: { lat: 38.491226, lng: -80.954453 }
  },
  "Wisconsin": {
    id: "WI",
    cities: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"],
    center: { lat: 44.268543, lng: -89.616508 }
  },
  "Wyoming": {
    id: "WY",
    cities: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"],
    center: { lat: 42.755966, lng: -107.302490 }
  }
};

// Array of all US states for dropdown selection
export const usStates = Object.entries(cityData).map(([name, data]) => ({
  id: data.id,
  name,
  cities: data.cities,
  center: data.center
}));

export default cityData; 