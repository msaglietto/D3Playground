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

require(['backbone', 'underscore', 'd3'], function(Backbone, _, ignore) {
    'use strict';
    var Namespace = {};

    Namespace.D3PieChart = Backbone.View.extend({
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


            var g = svg.selectAll(".arc")
                .data(pie(this.config.data))
                .enter().append("g")
                .attr("class", "arc");

            g.append("path")
                .attr("d", arc)
                .style("fill", function(d) {
                    if (config.colors.length === colorIndex) {
                        colorIndex = 0;
                    }
                    return d3.rgb(config.colors[colorIndex++]);
                });

            g.append("text")
                .attr("transform", function(d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .text(function(d) {
                    return d.data;
                });

            return this;
        }
    });

    Namespace.D3BarChart = Backbone.View.extend({
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
                .rangeRoundBands([0, config.width], .1);

            var y = d3.scale.linear()
                .range([config.height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var svg = d3.select(this.el).append("svg")
                .attr("width", config.width + config.margin.left + config.margin.right)
                .attr("height", config.height + config.margin.top + config.margin.bottom)
                .append("g")
                .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

            x.domain(_.range(config.data.length));
            y.domain([0, _.max(config.data)]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + config.height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency");

            svg.selectAll(".bar")
                .data(config.data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) {
                    return x(d);
                })
                .attr("width", x.rangeBand())
                .attr("y", function(d) {
                    return y(d);
                })
                .attr("height", function(d) {
                    return config.height - y(d);
                });

            return this;
        }
    });

    Namespace.D3RandomChartGenerator = Backbone.View.extend({
        template: _.template($("#btnGenerators").html()),
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
            var pie = new Namespace.D3PieChart({
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
            var bar = new Namespace.D3BarChart({
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
            var colors = [],
                numbers = '0123456789ABCDEF'.split(''),
                i, j, color;

            amount = amount || (Math.random() * 10) + 1;

            for (i = amount - 1; i >= 0; i -= 1) {
                color = '#';
                for (j = 0; j < 6; j += 1) {
                    color += numbers[Math.round(Math.random() * 15)];
                }
                colors.push(color);
            }
            return colors;
        }
    });

    var randomGenerator = new Namespace.D3RandomChartGenerator({
        el: ".charts"
    });

    randomGenerator.render();
});