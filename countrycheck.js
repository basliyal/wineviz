
function drawChart(dom, data, main, left, fill) {
  var margin = {top: 30, right: 50, bottom: 70, left: 70},
  width = 1000 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

  var svg = d3.select(dom)
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
  "translate(" +  margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.key; }))
  .padding(0.2);

  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
  .domain([d3.min(data, function(d) { return d.value;}), d3.max(data, function(d) { return d.value;})])
  .range([ height, 0]);
  svg.append("g")
  .call(d3.axisLeft(y));

  // text label for the y axis
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.right)
  .attr("x",0 - (height / 2))
  .style("text-anchor", "middle")
  .style("font-size", "13px")
  .text(left);

  // Bars
  svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", function(d) { return x(d.key); })
  .attr("y", function(d) { return y(d.value); })
  .attr("width", x.bandwidth())
  .attr("height", function(d) { return height - y(d.value); })
  .attr("fill", fill);

  svg.append("text")
  .attr("x", (width/2 ))
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .html(main);

}
