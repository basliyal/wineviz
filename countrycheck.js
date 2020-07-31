var margin = {top: 30, right: 50, bottom: 70, left: 70},
width = 1100 - margin.left - margin.right,
height = 700 - margin.top - margin.bottom;

var formatInteger = d3.format(",");
var formatDecimal = d3.format(",.2f");

function format(number){
return !(number % 1) ? formatInteger(number) : formatDecimal(number)
}
var val = JSON.parse(window.localStorage.getItem('value'));


function drawtotal(){
var aggdata = d3.nest()
.key(function(d) { return d[2]; })
.rollup(function(v) { return v.length })
.entries(val)
.sort(function(a,b) {return d3.descending(a.value,b.value);})
drawChart(aggdata, "Total Rating Counts by Country", "Total",  "#69b3a2");
}



function drawquality(){
var qualityavg = d3.nest()
.key(function(d) { return d[2]; })
.rollup(function(v) {
  var count = v.length;
  var total = d3.sum(v, function(d) { return d[0] })
  return total/count;
})
.entries(val)
.sort(function(a,b) {return d3.descending(a.value,b.value);})
drawChart(qualityavg,"Avg Wine Quality by Country", "Avg Quality Rating" , "#CC9900" );

}

function drawprice(){
var priceavg = d3.nest()
.key(function(d) { return d[2]; })
.rollup(function(v) {
  var count = v.length;
  var total = d3.sum(v, function(d) { return d[1] })
  return total/count;
})
.entries(val)
.sort(function(a,b) {return d3.descending(a.value,b.value);})
drawChart(priceavg, "Avg wine Price by Country", "Avg Price", "#883300");
}


function drawChart(data, main, left, fill) {
  d3.select("#graph").select("svg").remove();
  d3.select("#intro").remove();

  var svg = d3.select("#graph")
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
  .attr("width", x.bandwidth())
  .attr("y", y(0))
  .attr("height",0)
  .transition()
  .duration(800)
  .attr("y", function(d) { return y(d.value); })
  .attr("height", function(d) { return height - y(d.value); })
  .delay(function(d,i){return(i*80)})
  .attr("fill", fill);

  svg.append("text")
  .attr("x", (width/2 ))
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .html(main);

  svg.selectAll("rect")

  .on("mouseover", function() {
    tooltip.style("visibility", "visible")
    tooltip.style("opacity", 1)
    d3.select(this).style("fill", "red");})


    .on("mouseout", function() {
      tooltip.style("visibility", "hidden")
      tooltip.style("opacity", 0)
      d3.select(this).style("fill", fill); })

      .on("mousemove", function(d) {
        tooltip.html("<p>" + "Avg. Value: " + format(d.value) + "<br>" + "Country" +": " + d.key)
        tooltip.style("left", (event.pageX) + "px")
        tooltip.style("top", (event.pageY) + "px")
      });

      // Prep the tooltip bits, initial display is hidden

      var tooltip =  d3.select("#graph")
      .append("div")
      .attr("class", "tooltip")
    }
