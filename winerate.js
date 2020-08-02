var formatInteger = d3.format(",");
var formatDecimal = d3.format(",.2f");

function format(number){
  return !(number % 1) ? formatInteger(number) : formatDecimal(number)
}

// set the dimensions and margins of the graph
var margin = {top: 30, right: 50, bottom: 70, left: 70},
width = 500 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;


function drawChart(dom, data, main, xax) {

  var thresold = format(d3.mean(data))


  var data=data.filter((d)=>{return !isNaN(d)})
  .filter(function(d) { return d < 250 })

  var svg = d3.select(dom)
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
  "translate(" +  margin.left + "," + margin.top + ")");


  // X axis

  var x = d3.scaleLinear()
  .domain([d3.min(data), d3.max(data)])
  .range([0, width]);
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

  // text label for the x axis
  svg.append("text")
  .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top) + ")")
  .style("text-anchor", "middle")
  .text(xax);

  // set the parameters for the histogram
  var histogram = d3.histogram()
  .value(function(d) { return d })
  .domain(x.domain())
  .thresholds(x.ticks(42));
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear()
  .range([height, 0])
  .domain([0, d3.max(bins, function(d) { return d.length;})]);

  svg.append("g")
  .call(d3.axisLeft(y));

  // text label for the y axis
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.right)
  .attr("x",0 - (height / 2))
  .style("text-anchor", "middle")
  .style("font-size", "18px")
  .text("# of Wines");

  svg.selectAll("rect")
  .data(bins)
  .enter()
  .append("rect")
  .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")";})
  .attr("x", 0)
  .attr("width", function(d) { return x(d.x1) - x(d.x0) ; })
  .style("fill", function(d){ if(d.x0<thresold){return "#404080"} else {return "#69b3a2"}})
  .attr("y",  function(d) {return y(0) - y(d.length)} )
  .transition()
  .duration(800)
  .attr("y",  0 )
  .attr("height", function(d) { return height - y(d.length); })
  .delay(function(d,i){return(i*80)})


  svg.append('line')
  .style("stroke", "darkorange")
  .style("stroke-width", 3)
  .style("stroke-dasharray", "5,5")
  .attr("x1", x(thresold))
  .attr("y1", y(0))
  .attr("x2", x(thresold))
  .attr("y2", y(data.length));


  svg.append('line')
  .style("stroke", "black")
  .style("stroke-width", 0.5)
  .attr("x1", x(thresold)+20)
  .attr("y1", height - 9.5 *margin.top)
  .attr("x2", width - 2.6*margin.right)
  .attr("y2", height -  9.5 *margin.top);


  svg.append("text")
  .append('svg:tspan')
  .attr("x", (width - margin.right ))
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .html(main)
  .append('svg:tspan')
  .attr("x", (width - margin.right ))
  .attr('dy', 20)
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .style("fill", "darkorange")
  .html("Mean Value: "+thresold);


  svg.selectAll("g.tick text")
  .style("fill","green");



  svg.selectAll("rect")

  .on("mouseover", function() {
    tooltip.style("visibility", "visible")
    tooltip.style("opacity", 1)
    d3.select(this).style("fill", "red");})


    .on("mouseout", function() {
      tooltip.style("visibility", "hidden")
      tooltip.style("opacity", 0)
      d3.select(this).style("fill", function(d) {
        if(d.x0<thresold){return "#404080"}
        else {return "#69b3a2"}
      }); })

      .on("mousemove", function(d) {
        tooltip.html("<p>" + "Wine Count: " +d.length + "<br>" + xax +": " + d.x0)
        tooltip.style("left", (event.pageX) + "px")
        tooltip.style("top", (event.pageY) + "px")
      });

      
      var tooltip =  d3.select(dom)
      .append("div")
      .attr("class", "tooltip")

      svg.append("circle").attr("cx",300).attr("cy",130).attr("r", 6).style("fill", "#69b3a2")
      svg.append("circle").attr("cx",300).attr("cy",160).attr("r", 6).style("fill", "#404080")
      svg.append("text").attr("x", 320).attr("y", 130).text("Above Avg.").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("text").attr("x", 320).attr("y", 160).text("Below Avg.").style("font-size", "15px").attr("alignment-baseline","middle")


    }
