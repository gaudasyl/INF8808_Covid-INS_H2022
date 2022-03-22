/**
 * Displays the information panel when a marker is clicked.
 *
 * @param {object} d The data bound to the clicked marker
 * @param {*} color The color scale used to select the title's color
 */
export function display (d, color) {

  // Making the panel visible.
  const panel = d3.select('#panel').style('visibility', 'visible')

  // Cleaning its content.
  panel.selectAll('*').remove()

  // Adding the close button and its click listener
  panel.append('div')
    .style('text-align', 'right')
    .style('font-family', 'Open Sans Condensed')
    .style('font-size', '12px')
    .style('cursor', 'pointer')
    .text('FERMER')
    .on('click', () => panel.style('visibility', 'hidden'))

  // Initiating the panel title container and style.
  const title = panel
    .append('div')
    .style('font-family', 'Oswald')
    .style('font-size', '24px')

  // Set its content (title).
  setTitle(title, d, color)

  // Initialising the panel mode container and style.
  const mode = panel
    .append('div')
    .style('font-family', 'Oswald')
    .style('font-size', '16px')

  // Set its content (mode).
  setMode(mode, d)

  // Initialising the objectives container and style (if there are objectives only).
  if (d.properties.OBJECTIF_THEMATIQUE) {
    const theme = panel
      .append('div')
      .attr('class', 'theme')
      .style('font-family', 'Open Sans Condensed')
      .style('font-size', '16px')
      .text('Thématique : ')
    
    // Set its content (objectives).
    const list = theme.append('ul')
    d.properties.OBJECTIF_THEMATIQUE.split('\n').forEach(element => {
      setTheme(list, element)
    })
  }
}

/**
 * Displays the title of the information panel. Its color matches the color of the
 * corresponding marker on the map.
 *
 * @param {*} g The d3 selection of the SVG g element containing the title
 * @param {object} d The data to display
 * @param {*} color The color scale to select the title's color
 */
function setTitle (g, d, color) {
  // Appending the title and its according color.
  g.append('text')
    .text(d.properties.NOM_PROJET)
    .style('color', color(d.properties.TYPE_SITE_INTERVENTION))
}

/**
 * Displays the mode in the information panel.
 *
 * @param {*} g The d3 selection of the SVG g element containing the mode
 * @param {object} d The data to display
 */
function setMode (g, d) {
  // Appending the correct mode and its content.
  g.append('text')
    .text(d.properties.MODE_IMPLANTATION)
}

/**
 * Displays the themes in the information panel. Each theme is appended
 * as an HTML list item element.
 *
 * @param {*} g The d3 selection of the SVG g element containing the themes
 * @param {object} d The data to display
 */
function setTheme (g, d) {
  // Appending a list element representing the given theme
  g.append('li').text(d)
}
