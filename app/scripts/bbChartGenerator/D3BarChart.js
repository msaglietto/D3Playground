/*global define */
define(['backbone', 'underscore', 'd3'], function(Backbone, _, d3) {
  'use strict';

  return Backbone.View.extend({
    initialize: function() {
      var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      };
      var defaults = {
        margin: margin,
        width: 960 - margin.left - margin.right,
        height: 500 - margin.top - margin.bottom,
        data: [1, 2, 3]
      };
      this.config = _.extend(defaults, this.options.config);
    },
    render: function() {
      var config = this.config;
      var x = d3.scale.ordinal()
        .rangeRoundBands([0, config.width], 0.1);

      var y = d3.scale.linear()
        .range([config.height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

      var svg = d3.select(this.el).append('svg')
        .attr('width', config.width + config.margin.left + config.margin.right)
        .attr('height', config.height + config.margin.top + config.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

      x.domain(_.range(config.data.length));
      y.domain([0, _.max(config.data)]);

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + config.height + ')')
        .call(xAxis);

      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Frequency');

      svg.selectAll('.bar')
        .data(config.data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d, ix) {
          return x(ix);
        })
        .attr('width', x.rangeBand())
        .attr('y', function(d) {
          return y(d);
        })
        .attr('height', function(d) {
          return config.height - y(d);
        });

      return this;
    }
  });
});