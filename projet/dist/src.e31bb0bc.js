// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/viz.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawCount = DrawCount;
exports.DrawCovidViz = DrawCovidViz;
exports.DrawSmallMultiple = DrawSmallMultiple;

/* eslint-disable camelcase */

/* eslint-disable indent */
var MARGIN = {
  top: 30,
  right: 0,
  bottom: 30,
  left: 50
};
var SM_WIDTH = 275 - MARGIN.left - MARGIN.right;
var SM_HEIGHT = 275 - MARGIN.top - MARGIN.bottom;
var COVID_WIDTH = 700 - MARGIN.left - MARGIN.right;
var COVID_HEIGHT = 400 - MARGIN.top - MARGIN.bottom;
var LINE_COLOR = '#E83A14';
var COVID_STROKE_WIDTH = 1.5;
var FREQ_STROKE_WIDTH = 1;
var HOVER_CIRCLE_RADIUS = 2;
var GRIDLINE_STROKE_WIDTH = 0.5;
var GRIDLINE_COLOR = '#C4C4C4';
var selectedDate;
var MIN_DATE_SELECTION_DAYS = 30;
var mousedownDate;
var isMouseDown = false;
var xScaleSM;
var yScaleSM;
var xScaleCov;
var yScaleCov;
var covid_data_selected = 'cases';
/**
 * @param data
 * @param startDate
 * @param endDate
 */

function DrawCount(data, startDate, endDate) {
  var saved = 0;
  var total = 0;
  data.forEach(function (element) {
    total += Number(element.athletes);

    if (startDate <= element.date && element.date <= endDate) {
      saved += Number(element.athletes);
    }
  });
  d3.select('#training-count').text(saved);
  d3.select('#total-training-count').text("sur ".concat(total));
}
/**
 *
 */


var SELECTOR_TO_ATTR = {
  'cases': 'cases_moving_avg',
  'deaths': 'death_moving_avg',
  'hospitalisations': 'hospi_moving_avg'
};

function OnGymClosedHover(rect, opacity) {
  d3.select(rect).attr('opacity', opacity);
}
/**
 * @param data
 * @param startDate
 * @param endDate
 */


function DrawCovidViz(data, dataFermetures, startDate, endDate) {
  var svg = d3.select('#covid-svg').append('svg').attr('width', COVID_WIDTH + MARGIN.left + MARGIN.right).attr('height', COVID_HEIGHT + MARGIN.top + MARGIN.bottom).append('g').attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')'); // Add X axis --> it is a date format

  xScaleCov = d3.scaleTime().domain(d3.extent(data, function (d) {
    return new Date(d.date);
  })).range([0, COVID_WIDTH]);
  svg.append('g').attr('transform', 'translate(0,' + COVID_HEIGHT + ')').call(d3.axisBottom(xScaleCov)); // Add Y axis

  yScaleCov = d3.scaleLinear().domain([0, d3.max(data, function (d) {
    return Math.max(d.cases_moving_avg);
  })]).range([COVID_HEIGHT, 0]);
  var yAxis = svg.append('g').call(d3.axisLeft(yScaleCov)); // Add the cases line

  var line = svg.append('path').datum(data).style('pointer-events', 'none').attr('fill', LINE_COLOR).attr('fill-opacity', 0.2).attr('stroke', LINE_COLOR).attr('stroke-width', COVID_STROKE_WIDTH).attr('d', d3.area().x(function (d) {
    return xScaleCov(new Date(d.date));
  }).y1(function (d) {
    return yScaleCov(d.cases_moving_avg);
  }).y0(yScaleCov(0))); // Create the circle that travels along the curve of chart

  var circle = svg.append('g').append('circle').datum(data).classed('hover_circle_covid', true).style('fill', LINE_COLOR).attr('r', 3).style('opacity', 0); // Create the text that travels along the curve of chart

  var text = svg.append('g').append('text').datum(data).classed('hover_text_covid', true).style('opacity', 0).attr('text-anchor', 'left').attr('alignment-baseline', 'middle').style('font-weight', 'bold'); // Add closed gyms

  svg.append('g').classed('fermetures_gym', true).selectAll('rect').data(dataFermetures).enter().append('rect').attr('x', function (element) {
    return xScaleCov(element.start);
  }).attr('y', COVID_HEIGHT + 1).attr('width', function (element) {
    return xScaleCov(element.end) - xScaleCov(element.start);
  }).attr('height', 8).attr('fill', 'yellow').attr('opacity', 0.35).on('mouseover', function () {
    OnGymClosedHover(this, 0.85);
  }).on('mouseout', function () {
    OnGymClosedHover(this, 0.35);
  }); // Event listeners

  svg.append('rect').datum(data).style('fill', 'none').style('pointer-events', 'all').attr('y', 30).attr('width', COVID_WIDTH).attr('height', COVID_HEIGHT - 30).attr('id', 'covid').on('mouseover', mouseover).on('mousemove', function (d) {
    mousemove(this, d);
  }).on('mouseout', mouseout).on('mousedown', function (d) {
    mousedown(this, d);
  }).on('mouseup', mouseup); // ceate time windows

  svg.append('rect').style('pointer-events', 'none').style('fill', GRIDLINE_COLOR).style('opacity', 0.4).attr('class', 'time-window-left').attr('height', COVID_HEIGHT).attr('width', 0);
  svg.append('rect').style('pointer-events', 'none').style('fill', GRIDLINE_COLOR).style('opacity', 0.4).attr('x', COVID_WIDTH).attr('class', 'time-window-right').attr('height', COVID_HEIGHT).attr('width', 0); // What happens when the mouse move -> show the annotations at the right positions.

  /**
   *
   */

  function mouseover() {
    ShowHoverTextAndCircles(1);
  }
  /**
   * @param rect
   * @param d
   */


  function mousemove(rect) {
    // recover coordinate we need
    var dateOfMousPos = xScaleCov.invert(d3.mouse(rect)[0]);
    selectedDate = "".concat(dateOfMousPos.getFullYear(), "-").concat(String(dateOfMousPos.getMonth() + 1).padStart(2, '0'), "-").concat(String(dateOfMousPos.getDate()).padStart(2, '0'));
    UpdateHover();

    if (isMouseDown) {
      UpdateTimeWindow();
    }
  }

  function mouseout() {
    ShowHoverTextAndCircles(0);
    isMouseDown = false;
  }

  function mouseup() {
    isMouseDown = false;
  }

  function mousedown(rect) {
    var dateOfMousPos = xScaleCov.invert(d3.mouse(rect)[0]);
    mousedownDate = "".concat(dateOfMousPos.getFullYear(), "-").concat(String(dateOfMousPos.getMonth() + 1).padStart(2, '0'), "-").concat(String(dateOfMousPos.getDate()).padStart(2, '0'));
    isMouseDown = true;
  }

  function updateSelection() {
    var selector = document.getElementById('covid_data_select');
    var selection = selector.options[selector.selectedIndex].value;
    var attribute = SELECTOR_TO_ATTR[selection]; // update scale

    yScaleCov = d3.scaleLinear().domain([0, d3.max(data, function (d) {
      return Math.max(d[attribute]);
    })]).range([COVID_HEIGHT, 0]); // update line

    line.datum(data).transition().duration(500).attr('d', d3.area().x(function (d) {
      return xScaleCov(new Date(d.date));
    }).y1(function (d) {
      return yScaleCov(d[attribute]);
    }).y0(yScaleCov(0))); // update axis

    yAxis.transition().duration(500).call(d3.axisLeft(yScaleCov));
  }

  d3.select("#covid_data_select").on("change", updateSelection);
}
/**
 * @param data
 * @param startDate
 * @param endDate
 */


function DrawSmallMultiple(data, startDate, endDate) {
  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
  .key(function (d) {
    return d.sport;
  }).entries(data); // Order by frequency

  sumstat.sort(function (a, b) {
    return d3.sum(a.values.map(function (o) {
      return o.moving_avg;
    })) - d3.sum(b.values.map(function (o) {
      return o.moving_avg;
    }));
  }).reverse(); // Limit minimum number of visits

  var VISIT_THRESHOLD = 100;
  sumstat = sumstat.filter(function (a) {
    return d3.sum(a.values.map(function (o) {
      return o.moving_avg;
    })) > VISIT_THRESHOLD;
  }); // What is the list of groups?

  var allKeys = sumstat.map(function (d) {
    return d.key;
  }); // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available

  var svg = d3.select('#smallMultiple-svg').selectAll('uniqueChart').data(sumstat).enter().append('svg').attr('width', SM_WIDTH + MARGIN.left + MARGIN.right).attr('height', SM_HEIGHT + MARGIN.top + MARGIN.bottom).append('g').attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')'); // Add X axis --> it is a date format

  xScaleSM = d3.scaleTime().domain(d3.extent(data, function (d) {
    return new Date(d.date);
  })).range([0, SM_WIDTH]);
  svg.append('g').attr('class', 'x-axis-small-multiple').attr('transform', 'translate(0,' + SM_HEIGHT + ')').call(d3.axisBottom(xScaleSM).ticks(2)); // Add Y axis

  yScaleSM = d3.scaleLinear().domain([0, Math.ceil(d3.max(data, function (d) {
    return +d.moving_avg;
  }) / 10) * 10]).range([SM_HEIGHT, 0]);
  svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScaleSM).ticks(5)); // Add Y grid

  var yAxisGrid = d3.axisLeft(yScaleSM).tickSize(-SM_WIDTH).tickFormat('').ticks(5);
  svg.append('g').attr('class', 'y-axis-grid').attr('color', GRIDLINE_COLOR).attr('stroke-width', GRIDLINE_STROKE_WIDTH).call(yAxisGrid).call(function (g) {
    return g.select(".domain").remove();
  }); // This allows to find the closest X index of the mouse:

  var bisect = d3.bisector(function (d) {
    return d.date;
  }).left; // Draw the line

  svg.append('path').attr('class', 'small-multiple-line').style('pointer-events', 'none').attr('stroke', LINE_COLOR).attr('fill', 'none').attr('stroke-width', FREQ_STROKE_WIDTH).attr('d', function (d) {
    return d3.line().x(function (d) {
      return xScaleSM(new Date(d.date));
    }).y(function (d) {
      return yScaleSM(+d.moving_avg);
    })(d.values);
  }); // Create even listener

  svg.append('rect').style('fill', 'none').style('pointer-events', 'all').attr('width', SM_WIDTH).attr('height', SM_HEIGHT).attr('id', function (d) {
    return d.key;
  }).on('mouseover', mouseover).on('mousemove', function (d) {
    mousemove(this, d);
  }).on('mouseout', mouseout); // Create the circle that travels along the curve of chart

  svg.append('g').append('circle').classed('hover_circle', true).style('fill', LINE_COLOR).attr('r', HOVER_CIRCLE_RADIUS).style('opacity', 0); // Create the text that travels along the curve of chart

  svg.append('g').append('text').classed('hover_text', true).style('opacity', 0).attr('text-anchor', 'left').attr('alignment-baseline', 'middle').style('font-weight', 'bold'); // What happens when the mouse move -> show the annotations at the right positions.

  /**
   *
   */

  function mouseover() {
    ShowHoverTextAndCircles(1);
  }
  /**
   * @param rect
   * @param d
   */


  function mousemove(rect) {
    // recover coordinate we need
    var dateOfMousPos = xScaleSM.invert(d3.mouse(rect)[0]);
    selectedDate = "".concat(dateOfMousPos.getFullYear(), "-").concat(String(dateOfMousPos.getMonth() + 1).padStart(2, '0'), "-").concat(String(dateOfMousPos.getDate()).padStart(2, '0'));
    UpdateHover();
  }
  /**
   *
   */


  function mouseout() {
    ShowHoverTextAndCircles(0);
  } // Add title


  svg.append('text').attr('text-anchor', 'start').attr('y', -5).attr('x', 0).attr('font-size', 14).attr('font-weight', 'bold').classed('sm-title', true).text(function (d) {
    return d.key;
  }); // Add counter

  svg.append('text').attr('id', function (d) {
    return "".concat(d.key, "-counter");
  }).attr('text-anchor', 'start').attr('y', -10).attr('x', SM_WIDTH - 38).attr('font-size', 10).classed('sm-title', true).text("100"); // A définir la valeur que ça doit prendre
  // Add subtitle

  svg.append('text').attr('text-anchor', 'start').attr('y', -1).attr('x', SM_WIDTH - MARGIN.right - MARGIN.left - 16).attr('font-size', 10).classed('sm-title', true).text("entraî. sauvés");

  function computeSavedTraining(data) {
    var minDate = d3.min(xScaleSM.ticks());
    var minDateFormatted = "".concat(minDate.getFullYear(), "-").concat(String(minDate.getMonth() + 1).padStart(2, '0'), "-").concat(String(minDate.getDate()).padStart(2, '0'));
    var maxDate = d3.max(xScaleSM.ticks());
    var maxDateFormatted = "".concat(maxDate.getFullYear(), "-").concat(String(maxDate.getMonth() + 1).padStart(2, '0'), "-").concat(String(maxDate.getDate()).padStart(2, '0')); // Pour chaque sport, on refait ça ICIIII

    sport_dict = {};
    data.forEach(function (element) {
      if (!sport_dict.hasOwnProprty(element.sport)) {
        print(coucou);
      }
    });
    var saved_trainings = 0;
    data.forEach(function (element) {
      if (minDateFormatted <= element.date && element.date <= maxDateFormatted && element.sport == sport_name) {
        saved_trainings += Number(element.athletes);
      }
    });
    console.log(saved_trainings);
    d3.select("#Judo-counter").text(saved_trainings);
  }

  computeSavedTraining(data);
}
/**
 *
 */


function UpdateHover() {
  d3.select('#hover-date').text('hovered date: ' + selectedDate);
  UpdateHoverSMViz();
  UpdateHoverCovid();
}

function UpdateTimeWindow() {
  var a = new Date(mousedownDate);
  var b = new Date(selectedDate);
  var leftDate = a < b ? a : b;
  var rightDate = a > b ? a : b;
  selectedDate = [leftDate, rightDate]; // var timeDelta = rightDate - leftDate
  // var daysDelta = Math.ceil(timeDelta / (1000 * 60 * 60 * 24))
  // if (daysDelta < MIN_DATE_SELECTION_DAYS) {
  //     var daysToAdd = (MIN_DATE_SELECTION_DAYS - daysDelta) / 2
  //     leftDate.addDays(daysToAdd)
  //     rightDate.addDays(daysToAdd)
  // }

  d3.select('.time-window-left').attr('width', xScaleCov(leftDate));
  d3.select('.time-window-right').attr('x', xScaleCov(rightDate)).attr('width', COVID_WIDTH - xScaleCov(rightDate));
  UpdateTimeSM();
}

function UpdateTimeSM() {
  // update xScale
  xScaleSM.domain(selectedDate); // update xaxis

  d3.selectAll('.x-axis-small-multiple').transition().duration(5).call(d3.axisBottom(xScaleSM).ticks(2)); // update line

  function filterDateString(d) {
    var date = new Date(d.date);
    return selectedDate[0] <= date & date <= selectedDate[1];
  }

  d3.selectAll('.small-multiple-line').transition().duration(5).attr('d', function (d) {
    return d3.line().x(function (d) {
      return xScaleSM(new Date(d.date));
    }).y(function (d) {
      return yScaleSM(+d.moving_avg);
    })(d.values.filter(function (d) {
      return filterDateString(d);
    }));
  });
}
/**
 *
 */


function UpdateHoverSMViz() {
  d3.selectAll('.hover_circle').attr('cx', function (data) {
    return xScaleSM(new Date(data.values.find(function (element) {
      return element.date === selectedDate;
    }).date));
  }).attr('cy', function (data) {
    return yScaleSM(data.values.find(function (element) {
      return element.date === selectedDate;
    }).moving_avg);
  });
  var textOffsetX = 10;
  var textOffsetY = 20;
  d3.selectAll('.hover_text').attr('x', function (data) {
    var hoverData = data.values.find(function (element) {
      return element.date === selectedDate;
    });
    var xPos = xScaleSM(new Date(hoverData.date));

    if (xPos > SM_WIDTH / 2) {
      return xPos - 4 * textOffsetX;
    } else {
      return xPos + textOffsetX;
    }
  }).attr('y', function (data) {
    var hoverData = data.values.find(function (element) {
      return element.date === selectedDate;
    });
    return yScaleSM(hoverData.moving_avg) - textOffsetY;
  }).html(function (data) {
    var hoverData = data.values.find(function (element) {
      return element.date === selectedDate;
    });
    return parseInt(hoverData.moving_avg);
  });
}
/**
 *
 */


function UpdateHoverCovid() {
  var selector = document.getElementById('covid_data_select');
  var selection = selector.options[selector.selectedIndex].value;
  var attribute = SELECTOR_TO_ATTR[selection];
  d3.select('.hover_circle_covid').attr('cx', function (data) {
    return xScaleCov(new Date(data.find(function (element) {
      return element.date === selectedDate;
    }).date));
  }).attr('cy', function (data) {
    return yScaleCov(data.find(function (element) {
      return element.date === selectedDate;
    })[attribute]);
  });
  var textOffsetX = 10;
  var textOffsetY = 20;
  d3.selectAll('.hover_text_covid').attr('x', function (data) {
    var hoverData = data.find(function (element) {
      return element.date === selectedDate;
    });
    var xPos = xScaleCov(new Date(hoverData.date));

    if (xPos > SM_WIDTH / 2) {
      return xPos - 4 * textOffsetX;
    } else {
      return xPos + textOffsetX;
    }
  }).attr('y', function (data) {
    var hoverData = data.find(function (element) {
      return element.date === selectedDate;
    });
    return yScaleCov(hoverData[attribute]) - textOffsetY;
  }).html(function (data) {
    var hoverData = data.find(function (element) {
      return element.date === selectedDate;
    });
    return Math.round(hoverData[attribute]);
  });
}
/**
 * @param opacity
 */


function ShowHoverTextAndCircles(opacity) {
  d3.selectAll('.hover_text').style('opacity', opacity);
  d3.selectAll('.hover_circle').style('opacity', opacity);
  d3.selectAll('.hover_text_covid').style('opacity', opacity);
  d3.selectAll('.hover_circle_covid').style('opacity', opacity);

  if (opacity === 0) {
    d3.select('#hover-date').text('hovered date:');
  }
}
},{}],"index.js":[function(require,module,exports) {
/* eslint-disable indent */
'use strict'; // import d3Tip from 'd3-tip'

var viz = _interopRequireWildcard(require("./scripts/viz.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * @file This file is the entry-point for the the code for the Project for the course INF8808.
 * @author Matthieu Beaud ...
 * @version v1.0.0
 */
var fermeturesGym = [{
  start: new Date('2020-03-15'),
  end: new Date('2020-06-21')
}, {
  start: new Date('2020-10-08'),
  end: new Date('2021-03-21')
}, {
  start: new Date('2021-04-08'),
  end: new Date('2021-06-06')
}, {
  start: new Date('2021-12-20'),
  end: new Date('2022-02-13')
}]; // start and end dates to define

var startDate = new Date(2020, 0, 1);
var endDate = new Date(2022, 0, 1);
console.log('test');

(function (d3) {
  d3.csv('./moving_avg_dataset.csv').then(function (data) {
    console.log(data);
    viz.DrawCount(data, startDate, endDate);
    viz.DrawSmallMultiple(data, startDate, endDate);
  });
  d3.csv('./merged_covid_dataset.csv').then(function (data) {
    viz.DrawCovidViz(data, fermeturesGym, startDate, endDate);
  });
})(d3);
},{"./scripts/viz.js":"scripts/viz.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "2218" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map