
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

var g = svg.append("g");

// load and display the world and locations
d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json", function(error, topology) {
var world = g.selectAll("path")
				.data(topojson.object(topology, topology.objects.countries).geometries)
				.enter()
				.append("path")
				.attr("d", path)
        .on('mouseover', function(d){
});
});
}
