let height = 300,
    width = 800,
    margin = ({ top: 25, right: 30, bottom: 35, left: 50 });
  
const svg = d3.select("#chart2")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('hb_1443.csv').then(data => {
    
    let timeParse = d3.timeParse("%Y-%m-%d");

    for (let d of data){
        d.date = timeParse(d.date)
    }
    console.log(data);

    let y = d3.scaleTime()
    .domain(d3.extent(data, d => d.date)).nice()
    .range([margin.top, height - margin.bottom]);

    let x = d3.scaleBand()
    .domain(data.map(d => d.classification))
    .range([margin.left, width - margin.right]);

    var color = d3.scaleOrdinal()
    .domain(["House, Senate, Executive"])
    .range(d3.schemeSet2);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x))

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y))

  svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.classification))
    .attr("cy", d => y(d.date))
    .attr("r", 4)
    .attr("opacity", 0.75)
    .style("fill", function(d){return color(d.Chamber)});

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
        .html(`${d.description}`);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).style("fill", function(d){ return color(d.Chamber)})
      tooltip.style("visibility", "hidden");
    })
    
});