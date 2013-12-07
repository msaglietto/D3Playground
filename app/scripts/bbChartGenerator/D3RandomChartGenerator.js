/*global define */
define(['backbone', 'underscore', 'bbChartGenerator/D3BarChart', 'bbChartGenerator/D3PieChart'], function(Backbone, _, D3BarChart, D3PieChart) {
  'use strict';

  return Backbone.View.extend({
    template: _.template('<div class="row-fluid btn-list"><button class="btn btn-primary js-buttonOne">Generate Pie</button><button class="btn btn-primary js-buttonTwo">Generate Bar</button></div>'),
    events: {
      'click .js-buttonOne': 'generatePie',
      'click .js-buttonTwo': 'generateBar'
    },
    initialize: function() {
      this.collection = new Backbone.Collection();
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    addToCollection: function(view) {
      this.collection.add(view);
      view.$el.on('click', _.bind(function() {
        this.collection.remove(view);
        view.remove();
      }, this));
    },
    generatePie: function() {
      var pie = new D3PieChart({
        config: {
          width: 400,
          height: 200,
          radius: 100,
          data: this.generateData(7),
          colors: this.generateColors(7)
        }
      });
      this.$el.append(pie.render().el);
      this.addToCollection(pie);
    },
    generateBar: function() {
      var bar = new D3BarChart({
        config: {
          width: 400,
          height: 200,
          radius: 100,
          data: this.generateData(5, 0, 200)
        }
      });
      this.$el.append(bar.render().el);
      this.addToCollection(bar);
    },
    generateData: function(amount, min, max) {
      var data = [],
        i;
      amount = amount || (Math.random() * 10) + 1;
      min = min || 3;
      max = max || 10;

      for (i = amount - 1; i >= 0; i -= 1) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }

      return data;
    },
    generateColors: function(amount) {
      var colors = [], i;

      amount = amount || (Math.random() * 10) + 1;

      for (i = amount - 1; i >= 0; i -= 1) {
        colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
      }
      return colors;
    }
  });
});