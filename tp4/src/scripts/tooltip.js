/**
 * Defines the contents of the tooltip. See CSS for tooltip styling. The tooltip
 * features the country name, population, GDP, and CO2 emissions, preceded
 * by a label and followed by units where applicable.
 *
 * @param {object} d The data associated to the hovered element
 * @returns {string} The tooltip contents
 */
export function getContents (d) {
  // Generating the tooltip content in HTML
  const tooltip = `<div class='tooltip-value'> <b>Name:</b> ${d['Country Name']} </div>` +
    `<div class='tooltip-value'> <b>Population:</b> ${d.Population} </div>` +
    `<div class='tooltip-value'> <b>GDP:</b> ${d.GDP.toFixed(2)} $ (USD)</div>` +
    `<div class='tooltip-value'> <b>CO2 emissions:</b> ${d.CO2.toFixed(2)} metric tonnes</div>`
  return tooltip
}
