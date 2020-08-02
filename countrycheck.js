var margin = {top: 30, right: 50, bottom:110, left: 90},
width = 1100 - margin.left - margin.right,
height = 550 - margin.top - margin.bottom;

var formatInteger = d3.format(",");
var formatDecimal = d3.format(",.2f");

function format(number){
return !(number % 1) ? formatInteger(number) : formatDecimal(number)
}
var val = JSON.parse(window.localStorage.getItem('value'));

function drawtotal(){
  var all_count = 0;
  var all_total = 0;
var aggdata = d3.nest()
.key(function(d) { return d[2]; })
.rollup(function(v) {
  all_count += 1;
  all_total += v.length
  return v.length })
.entries(val)
.sort(function(a,b) {return d3.descending(a.value,b.value);})
drawChart(aggdata, "Total Rating Counts by Country", "Total",  "#0099f7",(all_total/all_count));
}



function drawquality(){
var all_count = 0;
var all_total = 0;
var qualityavg = d3.nest()
.key(function(d) { return d[2]; })
.rollup(function(v) {
  var count = v.length;
  var total = d3.sum(v, function(d) { return d[0] })
  all_count += count;
  all_total += total
  return total/count;

})
.entries(val)
.sort(function(a,b) {return d3.descending(a.value,b.value);})

drawChart(qualityavg,"Avg Wine Quality by Country", "Avg Quality Rating" , "#9aaf73" ,(all_total/all_count));

}

function drawprice(){
var all_count = 0;
var all_total = 0;
var priceavg = d3.nest()
.key(function(d) { return d[2]; })
.rollup(function(v) {
  var count = v.length;
  var total = d3.sum(v, function(d) { return d[1] })
  all_count += count;
  all_total += total
  return total/count;
})
.entries(val)
.sort(function(a,b) {return d3.descending(a.value,b.value);})
drawChart(priceavg, "Avg wine Price by Country", "Avg Price", "#A82B10", (all_total/all_count));
}


function drawChart(data, main, left, fill, avg) {
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

   var smallest = (d3.min(data, function(d) {return d.value || Infinity; }) -1)
  var max = d3.max(data, function(d) { return d.value;})

  // Add Y axis
  var y = d3.scaleLinear()
  .domain([smallest, max+ 5 ])
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
  .attr("y", y(smallest))
  .attr("height",0)
  .transition()
  .duration(800)
  .attr("y", function(d) { return y(d.value); })
  .attr("height", function(d) {
    return (height - y(d.value)) < 0 ? 0 : (height - y(d.value));
    return value;
 })
  .delay(function(d,i){return(i*50)})
  .style("fill-opacity", function(d) {
      return (d.value < avg) ? 0.4 : 0.8 })

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


      svg.append('line')
          .style("stroke", "#030056")
          .style("stroke-width", 1)
          .style("stroke-dasharray", "1,5")
          .attr("x1", 0)
          .attr("y1", y(avg))
          .attr("x2", width)
          .attr("y2", y(avg));

          svg.append("text")
          .attr("x", (width/2 +30 ))
          .attr("y", (y(avg) -10))
          .style("fill", "#bb070e")

          .attr("text-anchor", "middle")
          .style("font-size", "18px")
          .html("International average");


      var tooltip =  d3.select("#graph")
      .append("div")
      .attr("class", "tooltip")
    }
