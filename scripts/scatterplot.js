var margin = {top: 30, right: 50, bottom: 70, left: 70},
width = 850 - margin.left - margin.right,
height = 550 - margin.top - margin.bottom;

var formatInteger = d3.format(",");
var formatDecimal = d3.format(",.2f");

function format(number){
  return !(number % 1) ? formatInteger(number) : formatDecimal(number)
}


function scheduleA(event) {
  var val = JSON.parse(window.localStorage.getItem('value'));
  var sel = document.getElementById('countryList');
  var aggdata=  (sel.value === "Select a Country") ? val :
  val.filter(function(d) { return d[2] === sel.value  })
  drawChart(aggdata);
}


function drawChart(data) {
  d3.select("#plot").select("svg").remove();
  var svg = d3.select("#plot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
  "translate(" +  margin.left + "," + margin.top + ")");

  var xdata = data.map(function(d){ return parseInt(d[0])});
  var ydata = data.map(function(d){ return parseInt(d[1])});


  var x = d3.scaleLinear()
  .domain([d3.min(xdata, function(d) {return d }), d3.max(xdata, function(d) {return d })])
  .range([0, width]);
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

  svg.append("text")
  .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top) + ")")
  .style("text-anchor", "middle")
  .text("Wine Quality");


  var smallest = d3.min(ydata, function(d) {return d || 0});
  var max = d3.max(ydata, function(d) {return d}) || 0;

  // taking care of missing values
  mean = d3.mean(ydata) || 0
  ydata = Array.from(ydata, item => item || mean);

  var y = d3.scaleLinear()
  .domain([smallest, (max+30)])
  .range([ height, 0]);
  svg.append("g")
  .call(d3.axisLeft(y));


  var scale = d3.scaleLog()
  .domain([1, 151000])
  .range([10, 1]);

  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.right)
  .attr("x",0 - (height / 2))
  .style("text-anchor", "middle")
  .style("font-size", "13px")
  .text("Wine Price");

  svg.append('g')
  .selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function (d) {return x(d[0]); } )
  .attr("cy", function (d) {return y(d[1]); } )
  .attr("r", scale(data.length))
  .style("fill", "#69b3a2")


  svg.selectAll("circle")

  .on("mouseover", function() {
    tooltip.style("visibility", "visible")
    tooltip.style("opacity", 1)
    d3.select(this).style("fill", "red");})


    .on("mouseout", function() {
      tooltip.style("visibility", "hidden")
      tooltip.style("opacity", 0)
      d3.select(this).style("fill",  "#69b3a2"); })

      .on("mousemove", function(d) {
        tooltip.html("<p>" + "Wine Quality: " + format(d[0]) + "<br>" + "Wine Price" +": " + d[1])
        tooltip.style("left", (event.pageX) + "px")
        tooltip.style("top", (event.pageY) + "px")
      });


      svg.append("circle")
      .attr("cx", function (d) {return x(d3.mean(xdata)); } )
      .attr("cy", function (d) {return y(d3.mean(ydata)); } )
      .attr("r", 30)
      .style("fill-opacity", 0.2)
      .style("fill", "purple")


      svg.append("circle")
      .attr("cx", function (d) {return x(d3.mean(xdata)); } )
      .attr("cy", function (d) {return y(d3.mean(ydata)); } )
      .attr("r", scale(data.length))
      .style("fill", "#663300")


      var text_x = (x(d3.mean(xdata)) -  4*margin.right);
      var text_y = (y(d3.mean(ydata)) -  5*margin.top);


      svg.append("text")
      .attr("x", text_x)
      .attr("y", text_y)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .style("fill", "darkorange")

      .html("Avg Price/Quality point")

      var lineFunction = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      .curve(d3.curveLinear);


      var lineData = [
        { "x": (x(d3.mean(xdata)) -  4*margin.right ),   "y": (y(d3.mean(ydata)) -  5*margin.top + 2)},
        { "x": (x(d3.mean(xdata)) -  3.5*margin.right ),  "y": (y(d3.mean(ydata)) -  3*margin.top )},
        { "x": x(d3.mean(xdata)), "y": y(d3.mean(ydata))}
      ];

      var lineGraph = svg.append("path")
      .attr("d", lineFunction(lineData))
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("fill", "none");


      var tooltip =  d3.select("#plot")
      .append("div")
      .attr("class", "tooltip")
    }
