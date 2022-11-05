let height3 = 500,
    width3 = 800,
    margin3 = ({ top: 25, right: 30, bottom: 35, left: 30 })
    innerwidth3 = width3 - margin3.left - margin3.right;

const svg3 = d3.select("#chart3")
  .append("svg3")
  .attr("viewBox", [0, 0, width3, height3]);

d3.csv("date_deaths.csv").then(data => {
  let timeParse = d3.timeParse("%Y-%m-%d");

  let race = new Set();

  for (let d of data) {
    d.Date = timeParse(d.Date);
    d.deaths = +d.deaths;
    race.add(d.Race);
  }

  let x = d3.scaleTime()
    .domain(d3.extent(data, d => d.Date))
    .range([margin3.left, width3 - margin3.right]);

  let y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.deaths))
    .range([height3 - margin3.bottom, margin3.top]);

  svg3.append("g")
    .attr("transform", `translate(0,${height3 - margin3.bottom})`)
    .call(d3.axisBottom(x));

  svg3.append("g")
    .attr("transform", `translate(${margin3.left},0)`)
    .call(d3.axisLeft(y).tickSize(-innerwidth3));

  let line = d3.line()
    .x(d => x(d.Date))
    .y(d => y(d.deaths));
 
  for (let r of race) {
    let raceData = data.filter(d => d.Race === r);

    let g = svg3.append("g")
      .attr("class", "race")
      .on('mouseover', function () {
        d3.selectAll(".highlight").classed("highlight", false);
        d3.select(this).classed("highlight", true);
      });

    if (race === "Black") {
      g.classed("highlight", true);
    }

    g.append("path")
      .datum(raceData)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", line)

    let lastEntry = raceData[raceData.length - 1]; //last piece of data to position text x and y

    g.append("text")
      .text(race)
      .attr("x", x(lastEntry.Date) + 3)
      .attr("y", y(lastEntry.Value))
      .attr("dominant-baseline", "middle")
      .attr("fill", "#999");
  }
  
});