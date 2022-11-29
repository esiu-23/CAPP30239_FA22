(function scatter(){
  let height = 600,
    width = 1200,
    margin = ({ top: 100, right: 30, bottom: 50, left: 80 });
  
  const svg = d3.select("#chart2")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

  d3.csv('hb_1443.csv').then(data => {
    
    let timeParse = d3.timeParse("%Y-%m-%d");

    for (let d of data){
        d.date = timeParse(d.date)
    }
    console.log(data);

  let y = d3.scaleTime()
  .domain(d3.extent(data, d => d.date)).nice()
  .range([margin.top, height - margin.bottom]);

  let x = d3.scaleBand()
  .domain(data.map(d => d.classification))
  .range([margin.left, width - margin.right]);

  var color = d3.scaleOrdinal()
  .domain(["House, Senate, Executive"])
  .range(d3.schemeSet2);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x))
    .selectAll(".tick text")
    .call(wrap, x.bandwidth())

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y))
  
  var path = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#808080")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x( d=> x(d.classification))
        .y( d => y(d.date))
        )
    // Add the points
  svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", (d) => x(d.classification) )
        .attr("cy", (d) => y(d.date) + 4)
        .attr("r", 5)
        .attr("fill", d => color(d.Chamber))
        .attr("id", "circle-scatter")
    
  // Get the length of the path, which we will use for the intial offset to "hide"
  // the graph
  const length = path.node().getTotalLength();

  function repeat() {
    // Animate the path by setting the initial offset and dasharray and then transition the offset to 0
    path.attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length)
          .transition()
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          .duration(10000)
          .on("end", () => setTimeout(repeat, 1000)); // this will repeat the animation after waiting 1 second
  }
  repeat();

  var tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

  d3.selectAll("#circle-scatter")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "black");
      tooltip
        .style("visibility", "visible")
        .style("font-size", "20px")
        .html(`${d.date} <br> <br> ${d.description}`);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).style("fill", d => color(d.Chamber))
      tooltip.style("visibility", "hidden");
    })
    
  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
      while (word = words.pop()) {
        line.push(word)
        tspan.text(line.join(" "))
        if (tspan.node().getComputedTextLength() > width) {
          line.pop()
          tspan.text(line.join(" "))
          line = [word]
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
        }
      }
    })
  }
  // Add one dot in the legend for each name.
  svg.append("circle").attr("cx",20).attr("cy",40).attr("r", 2).style("fill", "#fc8d62" )
  svg.append("circle").attr("cx",20).attr("cy",50).attr("r", 2).style("fill",  "#8da0cb")
  svg.append("circle").attr("cx",20).attr("cy",60).attr("r", 2).style("fill", "#e78ac3")
  svg.append("text").attr("x", 30).attr("y", 40).text("Action in House").style("font-size", "10px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 30).attr("y", 50).text("Action in Senate").style("font-size", "10px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 30).attr("y", 60).text("Action by Executive (Governor)").style("font-size", "10px").attr("alignment-baseline","middle")
  
  // Add a legend title
  svg.append("text").attr("x", 10).attr("y", 20).text("Legend: ").style("font-size", "12px").attr("alignment-baseline","middle")
  
  });
})();
    
