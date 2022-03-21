/**
 * Positions the x axis label and y axis label.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 * @param {number} width The width of the graph
 * @param {number} height The height of the graph
 */
export function positionLabels (g, width, height) {
  // Positioning the axes labels
  g.select('.x.axis-text')
    .attr('x', width / 2)
    .attr('y', height + 30)
  g.select('.y.axis-text')
    .attr('x', -30)
    .attr('y', height / 2)
}

/**
 * Draws the circles on the graph.
 *
 * @param {object} data The data to bind to
 * @param {*} rScale The scale for the circles' radius
 * @param {*} colorScale The scale for the circles' color
 */
export function drawCircles (data, rScale, colorScale) {
  
  // Drawing the bubble chart's circles, details are defined as follows :
  // Each circle's size depends on its population
  // and each circle's color depends on its continent.
  // The fill opacity of each circle is 70%
  // The outline of the circles is white
  d3.select('g')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .classed('data', true)
    .attr('r', (country) => rScale(country.Population))
    .attr('fill', (country) => colorScale(country.Continent))
    .attr('stroke', 'white')
    .attr('stroke-width', 1)
    .attr('opacity', 0.7)
}

/**
 * Sets up the hover event handler. The tooltip should show on on hover.
 *
 * @param {*} tip The tooltip
 */
export function setCircleHoverHandler (tip) {

  // Setup-ing the hover handler (opacity effect & tooltip content)
  d3.selectAll('.data')
    .on('mouseover', function (element) {
      d3.select(this).style('opacity', 1)
      tip.show(element, this)
    })
    .on('mouseout', function () {
      d3.select(this).style('opacity', 0.7)
      tip.hide(this)
    })
}

/**
 * Updates the position of the circles based on their bound data. The position
 * transitions gradually.
 *
 * @param {*} xScale The x scale used to position the circles
 * @param {*} yScale The y scale used to position the circles
 * @param {number} transitionDuration The duration of the transition
 */
export function moveCircles (xScale, yScale, transitionDuration) {

  // Creating the transition and place the circle conviently (according to GDP & CO2)
  d3.selectAll('.data')
    .transition()
    .ease(d3.easeLinear)
    .duration(transitionDuration)
    .attr('cx', (country) => xScale(country.GDP))
    .attr('cy', (country) => yScale(country.CO2))
}

/**
 * Update the title of the graph.
 *
 * @param {number} year The currently displayed year
 */
export function setTitleText (year) {
  // Setting the title according to the year displayed
  d3.select('.title').text('Data for year : ' + year)
}
