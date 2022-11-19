(function dumbbells(){
    let height = 500,
    width = 800,
    margin = ({top: 25, right: 30, bottom: 35, left: 10});

    // Create SVG & Enter data
    const svg = d3.select("#chart2")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);
    
    d3.csv('US_climate_cleaned.csv').then(dataset => {
        let timeParse = d3.timeParse("%Y-%m-%d");

        for (let d of dataset){
            d.Created_Date = timeParse(d.Created_Date)
            d.Latest_Date = timeParse(d.Latest_Date);
        }
    console.log(dataset);

    // Create Axes
    let vertScale = d3.scaleBand()
        .domain(dataset.map(d => d.Title))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    let horzScale = d3.scaleTime()
    .domain([d3.max(dataset, d => d.Latest_Date),d3.min(dataset, d => d.Created_Date)]).nice()
    .range([height - margin.bottom, margin.top]);
    
    vertAxisLeft = (e)=>e.append("g")
    .attr("transform", `translate(0, ${margin.left})`)
    .classed("x axis", true)
    .call(d3.axisBottom(horzScale))

    horzAxis = (e)=>e.append("g")
    .classed("y axis", true)
    .call(d3.axisLeft(vertScale))
    .attr("transform", `translate(${height - margin.bottom + 5},0)`);

    // Define tooltip
    const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

    // Put SVG together
    let chart2 = svg.append("g")
    .classed("chart2", true)

    //  Line 
    chart2.selectAll("line")
    .data(dataset)
    .join("line")
    .classed("line", true)
    .attr("x1", d => horzScale(d.Created_Date))
    .attr("y1", d=> vertScale(d.Title))
    .attr("x2", d => horzScale(d.Latest_Date))
    .attr("y2", d=> vertScale(d.Title))
    .attr("stroke", "gray")

    chart2.selectAll("circle.Created_Date")
    .data(dataset)
    .join("circle")
    .classed("Created_Date", true)
    .attr("cy", (d)=>(vertScale(d.Title)))
    .attr("cx", (d)=>(horzScale(d.Created_Date)))
    .attr("r", 5)
    .attr("fill", "steelblue")
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "yellow");
        tooltip
          .style("visibility", "visible")
          .style("position", "absolute")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("padding", "10px")
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

    chart2.selectAll("circle.Latest_Date")
    .data(dataset)
    .join("circle")
    .classed("Latest_Date", true)
    .attr("cy", (d)=>(vertScale(d.Title)))
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

    chart2.call(horzAxis)
    chart2.call(vertAxisLeft)

    return svg.node();
});

})();
