var margin = {top: 10, right: 30, bottom: 30, left: 70},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


var projection = d3.geoMercator()
.scale(width / 3 / Math.PI)
      //.scale(100)
      .translate([width / 3, height / 3])

var svg1 = d3.select("#countryrate").append("svg")

var path = d3.geoPath()
 .projection(projection);

 var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
 d3.json(url, function(err, geojson) {
   svg1.append("path")
     .attr("d", path(geojson))
});
