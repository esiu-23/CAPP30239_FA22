(function multiline() {
let height = 100,
    width = 200,
    margin = ({ top: 25, right: 30, bottom: 35, left: 30 })
    innerwidth = width - margin.left - margin.right;

const svg = d3.select("#chart3")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

d3.csv("date_deaths_sorted.csv").then(data => {
  let timeParse = d3.timeParse("%Y-%m-%d");

  let race = new Set();

  for (let d of data) {
    d.Date = timeParse(d.Date);
    d.deaths = +d.deaths;
    race.add(d.Race);
  }

  let x = d3.scaleTime()
    .domain(d3.extent(data, d => d.Date))
    .range([margin.left, width - margin.right]);

  let y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.deaths))
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(-innerwidth));

  let line = d3.line()
    .x(d => x(d.Date))
    .y(d => y(d.deaths));
 
  for (let r of race) {
    let raceData = data.filter(d => d.Race === r);

    let g = svg.append("g")
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
})();