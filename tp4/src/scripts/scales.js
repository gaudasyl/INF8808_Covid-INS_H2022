/**
 * Defines the scale to use for the circle markers' radius.
 *
 * The radius of the circle is linearly proportinal to the population of the given country.
 *
 * The radius is a value defined in the interval [5, 20].
 *
 * @param {object} data The data to be displayed
 * @returns {*} The linear scale used to determine the radius
 */
export function setRadiusScale (data) {
  // Get both min & max values
  let minValuePopulation2000 = d3.min(data[2000], (country) => country.Population)
  let minValuePopulation2015 = d3.min(data[2015], (country) => country.Population)
  let maxValuePopulation2000 = d3.max(data[2000], (country) => country.Population)
  let maxValuePopulation2015 = d3.max(data[2015], (country) => country.Population)

  // Pick the global min/max between the 2 min/max values for 2000 and 2015 years.
  let minValuePopulation = d3.min([minValuePopulation2000, minValuePopulation2015])
  let maxValuePopulation = d3.max([maxValuePopulation2000, maxValuePopulation2015])

  // Setting the radius scale
  let radiusScale = d3.scaleLinear()
    .domain([minValuePopulation,maxValuePopulation])
    .range([5,20])
  
  return radiusScale
}

/**
 * Defines the color scale used to determine the color of the circle markers.
 *
 * The color of each circle is determined based on the continent of the country it represents.
 *
 * The possible colors are determined by the scheme d3.schemeCategory10.
 *
 * @param {object} data The data to be displayed
 * @returns {*} The ordinal scale used to determine the color
 */
export function setColorScale (data) {

  // Initiating a set to get all continents once
  let continents = new Set()

  // Capture each continent correctly
  Object.entries(data).forEach(([key,value]) => {
    value.forEach((row) => {
      continents.add(row.Continent)
    })
  })

  // Tuning the set into an array
  let arrayContinents = Array.from(continents)
  
  // Setting the color scale
  let colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(arrayContinents)

  return colorScale
}

/**
 * Defines the log scale used to position the center of the circles in X.
 *
 * @param {number} width The width of the graph
 * @param {object} data The data to be used
 * @returns {*} The linear scale in X
 */
export function setXScale (width, data) {
  // Get both min & max values
  let minValueGDP2000 = d3.min(data[2000], (country) => country.GDP)
  let minValueGDP2015 = d3.min(data[2015], (country) => country.GDP)
  let maxValueGDP2000 = d3.max(data[2000], (country) => country.GDP)
  let maxValueGDP2015 = d3.max(data[2015], (country) => country.GDP)

  // Pick the global min/max between the 2 min/max values for 2000 and 2015 years.
  let minValueGDP = d3.min([minValueGDP2000, minValueGDP2015])
  let maxValueGDP = d3.max([maxValueGDP2000, maxValueGDP2015])

  let xScale = d3.scaleLog()
    .domain([minValueGDP,maxValueGDP])
    .range([0, width])

  return xScale
}

/**
 * Defines the log scale used to position the center of the circles in Y.
 *
 * @param {number} height The height of the graph
 * @param {object} data The data to be used
 * @returns {*} The linear scale in Y
 */
export function setYScale (height, data) {
  // Get both min & max values
  let minValueCO22000 = d3.min(data[2000], (country) => country.CO2)
  let minValueCO22015 = d3.min(data[2015], (country) => country.CO2)
  let maxValueCO22000 = d3.max(data[2000], (country) => country.CO2)
  let maxValueCO22015 = d3.max(data[2015], (country) => country.CO2)

  // Pick the global min/max between the 2 min/max values for 2000 and 2015 years.
  let minValueCO2 = d3.min([minValueCO22000, minValueCO22015])
  let maxValueCO2 = d3.max([maxValueCO22000, maxValueCO22015])
  
  let yScale = d3.scaleLog()
    .domain([minValueCO2,maxValueCO2])
    .range([height, 0])

  return yScale
}
