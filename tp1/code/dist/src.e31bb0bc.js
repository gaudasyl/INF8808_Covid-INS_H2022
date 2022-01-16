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
})({"scripts/viz-helper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateHeader = updateHeader;
exports.generateData = generateData;
exports.getDotCount = getDotCount;
exports.updateInfoPanel = updateInfoPanel;
exports.styleCircles = styleCircles;

/**
 *   Builds the header for the webpage, including a title and welcome message.
 */
function updateHeader() {
  // TODO: Select the existing header element and append to it :
  //        * An 'h1' element with text : 'TP1'
  //        * A'div' element with text : 'Bienvenue au cours INF8808 : Visualisation de données.'
  var header = d3.select('header');
  header.append('h1').text('TP1');
  header.append('div').text('Bienvenue au cours INF8808 : Visualisation de données.');
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


function generateData() {
  // TODO: Generate the data structure described above and return it.
  var size = d3.randomUniform(1, 11)();
  var dataGenerator = d3.randomUniform(1, 100);
  var data = Array.from({
    length: size
  }, function () {
    return {
      x: Math.floor(dataGenerator()),
      y: Math.floor(dataGenerator())
    };
  });
  return data;
}
/**
 * @returns {number} The current number of circles displayed in the scatter plot.
 */


function getDotCount() {
  return d3.selectAll('.dot').nodes().length;
}
/**
 * Updates the text in the info panel below the graph so it displays the current circle count,
 * with the number displayed in bold.
 */


function updateInfoPanel() {
  // TODO: Get the current dot count and diplay it in the information panel.
  // Make sure the label says 'point' or 'points' depending how many points there are.
  // see : getDotCount()
  var nDots = getDotCount();
  d3.select('.dot-count').text(nDots);
  d3.select('.dot-label').text(nDots > 1 ? 'points' : 'point');
}
/**
 * Selects all the SVG circles and sets their visual appearance.
 * Sets their radius to 5 and their fill color to #07BEB8.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */


function styleCircles(g) {
  // TO DO: Select all the circles and set their fill and radius as specified above
  d3.selectAll('.dot').attr('fill', '#07BEB8').attr('r', 5);
}
},{}],"scripts/init.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateG = generateG;
exports.appendXAxis = appendXAxis;
exports.appendYAxis = appendYAxis;
exports.appendGraphLabels = appendGraphLabels;

/**
 * Generates the SVG element g which will contain the data visualisation.
 *
 * @param {object} margin The desired margins around the graph
 * @returns {*} The d3 Selection for the created g element
 */
function generateG(margin) {
  return d3.select('#example-graph').select('svg').append('g').attr('id', 'graph-g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
}
/**
 * Appends an SVG g element which will contain the x axis.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */


function appendXAxis(g) {
  g.append('g').attr('class', 'x axis');
}
/**
 * Appends an SVG g element which will contain the y axis.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */


function appendYAxis(g) {
  g.append('g').attr('class', 'y axis');
}
/**
 * Appends the labels for the x axis, the y axis and the title of the scatter graph.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */


function appendGraphLabels(g) {
  g.append('text').text('Axe x').attr('class', 'x axis-text');
  g.append('text').text('Axe y').attr('class', 'y axis-text').attr('transform', 'rotate(-90)');
  g.append('text').text('Mon premier graphique').attr('class', 'title');
}
},{}],"scripts/viz.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCanvasSize = setCanvasSize;
exports.updateXScale = updateXScale;
exports.updateYScale = updateYScale;
exports.drawXAxis = drawXAxis;
exports.drawYAxis = drawYAxis;
exports.positionLabels = positionLabels;
exports.updateData = updateData;
exports.positionCircles = positionCircles;
exports.setClickHandler = setClickHandler;

var _vizHelper = require("./viz-helper.js");

/**
 * Sets the size of the SVG canvas containing the graph.
 *
 * @param {number} width The desired width
 * @param {number} height The desired height
 */
function setCanvasSize(width, height) {
  d3.select('#example-graph').select('svg').attr('width', width).attr('height', height);
}
/**
 * Creates a linear scale to map the input domain to a position in x.
 *
 * @param {number} width The width of the graph
 * @returns {*} The x scale
 */


function updateXScale(width) {
  return d3.scaleLinear().domain([0, 100]).range([0, width]);
}
/**
 * Creates a linear scale to map the input domain to a position in y.
 *
 * @param {number} height The height of the graph
 * @returns {*} The y scale
 */


function updateYScale(height) {
  return d3.scaleLinear().domain([0, 100]).range([height, 0]);
}
/**
 * Draws the x axis at the bottom of the scatter plot.
 *
 * @param {*} xScale The scale to use for the x axis
 * @param {number} height The height of the graph
 */


function drawXAxis(xScale, height) {
  d3.select('.x.axis').attr('transform', 'translate(0, ' + height + ')').call(d3.axisBottom(xScale).ticks(5));
}
/**
 * Draws the y axis at the left of the scatter plot.
 *
 * @param {*} yScale The scale to use for the y axis
 */


function drawYAxis(yScale) {
  d3.select('.y.axis').call(d3.axisLeft(yScale).ticks(5));
}
/**
 * Positions the x axis label, y axis label and title label on the graph.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 * @param {number} width The width of the graph
 * @param {number} height The height of the graph
 */


function positionLabels(g, width, height) {
  g.select('.x.axis-text').attr('x', width / 2).attr('y', height + 50);
  g.select('.y.axis-text').attr('x', -50).attr('y', height / 2);
  g.select('.title').attr('x', width / 2).attr('y', -35);
}
/**
 * Binds the data to the scatter plot.
 *
 * @param {*} g  The d3 Selection of the graph's g SVG element
 * @param {object[]} data The data to use to generate the scatter plot
 */


function updateData(g, data) {
  g.selectAll('.dot').data(data).join('circle').attr('class', 'dot');
}
/**
 * Uses the data associated to each circle in the scatter plot to position it at its (x,y) coordinate.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 * @param {*} xScale The scale used to position the element in x
 * @param {*} yScale The scale used to position the element in x
 */


function positionCircles(g, xScale, yScale) {
  g.selectAll('.dot').attr('cx', function (d) {
    return xScale(d.x);
  }).attr('cy', function (d) {
    return yScale(d.y);
  });
}
/**
 * Handles clicks on the 'Actualiser" button. When clicked, the data is regenerated and
 * the display is updated.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 * @param {*} xScale The xScale used to display the graph
 * @param {*} yScale The xScale used to display the graph
 */


function setClickHandler(g, xScale, yScale) {
  d3.select('#update-btn').on('click', function () {
    updateData(g, (0, _vizHelper.generateData)());
    positionCircles(g, xScale, yScale);
    (0, _vizHelper.styleCircles)(g);
    (0, _vizHelper.updateInfoPanel)();
  });
}
},{"./viz-helper.js":"scripts/viz-helper.js"}],"index.js":[function(require,module,exports) {
'use strict';

var vizHelper = _interopRequireWildcard(require("./scripts/viz-helper.js"));

var init = _interopRequireWildcard(require("./scripts/init.js"));

var viz = _interopRequireWildcard(require("./scripts/viz.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * @file This file is the entry-point for the the code for TP1 for the course INF8808.
 * @author Olivia Gélinas
 * @version v1.0.0
 */
(function (d3) {
  var margin = {
    top: 85,
    right: 85,
    bottom: 80,
    left: 80
  };
  var padding = 50;
  var g = init.generateG(margin);
  init.appendXAxis(g);
  init.appendYAxis(g);
  init.appendGraphLabels(g);
  viz.updateData(g, vizHelper.generateData());
  vizHelper.updateHeader();
  vizHelper.updateInfoPanel();
  /**
   *   This function builds the graph and makes it interactive by setting up the click handler.
   */

  function build() {
    var maxWidth = d3.select('#example-graph').node().getBoundingClientRect().width;
    var svgSize = {
      width: maxWidth - padding * 2,
      height: 450
    };
    var graphSize = {
      width: svgSize.width - margin.right - margin.left,
      height: svgSize.height - margin.bottom - margin.top
    };
    viz.setCanvasSize(svgSize.width, svgSize.height);
    var xScale = viz.updateXScale(graphSize.width);
    var yScale = viz.updateYScale(graphSize.height);
    viz.drawXAxis(xScale, graphSize.height);
    viz.drawYAxis(yScale);
    viz.positionCircles(g, xScale, yScale);
    viz.positionLabels(g, graphSize.width, graphSize.height);
    vizHelper.styleCircles(g);
    viz.setClickHandler(g, xScale, yScale);
  }

  build();
  window.addEventListener('resize', function () {
    build();
  });
})(d3);
},{"./scripts/viz-helper.js":"scripts/viz-helper.js","./scripts/init.js":"scripts/init.js","./scripts/viz.js":"scripts/viz.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "39497" + '/');

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