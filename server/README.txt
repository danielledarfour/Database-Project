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
      summary:

  /state/{year}:
    get:
      summary:

  /housing/{state}/{year}:
    get:
      summary:

  /crime/{year}/{pct}:
    get:
      summary:

  /crime/{state}:
    get:
      summary:



