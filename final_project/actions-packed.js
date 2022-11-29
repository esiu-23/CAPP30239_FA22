
// set the dimensions and margins of the graph
(function bubbles(){
    let height = 600,
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });

    const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

    // Read data
    d3.csv("action_counts-2.csv").then(data => {
        for (let d of data){
            d.Count = +d.Count;
        }
        console.log(data)

    var categories = ["Referral", "Reading", "Passage", "Filing", "Introduction", "Amendment", "Failure"]
    var color_range = ["#ffd92f", "#66c2a5", "#a6d654", "#e5c494", "#b3b3b3", "#8da0cb", "#Fc8d62"]

    var color = d3.scaleOrdinal()
        .domain(categories)
        .range(color_range);

    // Size scale for categories
    var size = d3.scaleLinear()
        .domain([0, 36000])
        .range([15,90])  // circle will be between 15 and 90 px wide

    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", d => size(d.Count))
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", d => color(d.Category))
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .attr("id", "circle-bubble")

    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.03).radius(function(d){ return (size(d.Count)+3) }).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
        });

    var tooltip = d3.select("body").append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");
    
      d3.selectAll("#circle-bubble")
        .on("mouseover", function(event, d) {
          d3.select(this).attr("fill", "black");
          tooltip
            .style("visibility", "visible")
            .style("font-size", "20px")
            .html(`${d.Actions} <br> <br> ${d.Count}`);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
          d3.select(this).style("fill", d => color(d.Category))
          tooltip.style("visibility", "hidden");
        })
    
        // Add one dot in the legend for each name.
    svg.selectAll("mydots")
        .data(categories)
        .enter()
        .append("circle")
        .attr("cx", 10)
        .attr("cy", function(d,i){ return 40 + i*8}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 2)
        .style("fill", d => color(d))
       
    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
        .data(categories)
        .enter()
        .append("text")
        .attr("x", 15)
        .attr("y", function(d,i){ return 40 + i*8}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", "black")
        .style("font-size", 6)
        .text(d => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
    
    // Add a legend title
    svg.append("text").attr("x", 10).attr("y", 30).text("Legend: Bill Actions by Category").style("font-size", "9px").attr("alignment-baseline","middle")

})
})();