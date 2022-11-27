
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

    var categories = ["Referral", "Passage", "Filing", "Introduction", "Amendment", "Failure"]
 
    var color = d3.scaleOrdinal()
        .domain(categories)
        .range(d3.schemeSet2);

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
        .attr("r", function(d){ return size(d.Count)})
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", d => color(d.Category))
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 1)
    
    const labels = node
        .append('text')
        .selectAll("tspan")
        .attr('dy', '.3em')
        .style('text-anchor', 'middle')
        .style('font-size', 10)
        .text(d => {return [d.Actions, d.Count];})
        .join("tspan")

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
                
            labels
                .attr('x', d => d.x)
                .attr('y', d => d.y)
        });

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
        .style("fill", d => color(d))
        .style("font-size", 6)
        .text(d => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
    
    // Add a legend title
    svg.append("text").attr("x", 10).attr("y", 30).text("Legend: Bill Actions by Category").style("font-size", "9px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", width/3).attr("y", 10).text("Congressional Actions by Category").style("font-size", "12px").attr("alignment-baseline","middle")
    })
})();