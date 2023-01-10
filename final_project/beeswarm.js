	(function beeswarm(){
	let height = 400,
	width = 800,
	padding = 1.5
	margin = ({ top: 25, right: 30, bottom: 35, left: 60 });

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
	.range([margin.left, width - margin.right]).nice();

	var color = d3.scaleOrdinal()
	.domain(["Democratic, Republican"])
	.range(["#AA4A44", "#87CEEB"]);

	svg.append("g")
	.attr("transform", `translate(0,${height - margin.bottom})`)
	.attr("class", "x-axis")
	.call(d3.axisBottom(x))
	.selectAll(".tick").remove()

	svg.append("g")
	.attr("transform", `translate(${margin.left},0)`)
	.attr("class", "y-axis")
	.call(d3.axisLeft(y))
	.selectAll(".tick text")

	// svg.append("text")
    // .attr("class", "x label")
    // .attr("text-anchor", "end")
    // .attr("x", margin.left + 3)
    // .attr("y", height)
    // .text("District");

	svg.selectAll('circle')
		.data(data)
		.attr("id", "circle-swarm")
		.join('circle')
		.attr('cx', (d) => x(d.District))
		.attr('cy', (d) => y(d.Chamber) + y.bandwidth()/2)
		.attr('r', d => (d.Years/2 + 3))
		.attr('fill', (d) => color(d.Party));

	const simulation = d3.forceSimulation(data)
	.force('x', d3.forceX((d) => x(d.District)).strength(5))
	.force('y', d3.forceY((d) => y(d.Chamber) + y.bandwidth()/2))
	.force('collide', d3.forceCollide(d => (d.Years/2 + 3) + padding))
	.stop();

	for(let i = 0; i<120; i++) {
		simulation.tick();      
	
		svg.selectAll('circle')
		  .data(data)
		  .attr("id", "circle-swarm")
		  .transition()
		  .duration(12)
		  .ease(d3.easeLinear)
		  .attr('cx', (d) => d.x)
		  .attr('cy', (d) => d.y);

	  }

	var tooltip = d3.select("body").append("div")
	  .attr("class", "svg-tooltip")
	  .style("position", "absolute")
	  .style("visibility", "hidden");
  
	d3.selectAll("#circle-swarm")
	  .on("mouseover", function(event, d) {
		d3.select(this).attr("fill", "black");
		tooltip
		  .style("visibility", "visible")
		  .style("font-size", "20px")
		  .html(`${d.Name}, ${d.Party} Party
			  <br>District: ${d.District} 
			  <br>${d.Years} years in office`);
	  })
	  .on("mousemove", function(event) {
		tooltip
		  .style("top", (event.pageY - 10) + "px")
		  .style("left", (event.pageX + 10) + "px");
	  })
	  .on("mouseout", function() {
		d3.select(this).style("fill", d => color(d.Party))
		tooltip.style("visibility", "hidden");
	  })

	// Add one dot in the legend for each name.
	svg.append("circle").attr("cx",20).attr("cy",40).attr("r", 2).style("fill", "#AA4A44")
	svg.append("circle").attr("cx",20).attr("cy",50).attr("r", 2).style("fill",  "#87CEEB")
	svg.append("circle").attr("cx",20).attr("cy",70).attr("r", 4).style("fill",  "gray")
	svg.append("text").attr("x", 30).attr("y", 40).text("Democrat").style("font-size", "10px").attr("alignment-baseline","middle")
	svg.append("text").attr("x", 30).attr("y", 55).text("Republican").style("font-size", "10px").attr("alignment-baseline","middle")
	svg.append("text").attr("x", 30).attr("y", 70).text("Size indicates years in office").style("font-size", "10px").attr("alignment-baseline","middle")

	//   // Add a legend title
	svg.append("text").attr("x", 10).attr("y", 20).text("Legend: ").style("font-size", "12px").attr("alignment-baseline","middle")

	});
	})();

