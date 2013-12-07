require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery',
    underscore: '../bower_components/underscore/underscore',
    backbone: '../bower_components/backbone/backbone',
    d3: '../bower_components/d3/d3'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    d3: {
      exports: 'd3'
    }
  }
});

require(['backbone', 'underscore', 'bbChartGenerator/D3RandomChartGenerator'], function(Backbone, _, D3RandomChartGenerator) {
  'use strict';

  var randomGenerator = new D3RandomChartGenerator({
    el: '.charts'
  });

  randomGenerator.render();
});