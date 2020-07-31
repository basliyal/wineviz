
var val = JSON.parse(window.localStorage.getItem('value'));


var formatInteger = d3.format(",");
var formatDecimal = d3.format(",.2f");

function format(number){
return !(number % 1) ? formatInteger(number) : formatDecimal(number)
}


function drawtotal(){
var aggdata = d3.nest()
.key(function(d) { return d[2]; })
.rollup(function(v) { return v.length })
.entries(val)
.reduce(function(map, obj) {
    map[obj.key] = obj.value;
    return map;
}, {});
drawChart(aggdata, "Total Rating Counts by Country");
}



function drawChart(data){
var width = 1200,
    height = 700;


var projection = d3.geoMercator()
    .center([10, 50]) //long and lat starting position
    .scale(200) //starting zoom position
    .rotate([15,0]); //where world split occurs

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geoPath()
    .projection(projection);

    var keys = Object.keys(data);
    var values = keys.map(function(v) { return data[v]; });
    console.log(data);
var color =  d3.scaleLinear()
  .domain([0,d3.min(values), d3.max(values)])
  .range(['lightyellow', 'yellow', 'green']);


var g = svg.append("g");

// load and display the world and locations
d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json", function(error, topology) {
var world = g.selectAll("path")
				.data(topojson.object(topology, topology.objects.countries).geometries)
				.enter()
				.append("path")
				.attr("d", path)
        .attr("fill", function(d) { val = data[d.properties.name] ||0;
        return color(val);})
             .on("mouseover", function() {
               tooltip.style("visibility", "visible")
               tooltip.style("opacity", 1)
               })

               .on("mouseout", function() {
                 tooltip.style("visibility", "hidden")
                 tooltip.style("opacity", 0)
              })

                 .on("mousemove", function(d) {
                   tooltip.html("<p>" + "Avg. Value: " + format(data[d.properties.name]) + "<br>" + "Country" +": " + d.properties.name)
                   tooltip.style("left", (event.pageX) + "px")
                   tooltip.style("top", (event.pageY) + "px")
                 });


});


      // Prep the tooltip bits, initial display is hidden

      var tooltip =  d3.select("#winemap")
      .append("div")
      .attr("class", "tooltip")
}
