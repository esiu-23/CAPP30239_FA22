let height2 = 400,
    width2 = 600,
    margin2 = ({ top: 25, right: 30, bottom: 35, left: 40 });
  
const svg2 = d3.select("#chart2")
    .append("svg2")
    .attr("viewBox", [0, 0, width2, height2]);

d3.csv('date_deaths.csv').then(data => {
    let timeParse = d3.timeParse("%Y-%m-%d");

    for (let d of data) {
        d.Date = timeParse(d.Date);
        d.deaths = +d.deaths;
    }

    let x = d3.scaleTime()
    .domain(d3.extent(data, d => d.Date))
    .range([margin2.left, width2 - margin2.right]);

  let y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.deaths)).nice()
    .range([height2 - margin2.bottom, margin2.top]);

  svg2.append("g")
    .attr("transform", `translate(0,${height2 - margin2.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x).tickSize(-height2 + margin2.top + margin2.bottom))

  svg2.append("g")
    .attr("transform", `translate(${margin2.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-width2 + margin2.left + margin2.right))

  svg2.append("g")
    .attr("fill", "black")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.Date))
    .attr("cy", d => y(d.deaths))
    .attr("r", 2)
    .attr("opacity", 0.75);

  const tooltip = d3.select("body").append("div")
    .attr("class", "svg22-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

  d3.selectAll("circle")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "red");
      tooltip
        .style("visibility", "visible")
        .html(`Number of deaths: ${d.deaths}`);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", "black");
      tooltip.style("visibility", "hidden");
    })
    
});