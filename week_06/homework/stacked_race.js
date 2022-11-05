const width = 860,
height = 400,
margin = {top: 40, right: 30, bottom: 20, left: 20};

const svg = d3.select("#chart")
.append("svg")
.attr("viewBox", [0, 0, width, height]);

d3.csv("race_counts.csv").then( data => {

let x = d3.scaleBand(data.map(d => (d.Manner_of_death)),[margin.left, width - margin.right])
.padding([0.2]);

let y = d3.scaleLinear([0,45],[height - margin.bottom, margin.top]);

svg.append("g")
.attr("transform", `translate(0,${height - margin.bottom})`)
.call(d3.axisBottom(x))

svg.append("g")
.attr("transform", `translate(${margin.left},0)`)
.call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))

//subgroups, type of manner of death
const subgroups = data.columns.slice(1);

const color = d3.scaleOrdinal(subgroups,['#e41a1c','#377eb8','#4daf4a']);

const stackedData = d3.stack()
.keys(subgroups)(data);

svg.append("g")
.selectAll("g")
.data(stackedData)
.join("g")
.attr("fill", d => color(d.key))
.selectAll("rect")
.data(d => d)
.join("rect")
.attr("x", d => x(d.data.Manner_of_death))
.attr("y", d => y(d[1]))
.attr("height", d => y(d[0]) - y(d[1]))
.attr("width",x.bandwidth());

let legendGroup = svg
.selectAll(".legend-group")
.data(subgroups)
.join("g")
.attr("class", "legend-group");

legendGroup
.append("circle")
.attr("cx", (d, i) => (10 + (i * 75)))
.attr("cy",10)
.attr("r", 3)
.attr("fill", (d, i) => color(i));

legendGroup
.append("text")
.attr("x", (d, i) => (20 + (i * 75)))
.attr("y",15)
.text((d, i) => subgroups[i]);
});