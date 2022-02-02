
/**
 * Sanitizes the names from the data in the "Player" column.
 *
 * Ensures each word in the name begins with an uppercase letter followed by lowercase letters.
 *
 * @param {object[]} data The dataset with unsanitized names
 * @returns {object[]} The dataset with properly capitalized names
 */
export function cleanNames (data) {

  // Uppercasing the first letter than lowercasing the rest of the text
  data.forEach(
    (currentData) => {
      currentData.Player = currentData.Player[0].toUpperCase() + currentData.Player.slice(1).toLowerCase()
    }
  );

  return data;
}

/**
 * Finds the names of the 5 players with the most lines in the play.
 *
 * @param {object[]} data The dataset containing all the lines of the play
 * @returns {string[]} The names of the top 5 players with most lines
 */
export function getTopPlayers (data) {
  
  // Count for each player the number of lines.
  let lineCounts = {};
  data.forEach(
    (currentData) => {
      currentData.Player in lineCounts ? lineCounts[currentData.Player]++ : lineCounts[currentData.Player] = 1;
    }
  );

  // Convert dictionary to list, then perform sorting, slice to get only top 5 and finally drop the line count.
  let topFivePlayers = Object.keys(lineCounts).map((player) => {return [player, lineCounts[player]]})
    .sort((a,b) => { return b[1] - a[1] })
    .slice(0,5)
    .map((currentData) => {return currentData[0]});

  // Return only the names of the top 5 players
    return topFivePlayers
}

/**
 * Transforms the data by nesting it, grouping by act and then by player, indicating the line count
 * for each player in each act.
 *
 * The resulting data structure ressembles the following :
 *
 * [
 *  { Act : ___,
 *    Players : [
 *     {
 *       Player : ___,
 *       Count : ___
 *     }, ...
 *    ]
 *  }, ...
 * ]
 *
 * The number of the act (starting at 1) follows the 'Act' key. The name of the player follows the
 * 'Player' key. The number of lines that player has in that act follows the 'Count' key.
 *
 * @param {object[]} data The dataset
 * @returns {object[]} The nested data set grouping the line count by player and by act
 */
export function summarizeLines (data) {
  
  // Instantiate an empty data structure
  let nestedData = [];

  data.forEach(
    (currentLine) => {
      // Define an object structure to simplify further additions to nested data
      let playerObject = {
        Player: "playerName",
        Count: 1 
      };

      // Using indices to make the link with our acts
      let currentAct = nestedData[currentLine.Act - 1];

      // If the act has not already been added to our nested dataset, add it
      if (!currentAct) {
        // Setup the name of the player before adding it
        playerObject.Player = currentLine.Player;

        // Creating a nested structure for the current act and the current player
        let actObject = {
          Act: currentLine.Act,
          Players: [playerObject]
        };

        // Adding it to the global structure
        nestedData.push(actObject);
      
      } else {
        // Get the current player in the current act
        let currentPlayer = currentAct.Players.find(data => data.Player === currentLine.Player);
        
        // If the player is already present, just increment his count
        if (currentPlayer){ currentPlayer.Count++; } 
        // Otherwise, add the player to the current act nested structure
        else {
          playerObject.Player = currentLine.Player;
          currentAct.Players.push(playerObject);
        }
      }
    }
  )
  return nestedData
}

/**
 * For each act, replaces the players not in the top 5 with a player named 'Other',
 * whose line count corresponds to the sum of lines uttered in the act by players other
 * than the top 5 players.
 *
 * @param {object[]} data The dataset containing the count of lines of all players
 * @param {string[]} top The names of the top 5 players with the most lines in the play
 * @returns {object[]} The dataset with players not in the top 5 summarized as 'Other'
 */
export function replaceOthers (data, top) {

  // Iterating on each act
  data.forEach(
    (currentAct) => {
      // Initializing a count of all other character lines
      let otherLinesCount = 0;

      // Iterate descending in order to not be disturbed by simultaneous deletion
      for(let i = currentAct.Players.length - 1; i >= 0; --i){
        if (top.indexOf(currentAct.Players[i].Player) === -1){
          otherLinesCount += currentAct.Players[i].Count
          currentAct.Players.splice(i,1)
        }
      }
      // Add the new player "Others" with the according line count
      let playerObject = {
        Player: 'Other',
        Count: otherLinesCount
      }
      currentAct.Players.push(playerObject)    
    }
  )
  return data
}
