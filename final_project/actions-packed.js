
// set the dimensions and margins of the graph
(function bubbles(){
    let height = 300,
    width = 400,
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

    // Color palette for continents?
    var color = d3.scaleOrdinal()
        .domain(["Referral", "Passage", "Filing", "Introduction", "Amendment", "Failure"])
        .range(d3.schemeSet2);

    // Size scale for countries
    var size = d3.scaleLinear()
        .domain([0, 36000])
        .range([7,55])  // circle will be between 7 and 55 px wide

    const tooltip = d3.select("body").append("div")
        .attr("class", "svg-tooltip")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
    
      d3.selectAll("circle")
        .on("mouseover", function(event, d) {
          d3.select(this);
          tooltip
            .style("visibility", "visible")
            .html('<u>' + d.Action + '</u>' + "<br>" + d.Count + " times");
        })
        .on("mousemove", function(event) {
          tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
          d3.select(this);
          tooltip
            .style("fill", d => color(d.Chamber))
            .style("visibility", "hidden");
        })

    // // select the circle
    // current_circle = d3.select(this);
    // current_circle.attr("fill","#b2e1f9");

    // let textblock = svg.selectAll("#details-popup")
    //     .data([d])
    //     .enter()
    //     .append("g")
    //     .attr("id", "details-popup")
    //     .attr("font-size", 14)
    //     .attr("font-family", "sans-serif")
    //     .attr("text-anchor", "start")
    //     .attr("transform", d => `translate(0, 20)`);

    // textblock.append("text")
    //     .text("Bill Action Details:")
    //     .attr("font-weight", "bold");
    // textblock.append("text")
    //     .text(d => "Description: " + d.data.Action)
    //     .attr("y", "16");
    // textblock.append("text")
    //     .text(d => "Count: " + format(d.data.Count))
    //     .attr("y", "32");
    // }

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
        .style("fill", function(d){ return color(d.Category)})
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 1)

    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.Count)+3) }).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
            node
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
        });


    })

})();