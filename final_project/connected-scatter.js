(function connected(){
        
    let height = 500,
    width = 1000,
    margin = ({ top: 25, right: 30, bottom: 35, left: 80 });
      
      const svg = d3.select("#chart2")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);
    
      d3.csv('regulation_tech_actions.csv').then(data => {
        
        let timeParse = d3.timeParse("%Y-%m-%d");

        for (let d of data){
            d.date = timeParse(d.date)
        }
    
        console.log(data);

      let y = d3.scaleTime()
        .domain(d3.extent(data, d => d.date)).nice()
        .range([margin.left, width - margin.right]);
    
      let x = d3.scaleBand()
        .domain(data.map(d => d.classification_y))
        .range([height - margin.bottom, margin.top]);

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .curve(d3.curveBasis) // Just add that to have a curve instead of segments
        .x(function(d) { return x(d.classifcation_y) })
        .y(function(d) { return y(d.date) })
        )

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "x-axis")
      .call(d3.axisBottom(x).tickSize(-height + margin.top + margin.bottom))
  
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))
  
    // svg.append("g")
    //   .attr("fill", "black")
    //   .selectAll("#chart2 circle")
    //   .data(data)
    //   .join("circle")
    //   .attr("attr", "circle-scatter")
    //   .attr("cx", d => x(d.classification_y))
    //   .attr("cy", d => y(d.date))
    //   .attr("r", 2)
    //   .attr("opacity", 0.75);
    
    // var square = d3.symbolSquare

    // svg.append("g")
    //   .data(data)
    //   .join("path")
    //   .attr("transform", d => `translate(${x(d.x)},${y(d.y)})`)
    //   .attr("fill", d => color(d.Chamber))
    //   .attr("d", square)
    //   .attr("class", "square");
  
    // var tooltip = d3.select("#chart2").append("div")
    //   .attr("class", "svg-tooltip")
    //   .style("position", "absolute")
    //   .style("visibility", "hidden");
  
    // d3.selectAll(".square")
    //   .on("mouseover", function(event, d) {
    //     d3.select(this).attr("fill", "black");
    //     tooltip
    //       .style("visibility", "visible")
    //       .html(`${d.description}`);
    //   })
    //   .on("mousemove", function(event) {
    //     tooltip
    //       .style("top", (event.pageY - 10) + "px")
    //       .style("left", (event.pageX + 10) + "px");
    //   })
    //   .on("mouseout", function() {
    //     d3.select(this);
    //     tooltip.style("visibility", "hidden");
    //   })
      
  });

})();
