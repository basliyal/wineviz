var width = 1050,
height = 600;

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

var formatInteger = d3.format(",");
var formatDecimal = d3.format(",.2f");

function format(number){
  return !(number % 1) ? formatInteger(number) : formatDecimal(number)
}


function drawtotal(){
  var val = JSON.parse(window.localStorage.getItem('value'));

  var aggdata = d3.nest()
  .key(function(d) { return d[2]; })
  .rollup(function(v) { return v.length })
  .entries(val)
  .reduce(function(map, obj) {
    map[obj.key] = obj.value;
    return map;
  }, {});
  drawChart(aggdata, "Total Rating Counts by Country", "Total" );
}

function drawquality(){
  var val = JSON.parse(window.localStorage.getItem('value'));

  var qualityavg = d3.nest()
  .key(function(d) { return d[2]; })
  .rollup(function(v) {
    var count = v.length;
    var total = d3.sum(v, function(d) { return d[0] })
    return total/count;
  })
  .entries(val)
  .reduce(function(map, obj) {
    map[obj.key] = obj.value;
    return map;
  }, {});
  drawChart(qualityavg,"Avg Wine Quality by Country", "Avg Quality Rating" );
}

function drawprice(){
  var val = JSON.parse(window.localStorage.getItem('value'));

  var priceavg = d3.nest()
  .key(function(d) { return d[2]; })
  .rollup(function(v) {
    var count = v.length;
    var total = d3.sum(v, function(d) { return d[1] })
    return total/count;
  })
  .entries(val)
  .reduce(function(map, obj) {
    map[obj.key] = obj.value;
    return map;
  }, {});
  drawChart(priceavg, "Avg wine Price by Country", "Avg Price");
}

function drawChart(data, title, xval){

  d3.select("#winemap").select("svg").remove();

  var projection = d3.geoMercator()
  .center([10, 50])
  .scale(130)
  .rotate([15,0])
  .translate([width / 2, height / 2]);

  var svg = d3.select("#winemap").append("svg")
  .attr("width", width)
  .attr("height", height);


  var path = d3.geoPath()
  .projection(projection);

  var keys = Object.keys(data);
  var values = keys.map(function(v) { return data[v]; });
  var smallest = d3.min(values, function(d) {return d || Infinity; })


  var color =  d3.scaleLinear()
  .domain([0,smallest, d3.max(values)])
  .range(['lightyellow', 'yellow', 'green']);

  var g = svg.append("g");


  // load and display the world and locations
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json", function(error, topology) {
    var world = g.selectAll("path")
    .data(topojson.object(topology, topology.objects.countries).geometries)
    .enter()
    .append("path")
    .attr("d", path)

    .attr("fill","white")
    .transition()
    .duration(800)
    .delay(function(d,i){return(i*15)})
    .attr("fill", function(d) {
      val = data[d.properties.name] ||0;
      return color(val);})

      svg.selectAll("path").on("mouseover", function() {
        tooltip.style("visibility", "visible")
        tooltip.style("opacity", 1)
      })

      .on("mouseout", function() {
        tooltip.style("visibility", "hidden")
        tooltip.style("opacity", 0)
      })

      .on("mousemove", function(d) {
        tooltip.html("<p>" + xval +": " + format(data[d.properties.name]) + "<br>" + "Country" +": " + d.properties.name)
        tooltip.style("left", (event.pageX) + "px")
        tooltip.style("top", (event.pageY) + "px")
      });


      values.unshift (Infinity)
      var legval = values.sort((a,b)=>b-a).
      filter( function(value, index, self) {
        return self.indexOf(value) === index; });

        legval.unshift (Infinity)
        legval.unshift (Infinity)

        var legval = legval.
        filter(function(value, index, self) {
          return index % 3 == 0 ;
        });
        legval.push(0)

        var legend = svg
        .attr("class", "legend")
        .selectAll("g")
        .data(legval)
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(0," + (height/2 + i * 17 )+ ")"; });

        legend.append("rect")
        .data(legval)

        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

        legend.append("text")
        .data(legval)
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return format(d); });

      });


      var tooltip =  d3.select("#winemap")
      .append("div")
      .attr("class", "tooltip")
    }
