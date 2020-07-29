var margin = {top: 10, right: 30, bottom: 30, left: 70},
    width = 740 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg1 = d3.select("#countryrate").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var path = d3.geoPath();
var projection = d3.geoMercator()
      .scale(70)
      .center([0,20])
      .translate([width / 2, height / 2]);

var data = d3.map();
var colorScale = d3.scaleThreshold()
      .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
      .range(d3.schemeBlues[7]);
      var promises = [];

      promises.push(d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"))
      promises.push(d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv"))

      Promise.all(promises).function(d) {
        data.set(d.code, +d.pop)
        svg1.append("g")
          .selectAll("path")
          .data(topo.features)
          .enter()
          .append("path")
            // draw each country
            .attr("d", d3.geoPath()
              .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
              d.total = data.get(d.id) || 0;
              return colorScale(d.total);
            });
          }
