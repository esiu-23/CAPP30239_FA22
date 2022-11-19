(function dumbbells(){
    let height = 400,
    width = 800,
    margin = ({top: 20, right: 30, bottom: 30, left: 40})

    // Create SVG & Enter data
    const svg = d3.select("#chart1")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);
    
    d3.csv('IL_cleaned_actions.csv').then(dataset => {
        let timeParse = d3.timeParse("%Y-%m-%d");

        for (let d of dataset){
            d.Created_Date = timeParse(d.Created_Date)
            d.Latest_Date = timeParse(d.Latest_Date);
        }

    // Create Axes
    let vertScale = d3.scaleBand()
        .domain(dataset.map(d => d.Title))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    vertAxisLeft = (e)=>e.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .classed("y axis", true)
    .call(d3.axisBottom(horzScale))

    let horzScale = d3.scaleTime()
    .domain([d3.max(dataset, d => d.Latest_Date),d3.min(dataset, d => d.Created_Date)]).nice()
    .range([height - margin.bottom, margin.top]);
    
    horzAxis = (e)=>e.append("g")
    .classed("x axis", true)
    .call(d3.axisLeft(vertScale))
    .attr("transform", `translate(0,${height - margin.bottom})`)

    // Define tooltip
    const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

    // Put SVG together
    let chart1 = svg.append("g")
    .classed("chart1", true)
    .attr("transform", `translate(0, ${margin.bottom})`)

    // Create chart elements
    chart1.selectAll("line")
    .data(dataset)
    .join("line")
    .classed("line", true)
    .attr("x1", d => horzScale(d.Created_Date))
    .attr("y1", d=> vertScale(d.Title) + (vertScale.bandwidth()/2))
    .attr("x2", d => horzScale(d.Latest_Date))
    .attr("y2", d=> vertScale(d.Title) + (vertScale.bandwidth()/2))
    .attr("stroke", "gray")

    chart1.selectAll("circle.Created_Date")
    .data(dataset)
    .join("circle")
    .classed("Created_Date", true)
    .attr("cy", (d)=>(vertScale(d.Title) + (vertScale.bandwidth()/2)))
    .attr("cx", (d)=>(horzScale(d.Created_Date)))
    .attr("r", 5)
    .attr("fill", "steelblue")
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "yellow");
        tooltip
          .style("visibility", "visible")
          .html(`Title: ${d.Title} <br> Created Date: ${d.Created_Date} <br> Result: ${d.Latest_Description}`);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "steelblue");
        tooltip.style("visibility", "hidden");
      })

    chart1.selectAll("circle.Latest_Date")
    .data(dataset)
    .join("circle")
    .classed("Latest_Date", true)
    .attr("cy", (d)=>(vertScale(d.Title) + (vertScale.bandwidth()/2)))
    .attr("cx", (d)=>(horzScale(d.Latest_Date)))
    .attr("r", 5)
    .attr("fill", "red")
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "yellow");
        tooltip
          .style("visibility", "visible")
          .html(`Title: ${d.Title} <br> Result Date: ${d.Latest_Date} <br> Result: ${d.Latest_Description}`);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "red");
        tooltip.style("visibility", "hidden");
      })

    line = d3.line()
    .x(d => walkX(d.step))
    .y(d => walkY(d.value))

    chart1.call(horzAxis)
    chart1.call(vertAxisLeft)

    return svg.node();
});

})();
