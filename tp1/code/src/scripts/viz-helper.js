/**
 *   Builds the header for the webpage, including a title and welcome message.
 */
export function updateHeader () {
  // TODO: Select the existing header element and append to it :
  //        * An 'h1' element with text : 'TP1'
  //        * A'div' element with text : 'Bienvenue au cours INF8808 : Visualisation de données.'
  var header = d3.select('header')
  header
    .append('h1')
    .text('TP1')
  header
    .append('div')
    .text('Bienvenue au cours INF8808 : Visualisation de données.')
}

/**
 *   Generates random data to be displayed in the scatter plot.
 *   The data must be a 2 X m array of randomly generated (x, y) coordinates, with :
 *
 *      - x : an integer in [1, 99],
 *      - y : an integer in [1, 99],
 *
 *   and where m is a random number in [1, 10]. Each coordinate is represented
 *   as an object with keys 'x' and 'y'. Each coordinate object is contained in the
 *   resulting array.
 *
 *   For example, the coordinates could be :
 *
 *             x  |  y
 *           ----------
 *             99 | 4
 *             27 | 89
 *             17 | 42
 *
 *   @returns {object[]} The generated data
 */

export function generateData () {
  // TODO: Generate the data structure described above and return it.
  const size = d3.randomUniform(1, 11)()
  const dataGenerator = d3.randomUniform(1, 100)

  const data = Array.from({length: size}, () => {
    return {
      x: Math.floor(dataGenerator()),
      y: Math.floor(dataGenerator())
    }
  })

  return data
}

/**
 * @returns {number} The current number of circles displayed in the scatter plot.
 */
export function getDotCount () {
  return d3.selectAll('.dot').nodes().length
}

/**
 * Updates the text in the info panel below the graph so it displays the current circle count,
 * with the number displayed in bold.
 */
export function updateInfoPanel () {
  // TODO: Get the current dot count and diplay it in the information panel.
  // Make sure the label says 'point' or 'points' depending how many points there are.
  // see : getDotCount()
  var nDots = getDotCount()
  d3.select('.dot-count')
    .text(nDots)
  d3.select('.dot-label')
    .text(nDots > 1 ? 'points' : 'point')
}

/**
 * Selects all the SVG circles and sets their visual appearance.
 * Sets their radius to 5 and their fill color to #07BEB8.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */
export function styleCircles (g) {
  // TO DO: Select all the circles and set their fill and radius as specified above
  d3.selectAll('.dot')
    .attr('fill', '#07BEB8')
    .attr('r', 5)
}
