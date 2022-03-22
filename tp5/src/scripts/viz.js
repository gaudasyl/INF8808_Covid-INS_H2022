/**
 * Sets the domain of the color scale. Each type of site should have its own corresponding color.
 *
 * @param {*} color The color scale to be used
 * @param {object[]} data The data to be displayed
 */
export function colorDomain (color, data) {
  // Set the color domain
  // Initiating a set to get all continents once
  const siteTypes = new Set()
  // Capture each continent correctly
  data.features.forEach((feature) => {
    siteTypes.add(feature.properties.TYPE_SITE_INTERVENTION)
  })
  // Tuning the set into an array and sorting it
  const arraySiteTypes = Array.from(siteTypes)
  arraySiteTypes.sort(d3.ascending)
  // Setting the color scale
  color.domain(arraySiteTypes)
}

/**
 * Draws the map base of Montreal. Each neighborhood should display its name when hovered.
 *
 * @param {object[]} data The data for the map base
 * @param {*} path The path associated with the current projection
 * @param {Function} showMapLabel The function to call when a neighborhood is hovered
 */
export function mapBackground (data, path, showMapLabel) {
  // TODO : Generate the map background and set the hover handlers
  const g = d3.select('#map-g').selectAll('g')
    .data(data.features)
    .enter()
    .append('g')
  g.append('path')
    .attr('d', path)
    .attr('id', function (element) { return element.properties.NOM })
    .attr('class', 'area')
    .attr('stroke-width', 1)
    .attr('stroke', 'white')
    .attr('fill', 'lightgrey')
    .on('mouseover', function (element) {
      showMapLabel(element, path)
    })
}

/**
 * When a neighborhood is hovered, displays its name. The center of its
 * name is positioned at the centroid of the shape representing the neighborhood
 * on the map. Called when the neighborhood is hovered.
 *
 * @param {object[]} d The data to be displayed
 * @param {*} path The path used to draw the map elements
 */
export function showMapLabel (d, path) {
  // TODO : Show the map label at the center of the neighborhood
  // by calculating the centroid for its polygon
  const label = d.properties.NOM
  const pos = path.centroid(d.geometry)
  d3.select('#hoverMapLabel')
    .text(label)
    .attr('x', pos[0])
    .attr('y', pos[1])
}

/**
 * Displays the markers for each street on the map.
 *
 * @param {object[]} data The street data to be displayed
 * @param {*} color The color scaled used to determine the color of the circles
 * @param {*} panel The display panel, which should be dislayed when a circle is clicked
 */
export function mapMarkers (data, color, panel) {
  // TODO : Display the map markers.
  // Their color corresponds to the type of site and their outline is white.
  // Their radius is 5 and goes up to 6 while hovered by the cursor.
  // When clicked, the panel is displayed.
  d3.select('#marker-g')
    .selectAll('circle')
    .data(data.features)
    .enter()
    .append('circle')
    .classed('marker', true)
    .attr('r', 5)
    .attr('fill', (feature) => color(feature.properties.TYPE_SITE_INTERVENTION))
    .attr('stroke', 'white')
    .attr('stroke-width', 1)
    .on('mouseover', function (d) {
      d3.select(this).attr('r', 6)
    })
    .on('mouseout', function (d) {
      d3.select(this).attr('r', 5)
    })
    .on('click', (element) => panel.display(element, color))

  d3.select('#marker-g')
    .append('text')
    .attr('id', 'hoverMapLabel')
    .attr('text-anchor', 'middle')
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Open Sans Condensed')
    .attr('font-size', 12)
}
