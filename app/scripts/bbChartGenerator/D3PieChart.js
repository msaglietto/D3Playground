/*global define */
define(['backbone', 'underscore', 'd3'], function(Backbone, _, d3) {
  'use strict';

  return Backbone.View.extend({
    initialize: function() {
      var defaults = {
        width: 960,
        height: 500,
        radius: Math.min(960, 500) / 2,
        data: [1, 2, 3],
        colors: ['#ffeeaa']
      };
      this.config = _.extend(defaults, this.options.config);
    },
    render: function() {
      var colorIndex = 0,
        config = this.config;

      var arc = d3.svg.arc()
        .outerRadius(this.config.radius - 10)
        .innerRadius(0);

      var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
          return d;
        });

      var svg = d3.select(this.el).append('svg')
        .attr('width', this.config.width)
        .attr('height', this.config.height)
        .append('g')
        .attr('transform', 'translate(' + this.config.width / 2 + ',' + this.config.height / 2 + ')');


      var g = svg.selectAll('.arc')
        .data(pie(this.config.data))
        .enter().append('g')
        .attr('class', 'arc');

      g.append('path')
        .attr('d', arc)
        .style('fill', function() {
          if (config.colors.length === colorIndex) {
            colorIndex = 0;
          }
          return d3.rgb(config.colors[colorIndex++]);
        });

      g.append('text')
        .attr('transform', function(d) {
          return 'translate(' + arc.centroid(d) + ')';
        })
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .text(function(d) {
          return d.data;
        });

      return this;
    }
  });
});