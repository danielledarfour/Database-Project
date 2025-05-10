API Specifications

openapi: 3.0.0
info:
    title: InvestiGator API 
    version: 1.0.0
    description: API for exploring crime, housing, and employment trends 
        across U.S. states and cities through queries and visualizations.

servers:
  - url: http://localhost:5001
    description: Local development server

paths:
  /crime/{state}/{year}:
    get:
      summary: Get top 5 cities with the highest number of reported crime incidents for a given state and year?
      parameters:
        - name: state
          in: path
          required: true
          description: Name of U.S state
          schema:
            type: string
        - name: year
          in: path
          required: true
          description: The year to fetch crime data for
          schema:
            type: integer
      responses:
        '200':
          description: A list of cities and total incidents
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    City:
                      type: string
                    TotalIncidents:
                      type: integer
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string


  /housing/{state}/{city}/{propertyType}:
    get:
      summary: Returns median list price, median sale price, and their difference for a specific property type in a given city and state
      parameters:
        - name: state
          in: path
          required: true
          description: Full state name
          schema:
            type: string
        - name: city
          in: path
          required: true
          description: City name
          schema:
            type: string
        - name: propertyType
          in: path
          required: true
          description: Type of property (e.g., "Single Family Residential", "Condo")
          schema:
            type: string
      responses:
        '200':
          description: Property price data for the specified location and type
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    city:
                      type: string
                    propertytype:
                      type: string
                    medianlistprice:
                      type: number
                    mediansaleprice:
                      type: number
                    pricedifference:
                      type: number

  /state/{state}:
    get:
      summary: For every city in a selected state, returns the average sale price and number of homes sold per property type
      parameters:
        - name: state
          in: path
          required: true
          description: Full state name
          schema:
            type: string
      responses:
        '200':
          description: Housing market data grouped by city and property type
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    city:
                      type: string
                    propertytype:
                      type: string
                    avgsaleprice:
                      type: number
                    totalhomessold:
                      type: integer

  /housing-route/{state}/{startYear}/{endYear}:
    get:
      summary: Returns housing metrics across a specified year range for a given state, including crime incidents, sale prices, and occupation data
      parameters:
        - name: state
          in: path
          required: true
          description: Full state name
          schema:
            type: string
        - name: startYear
          in: path
          required: true
          description: Starting year for the range
          schema:
            type: integer
        - name: endYear
          in: path
          required: true
          description: Ending year for the range
          schema:
            type: integer
      responses:
        '200':
          description: Aggregated housing metrics over the year range
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    city:
                      type: string
                    statename:
                      type: string
                    stateid:
                      type: integer
                    occupationtitle:
                      type: string
                    avgincidents:
                      type: number
                    avgsaleprice:
                      type: number
                    avgemployment:
                      type: number
                    numpropertytypes:
                      type: integer

  /state/{state}/{year}:
    get:
      summary: Returns the average annual wage for every occupation in the specified state for a given year, if that state has both housing and crime data for that year
      parameters:
        - name: state
          in: path
          required: true
          description: Full state name
          schema:
            type: string
        - name: year
          in: path
          required: true
          description: 4-digit year
          schema:
            type: integer
      responses:
        '200':
          description: Occupation wage data for the state and year
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    occupationtitle:
                      type: string
                    avgwage:
                      type: number

  /five-years/{state}:
    get:
      summary: Returns the total number of reported crime incidents for each year in the specified state, sorted by year
      parameters:
        - name: state
          in: path
          required: true
          description: Full state name
          schema:
            type: string
      responses:
        '200':
          description: Crime trend data over years
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    year:
                      type: integer
                    totalincidents:
                      type: integer

  /housing/affordability:
    get:
      summary: Returns for every U.S. state the median home sale price, average annual wage, and price-to-income ratio
      responses:
        '200':
          description: Housing affordability metrics by state
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    statename:
                      type: string
                    median_price:
                      type: number
                    avg_wage:
                      type: number
                    price_to_income_ratio:
                      type: number

  /job/{pctWorkforce}/{pctWage}:
    get:
      summary: For each state, returns all occupation titles with workforce share below pctWorkforce% and average wage above pctWage% of the state average
      parameters:
        - name: pctWorkforce
          in: path
          required: true
          description: Percentage upper bound on workforce share (e.g., 2.5 for 2.5%)
          schema:
            type: number
        - name: pctWage
          in: path
          required: true
          description: Minimum percentage the occupation's wage must exceed the state average
          schema:
            type: number
      responses:
        '200':
          description: Workforce analysis data
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    statename:
                      type: string
                    occupationtitle:
                      type: string
                    workforcepct:
                      type: number
                    occupationavgwage:
                      type: number
                    amountabovestateAvg:
                      type: number

  /job/{state}:
    get:
      summary: Returns the top occupations with the highest percentage share of total employment in the specified state
      parameters:
        - name: state
          in: path
          required: true
          description: Full state name
          schema:
            type: string
      responses:
        '200':
          description: Top occupations by employment share
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    occupationtitle:
                      type: string
                    emp:
                      type: integer
                    truepct:
                      type: number

  /housing/{state}/{propertyType}:
    get:
      summary: Returns the top 20 cities with the highest median sale price for a specific property type in the specified state
      parameters:
        - name: state
          in: path
          required: true
          description: Full state name
          schema:
            type: string
        - name: propertyType
          in: path
          required: true
          description: Type of property (e.g., "Single Family Residential", "Condo")
          schema:
            type: string
      responses:
        '200':
          description: Top 20 most expensive cities for the property type
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    city:
                      type: string
                    mediansaleprice:
                      type: number



