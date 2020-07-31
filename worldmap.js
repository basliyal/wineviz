
var val = JSON.parse(window.localStorage.getItem('value'));
var aggdata = d3.nest()
.key(function(d) { return d[2]; })
.rollup(function(v) { return v.length })
.entries(val)
.reduce(function(map, obj) {
    map[obj.key] = obj.val;
    return map;
}, {});

var qualityavg = d3.nest()
.key(function(d) { return d[2]; })
.rollup(function(v) {
  var count = v.length;
  var total = d3.sum(v, function(d) { return d[0] })
  return total/count;
})
.entries(val)
.sort(function(a,b) {return d3.descending(a.value,b.value);})

var priceavg = d3.nest()
.key(function(d) { return d[2]; })
.rollup(function(v) {
  var count = v.length;
  var total = d3.sum(v, function(d) { return d[1] })
  return total/count;
})
.entries(val)
.sort(function(a,b) {return d3.descending(a.value,b.value);})



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
    console.log(values);
var color =  d3.scaleLinear()
  .domain([0,d3.mean(values), d3.max(values)])
  .range(['yellow', 'green', 'blue']);


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
        .on('mouseover', function (d) {
          console.log(data) ;
             console.log(data[d.properties.name])});
});
}
