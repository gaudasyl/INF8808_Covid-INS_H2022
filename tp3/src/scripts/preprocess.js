/**
 * Gets the names of the neighborhoods.
 *
 * @param {object[]} data The data to analyze
 * @returns {string[]} The names of the neighorhoods in the data set
 */
export function getNeighborhoodNames (data) {
  // Return the neihborhood names
  let neighborhoodsNames = []
  data.forEach(
    (currentData) => {
      const found = neighborhoodsNames.find(name => name == currentData.Arrond_Nom)
      if(!found) {
        neighborhoodsNames.push(currentData.Arrond_Nom)
      }
    }
  )

  return neighborhoodsNames
}

/**
 * Filters the data by the given years.
 *
 * @param {object[]} data The data to filter
 * @param {number} start The start year (inclusive)
 * @param {number} end The end year (inclusive)
 * @returns {object[]} The filtered data
 */
export function filterYears (data, start, end) {
  // Filter the data by years
  let filteredData = []
  data.forEach(
    (currentData) => {
      const year = currentData.Date_Plantation.getFullYear()

      if(start <= year && year <= end){
        filteredData.push(currentData)
      }
    }
  )

  return filteredData
}

/**
 * Summarizes how many trees were planted each year in each neighborhood.
 *
 * @param {object[]} data The data set to use
 * @returns {object[]} A table of objects with keys 'Arrond_Nom', 'Plantation_Year' and 'Counts', containing
 * the name of the neighborhood, the year and the number of trees that were planted
 */
export function summarizeYearlyCounts (data) {
  // Construct the required data table
  let yearlyCount = []
  
  data.forEach(
    (currentData) => {

      const year = currentData.Date_Plantation.getFullYear()
      
      // Create the new Object
      let newObj = {
        Arrond_Nom: currentData.Arrond_Nom,
        Plantation_Year: year,
        Counts: 1
      }
      
      // Count the repetition of the tree planted at a place at a specific year
      let filter = yearlyCount.find(element => element.Arrond_Nom == currentData.Arrond_Nom && element.Plantation_Year == year)
      if(filter ==  null){
        yearlyCount.push(newObj)
      }
      else {
        filter.Counts++;
      }
    
    }
  )

  return yearlyCount
}

/**
 * For the heat map, fills empty values with zeros where a year is missing for a neighborhood because
 * no trees were planted or the data was not entered that year.
 *
 * @param {object[]} data The datas set to process
 * @param {string[]} neighborhoods The names of the neighborhoods
 * @param {number} start The start year (inclusive)
 * @param {number} end The end year (inclusive)
 * @param {Function} range A utilitary function that could be useful to get the range of years
 * @returns {object[]} The data set with a new object for missing year and neighborhood combinations,
 * where the values for 'Counts' is 0
 */
export function fillMissingData (data, neighborhoods, start, end, range) {
  // Find missing data and fill with 0
  const myRange = range(start, end)

  neighborhoods.forEach(
    (name) => {
      // For each neighborhoods add the missing years
      let nameData = data.filter(element => element.Arrond_Nom == name)
      
      myRange.forEach(
        (year) => {
          
          let obj = nameData.find(element => element.Plantation_Year === year);
          
          // Create the object of the neighborhood at the missing year
          if(obj == null){
            let newObj = {
              Arrond_Nom: name,
              Plantation_Year: year,
              Counts: 0
            }
            data.push(newObj)
          }
        } 
      )

      
    }
  )
  return data
}
