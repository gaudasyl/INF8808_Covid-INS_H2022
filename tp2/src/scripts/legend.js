/**
 * Draws a legend in the area at the bottom of the screen, corresponding to the bars' colors
 *
 * @param {string[]} data The data to be used to draw the legend elements
 * @param {*} color The color scale used throughout the visualisation
 */
export function draw (data, color) {
  // Appending the '.legend-element' containers to the '.legend' div.
  let legendElements = d3.select('.legend')
    .selectAll('div')
    .data(data)
    .enter()
    .append('div')
    .classed('legend-element', true)

  // Formatting the svg rectangles to get the required shape.
  // PS: The '17' width attrbute for the SVG container is in order to look like the instructions
  legendElements.append('svg')
    .attr('height', 15)
    .attr('width', 17)
    .append('rect')
    .attr('height', 15)
    .attr('width', 15)
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('fill', currentData => color(currentData))

  // Add the name of the player
  legendElements.append('text').text(currentData => currentData)
}
