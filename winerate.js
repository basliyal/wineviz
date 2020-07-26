var margin = {top: 10, right: 30, bottom: 30, left: 70},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#ratingcurve")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


d3.csv("https://raw.githubusercontent.com/basliyal/wineviz/master/winemag-data_first150k.csv", function(data){
  // X axis: scale and draw:
var x = d3.scaleLinear()
    .domain([70, 100])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width]);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    // text label for the x axis
    svg.append("text")
        .attr("transform",
              "translate(" + (width/2) + " ," +
                             (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Wine Points");

// set the parameters for the histogram
var histogram = d3.histogram()
    .value(function(d) { return d.points; })
    .domain(x.domain())
    .thresholds(x.ticks(42));
var bins = histogram(data);

// Y axis: scale and draw:
var y = d3.scaleLinear()
    .range([height, 0]);
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);
svg.append("g")
    .call(d3.axisLeft(y));

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "18px")
        .text("# of Wines");

svg.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
      .attr("height", function(d) { return height - y(d.length); })
      .style("fill", function(d){ if(d.x0<85){return "orange"} else {return "teal"}});

svg.append("line")
    .attr("x1", x(10) )
    .attr("x2", x(10) )
    .attr("y1", y(0))
    .attr("y2", y(30000))
    .attr("stroke", "grey")
    .attr("stroke-dasharray", "4")

svg.append("text")
  .attr("x", x(10))
  .attr("y", y(15000))
  .text("Threshold: 6.5 Quality rating")
  .style("font-size", "15px")

  svg.append("text")
          .attr("x", (width - 50))
          .attr("y", 20 - (margin.top / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "18px")
          .text("Wine Rating Curve");

svg.selectAll("g.tick text")
  .style("fill","green");

});
