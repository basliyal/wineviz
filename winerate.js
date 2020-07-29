// first promise returns the dataset
function drawChart(dom, data,thresold, main, xax) {
  // set the dimensions and margins of the graph
  var margin = {top: 30, right: 50, bottom: 70, left: 70},
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  console.log(data);


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
    console.log(bins);

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
    .attr("y", y(0))
    .attr("width", function(d) { return x(d.x1) - x(d.x0) ; })
    .attr("height",height)
    .transition()
    .duration(800)
    .attr("y", function(d) { return y(0) - height })
    .attr("height", function(d) { return height - y(d.length); })

    .delay(function(d,i){return(i*50)})
    .style("fill", function(d){ if(d.x0<thresold){return "orange"} else {return "teal"}})

    svg.selectAll("rect")
    .on("mouseover", function() { tooltip.style("display", null);
    d3.select(this).style("fill", "red");})
.on("mouseout", function() { tooltip.style("display", "none");
d3.select(this).style("fill", function(d) {
               if(d.x0<thresold){return "orange"}
               else {return "teal"}
           }); })
.on("mousemove", function(d) {
  tooltip.attr("transform", "translate(" + x(d.x0) + ", " + d3.event.y/3 + ")")
  tooltip.select("text").text("Wine Count: "+d.length);
});


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
    .html("Thresold Indicator:"+thresold);


    svg.selectAll("g.tick text")
    .style("fill","green");


    // Prep the tooltip bits, initial display is hidden
var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");

tooltip.append("rect")
  .attr("width", 160)
  .attr("height", 20)
  .attr("fill", "yellow")

tooltip.append("text")
  .attr("x", 80)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "15px")
  .attr("font-weight", "bold");
  }
