/**
 * Defines the contents of the tooltip. See CSS for tooltip styling. The tooltip
 * features the country name, population, GDP, and CO2 emissions, preceded
 * by a label and followed by units where applicable.
 *
 * @param {object} d The data associated to the hovered element
 * @returns {string} The tooltip contents
 */
export function getContents (d) {
  // TODO : Generate tooltip contents
  console.log(d)
  const tooltip = "<div id='tooltip-value'> TO DO (data undefined ...) </div>"
  // `<div id='tooltip-value'> Name: ${d['Country Name']} </div>` +
  //   `<div class='tooltip-value'> Population ${d.Population}</div>` +
  //   `<div class='tooltip-value'> GDP: ${d.GDP}</div>` +
  //   `<div class='tooltip-value'> CO2 emissions: ${d.CO2}</div>`

  return tooltip
}
