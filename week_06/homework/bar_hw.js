(function bar(){
let height = 300,
    width = 400,
    margin = ({top: 25, right: 30, bottom: 35, left: 40});

const svg = d3.select("#chart1")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv("counts_death.csv").then(data => {
    for (let d of data) {
        d.counts = +d.counts;
    }

    // build the svg
  
    let x = d3.scaleBand()
        .domain(data.map(d => d.Manner_of_death))
        .range([margin.left, width - margin.right])
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.counts)]).nice()
        .range([height - margin.bottom, margin.top]);
    
    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));

    const yAxis = g => g
        .attr("transform", `translate(${margin.left-5},0)`)
        .call(d3.axisLeft(y));

    svg.append("g")
        .call(xAxis);
    
    svg.append("g")
        .call(yAxis);
    
    let bar = svg.selectAll(".bar")
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");
    
    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.Manner_of_death))
        .attr('width', x.bandwidth())
        .attr("y", d => y(d.counts))
        .attr("height", d => y(0) - y(d.counts));
    
    bar.append("text")
        .text(d => d.counts)
        .attr('x', d => x(d.Manner_of_death) + (x.bandwidth()/2))
        .attr('y', d => y(d.counts) - 15)
        .attr('text-anchor', 'middle')
        .style('fill', '#000')

});
})();