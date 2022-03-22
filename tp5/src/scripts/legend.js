import d3Legend from 'd3-svg-legend'

/**
 * Draws the color legend.
 *
 * @param {*} colorScale The color scale used for the legend
 * @param {*} g The d3 Selection of the SVG g elemnt containing the legend
 */
export function drawLegend (colorScale, g) {
  // Generating the graph legend container and place it conveniently.
  g.append('g')
    .attr('class', 'legendOrdinal')
    .attr('transform', 'translate(50,120)')
    .attr('font-family', 'Open Sans Condensed')

  // Using the d3-svg-legend library to setup the graph legend.
  var legendOrdinal = d3Legend.legendColor()
    .shape('path', d3.symbol().type(d3.symbolCircle).size(300)())
    .scale(colorScale)
    .title('Légende')

  // Calling the formerly created legend
  g.select('.legendOrdinal')
    .call(legendOrdinal)
}
