(function dumbbells(){
    let height = 600,
    width = 900,
    margin = ({top: 25, right: 30, bottom: 35, left: 10});

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
    .attr("transform", `translate(0, ${height - margin.bottom + 5})`)
    .classed("x axis", true)
    .call(d3.axisBottom(horzScale))

    horzAxis = (e)=>e.append("g")
    .classed("y axis", true)
    .call(d3.axisLeft(vertScale))
    .attr("transform", `translate(${margin.left-5},0)`);
    
    // let barCenter = vertScale.bandwidth() / 2;

    // Define tooltip
    const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

    // Put SVG together
    let chart1 = svg.append("g")
    .classed("chart1", true)
    .attr("transform", `translate(${height - margin.bottom})`)

    // Create chart elements
    chart1.selectAll("rect.bar")
    .data(dataset)
    .join("rect")
    .classed("bar", true)
    .attr("y", (d)=> vertScale(d.Title))
    .attr("x", (d)=> horzScale(d.Created_Date))
    .attr("height", 3)
    .attr("width", (d) => horzScale(d.Latest_Date - d.Created_Date))
    .attr("fill", "gray")

    chart1.selectAll("circle.Created_Date")
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

    chart1.call(horzAxis)
    chart1.call(vertAxisLeft)

    return svg.node();
});

})();