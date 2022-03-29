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

function compareDate (a, b) {
    if (a.date < b.date)
       return -1
    if (a.date > b.date)
       return 1
    return 0
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
    return new Date(dateArray[2], months[dateArray[1]], dateArray[0])
}

export function cleanData (data) {
    data = getOnlyValidEntries(data)
    let cleanData = data.map(function (d) {
        return { date: cleanDate(d.date), sport: d.sport }
    })
    cleanData.sort(compareDate)
    cleanData = cleanData.map(function (d, i) {
        let last7Days = 0
        cleanData.every((el) => {
            if (el.sport === d.sport && el.date <= d.date && el.date > d.date - 7) {
                last7Days += 1
            }
            return (el.date <= d.date && el.date > d.date - 7)
        })
        return { date: d.date, sport: d.sport, weeklyAvg: last7Days / 7 }
    })
    var check = new Set()
    cleanData.filter(obj => !check.has(obj[obj.date]) && check.add(obj[obj.date]))
    console.log(cleanData)
    return cleanData
}
