
/**
 * Sets the domain of the color scale
 *
 * @param {*} colorScale The color scale used in the heatmap
 * @param {object[]} data The data to be displayed
 */
export function setColorScaleDomain (colorScale, data) {
  // Getting the min and max values using d3 tools.
  let maxValueCount = d3.max(data, (data) => data.Counts)
  let minValueCount = d3.min(data, (data) => data.Counts)

  // Updating the xScale accordingly.
  colorScale.domain([minValueCount, maxValueCount])
}

/**
 * For each data element, appends a group 'g' to which an SVG rect is appended
 *
 * @param {object[]} data The data to use for binding
 */
export function appendRects (data) {
  // TODO : Creating our rects in the dedicated #graph-g frame.
  d3.select('#graph-g')
    .append('g').attr('class', 'data')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('g')
    .append('rect')
}

/**
 * Updates the domain and range of the scale for the x axis
 *
 * @param {*} xScale The scale for the x axis
 * @param {object[]} data The data to be used
 * @param {number} width The width of the diagram
 * @param {Function} range A utilitary funtion that could be useful to generate a list of numbers in a range
 */
export function updateXScale (xScale, data, width, range) {
  // Getting the min and max values using d3 tools.
  let minValueYear = d3.min(data, (data) => data.Plantation_Year)
  let maxValueYear = d3.max(data, (data) => data.Plantation_Year)

  // Updating the xScale accordingly.
  xScale.domain(range(minValueYear,maxValueYear))
    .range([0,width])
}

/**
 * Updates the domain and range of the scale for the y axis
 *
 * @param {*} yScale The scale for the y axis
 * @param {string[]} neighborhoodNames The names of the neighborhoods
 * @param {number} height The height of the diagram
 */
export function updateYScale (yScale, neighborhoodNames, height) {
  
  // Sorting the neighborhood names alphabetically
  let sortedNeighborhoodNames = neighborhoodNames.sort((a,b) => {
    return d3.ascending(a,b)
  })

  // Updating the Y scale with the sorted neighborhoods.
  yScale
    .domain(sortedNeighborhoodNames)
    .range([0, height])
  
}

/**
 *  Draws the X axis at the top of the diagram.
 *
 *  @param {*} xScale The scale to use to draw the axis
 */
export function drawXAxis (xScale) {
  // Drawing the X axis using a top axis.
  d3.select('.x.axis')
    .call(d3.axisTop(xScale))
}

/**
 * Draws the Y axis to the right of the diagram.
 *
 * @param {*} yScale The scale to use to draw the axis
 * @param {number} width The width of the graphic
 */
export function drawYAxis (yScale, width) {
  // Drawing Y axis using a right one and shifting it to the right of the diagram.
  d3.select('.y.axis')
    .call(d3.axisRight(yScale))
    .attr('transform','translate(' + width + ',0)')
}

/**
 * Rotates the ticks on the X axis 45 degrees towards the left.
 */
export function rotateXTicks () {
  // Rotating the ticks negatively in order to look like the demo.
  d3.select(".x.axis")
    .selectAll('text')
      .attr("transform", "rotate(-45)");
}

/**
 * After the rectangles have been appended, this function dictates
 * their position, size and fill color.
 *
 * @param {*} xScale The x scale used to position the rectangles
 * @param {*} yScale The y scale used to position the rectangles
 * @param {*} colorScale The color scale used to set the rectangles' colors
 */
export function updateRects (xScale, yScale, colorScale) {
  // Updating rectangles according to the formerly defined scales.
  d3.select('#graph-g')
    .selectAll('rect')
    .attr('x', (data) => xScale(data.Plantation_Year))
    .attr('y', (data) => yScale(data.Arrond_Nom))
    .attr('fill', (data) => colorScale(data.Counts))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())

}
