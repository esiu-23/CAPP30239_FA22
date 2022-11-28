(function beeswarm(){
    let height = 400,
    width = 1000,
    padding = 1.5
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });

    const svg = d3.select("#chart0")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

    // Read data
    d3.csv("StateHouse.csv").then(data => {
        for (let d of data){
            d.District = +d.District;
            d.Years = +d.Years
        }
        console.log(data)
     
    let y = d3.scaleBand()
    .domain(data.map(d => d.Chamber))
    .range([margin.top, height - margin.bottom]);
    
    let x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.District))
    .range([margin.left, width - margin.right]);

    var color = d3.scaleOrdinal()
    .domain(["Democratic, Republican"])
    .range(["#AA4A44", "#00FFFF"]);

    svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x))
    .selectAll(".tick text")

    svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y))
    .selectAll(".tick text")
        
    var simulation = d3.forceSimulation(data)
        .force('x', d3.forceX((d) => x(d.District)).strength(2))
        .force('y', d3.forceY((d) => y(d.Chamber)))
        .force('collide', d3.forceCollide(d => d.Years + padding))
        .stop();

    svg.selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', (d) => x(d.District))
        .attr('cy', (d) => y(d.Chamber))
        .attr('r', d => (d.Years/2))
        .attr('fill', (d) => color(d.Party));

    for(let i = 0; i<120; i++) {
            simulation.tick();      

            svg.selectAll('circle')
            .data(data)
            .transition()
            .duration(1200)
            .ease(d3.easeLinear)
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y);

            return svg.node();
        }

    const tooltip = d3.select("body").append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");
    
      d3.selectAll("circle")
        .on("mouseover", function(event, d) {
          d3.select(this).attr("fill", "red");
          tooltip
            .style("visibility", "visible")
            .style("font-size", "20px")
            .html(`Chamber: ${d.Chamber}` <br> `Years: ${d.Years}` <br> `District: ${d.District}`);
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

simulation
.on("tick", function(d){
    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
});

//   // Add one dot in the legend for each name.
//   svg.append("circle").attr("cx",20).attr("cy",40).attr("r", 2).style("fill", "#fc8d62" )
//   svg.append("circle").attr("cx",20).attr("cy",50).attr("r", 2).style("fill",  "#8da0cb")
//   svg.append("circle").attr("cx",20).attr("cy",60).attr("r", 2).style("fill", "#e78ac3")
//   svg.append("text").attr("x", 30).attr("y", 40).text("Action in House").style("font-size", "10px").attr("alignment-baseline","middle")
//   svg.append("text").attr("x", 30).attr("y", 50).text("Action in Senate").style("font-size", "10px").attr("alignment-baseline","middle")
//   svg.append("text").attr("x", 30).attr("y", 60).text("Action by Executive (Governor)").style("font-size", "10px").attr("alignment-baseline","middle")
  
//   // Add a legend title
//   svg.append("text").attr("x", 10).attr("y", 20).text("Legend: ").style("font-size", "12px").attr("alignment-baseline","middle")
//   svg.append("text").attr("x", width/3).attr("y", 30).text("HB 1443's Path from Introduction to Bill")
  
  });
})();
    
