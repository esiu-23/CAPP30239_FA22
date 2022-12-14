(function ring(){
  
  d3.csv('types.csv').then((data) => {
  
    let height = 1200,
    width = 1200,
    innerRadius = 300,
    outerRadius = 400,
    labelRadius = 450;

    console.log(data)

  const arcs = d3.pie().value(d => d.Count)(data);
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

  const svg = d3.select("#chart3")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("stroke-linejoin", "round")
    .selectAll("path")
    .data(arcs)
    .join("path")
    .attr("fill", (d, i) => d3.schemeSet3[i])
    .attr("d", arc);

  svg.append("g")
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(arcs)
    .join("text")
    .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
    .selectAll("tspan")
    .data(d => {
      return [d.data.Type, d.data.Count];
    })
    .join("tspan")
    .attr("x", 0)
    .attr("y", (d, i) => `${i * 1}em`)
    // .attr("font-weight", (d, i) => i ? null : "bold")
    .text(d => d);

  svg.append("text")
    .attr("font-size", 30)
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text("Top 10 bill topics")
    .style("font-size", 20);

});

})();