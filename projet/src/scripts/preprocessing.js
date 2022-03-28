/* eslint-disable indent */

const months =
{
    janvier: 1,
    février: 2,
    mars: 3,
    avril: 4,
    mai: 5,
    juin: 6,
    juillet: 7,
    août: 8,
    septembre: 9,
    octobre: 10,
    novembre: 11,
    décembre: 12
}


//setting sorting method for our data
Array.prototype.sortOn = function (key) {
    this.sort(function (a, b) {
        if (a[key] < b[key]) {
            return -1
        } else if (a[key] > b[key]) {
            return 1
        }
        return 0
    })
}



/**
 * @param data
 */
export function getOnlyValidEntries (data) {
    return data.filter(x => x.etat === 'Accepté')
}

/**
 * @param data
 */
export function getDateAndGroupBySport (data) {
    const sports = {}
    data.forEach(entry => {
        if (sports[entry.sport] == null) {
            sports[entry.sport] = []
        }
        const cd = cleanDate(entry.date)
        sports[entry.sport].push(cd)
    })
    return sports
}

/**
 * @param data
 */
export function getSportEntriesgroupByDays (data) {
    const sportsEntriesByDay = {}
    Object.keys(data).forEach(function (sport) {
        sportsEntriesByDay[sport] = []
        const days = {}
        data[sport].forEach(function (date) {
            if (days[date] == null) {
                days[date] = 1
            }
            days[date] += 1
        })
        Object.keys(days).forEach(function (d) {
            sportsEntriesByDay[sport].push({ date: d3.timeParse('%Y-%m-%d')(d), entries: Number(days[d]) })
        })

        sportsEntriesByDay[sport].sortOn('date')
    })
    return sportsEntriesByDay
}

/**
 * @param date
 */
function cleanDate (date) {
    const dateArray = date.split(' ')
    const d = dateArray[2] + '-' + months[dateArray[1]] + '-' + dateArray[0]
    return d
}
