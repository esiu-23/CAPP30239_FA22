// Treemap
let height = 500,
  width = 800;

const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

d3.json('actions-hierarchy.json').then(data => { 
    const treemap = data => d3.treemap()
      (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value));
  
    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([0, height]);
  
    const format = d3.format(",d");
    let c = {...data.children[0].children[0]};
    c.value = 0;
    data.children[0].children[0].children = [c];
  
    let group = svg.append("g")
      .call(render, treemap(data));
  
    function render(group, node) {
      console.log("render", group, node)
      d3.select('#breadcrumbs')
        .text(node.ancestors().reverse().map(d => d.data.name).join(" > "))
        .on('click', () => {
          if (node.parent) {
            zoomOut(node);
          }
        });
  
      const gNode = group
        .selectAll("g")
        .data(node.children)
        .join("g");
  
      gNode.filter(d => d.children)
        .attr("cursor", "pointer")
        .on("click", (event, d) => zoomIn(d));
  
      gNode.append("rect")
        .attr("fill", d => d.data.color)
        .attr("fill-opacity", d => d.data.opacity)
        .attr("stroke", "#fff")
        .on("mousemove", function (event, d) {
          tooltip
            .style("visibility", "visible")
            .html(`${d.data.name}<br />${d.data.subtext}<br />${format(d.value)}`)
            .style("top", (event.pageY + 20) + "px")
            .style("left", (event.pageX - 80) + "px");
        })
        .on("mouseout", function () {
          tooltip.style("visibility", "hidden");
        })
      
      gNode.append("text")
        .append("tspan")
        .attr("x", 3)
        .attr("y", "1em")
        .attr("font-weight", "bold")
        .attr("font-size",8)
        .text(d => (d.value > 29) ? d.data.name : "")
        .append("tspan")
        .attr("x", 3)
        .attr("y", "2.1em")
        .attr("font-weight", "normal")
        .attr("font-size",8)
        .text(d => (d.value > 50) ? d.data.subtext : "")
        .append("tspan")
        .attr("x", 3)
        .attr("y", "3.2em")
        .attr("font-weight", "normal")
        .attr("font-size",8)
        .text(d => (d.value > 0) ? format(d.value) : "");
  
      group.call(position);
    }

    svg.selectAll('text')
    .selectAll('tspan')
    .data(d => {
        return d.data.name.split(/\s+/)// split the name of movie
            .map(v => {
                return {
                    text: v,
                    x0: d.x0,                        // keep x0 reference
                    y0: d.y0                         // keep y0 reference
                }
            });
    })
    .enter()
    .append('tspan')
    .attr("x", (d) => d.x0 + 5)
    .attr("y", (d, i) => d.y0 + 15 + (i * 10))       // offset by index 
    .text((d) => d.text)
    .attr("font-size", "0.6em")
    .attr("fill", "white");

    function position(group) {
      group.selectAll("g")
        .attr("transform", d => `translate(${x(d.x0)},${y(d.y0)})`)
        .select("rect")
        .attr("width", d => x(d.x1) - x(d.x0))
        .attr("height", d => y(d.y1) - y(d.y0));
    }
  
    function zoomIn(d) {
      const group0 = group.attr("pointer-events", "none");
      const group1 = group = svg.append("g").call(render, d);
  
      x.domain([d.x0, d.x1]);
      y.domain([d.y0, d.y1]);
  
      svg.transition()
        .duration(750)
        .call(t => group0.attr("opacity", 1)
          .transition(t)
          .attr("opacity", 0.1)
          .remove()
          .call(position, d.parent))
        .call(t => group1.attr("opacity", 0)
          .transition(t)
          .attr("opacity", 1)
          .call(position, d));
    }
  
    function zoomOut(d) {
      const group0 = group.attr("pointer-events", "none");
      const group1 = group = svg.insert("g", "*").call(render, d.parent);
  
      x.domain([d.parent.x0, d.parent.x1]);
      y.domain([d.parent.y0, d.parent.y1]);
  
      svg.transition()
        .duration(750)
        .call(t => group0.attr("opacity", 1)
          .transition(t).remove()
          .attr("opacity", 0)
          .call(position, d))
        .call(t => group1.attr("opacity", 0.1)
          .transition(t)
          .attr("opacity", 1)
          .call(position, d.parent));
    }
  });

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");