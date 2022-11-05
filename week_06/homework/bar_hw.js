// Bar Chart of COVID cases by country


let height1 = 400,
    width1 = 600,
    margin1 = ({ top: 25, right: 30, bottom: 35, left: 40 });

const svg1 = d3.select("#chart1")
    .append("svg1")
    .attr("viewbox", [0, 0, width1, height1]);

d3.csv("counts_death.csv").then(data => {
    for (let d of data) {
        d.counts = +d.counts;
    }

    // build the svg1
  
    let x = d3.scaleBand()
        .domain(data.map(d => d.Manner_of_death))
        .range([margin1.left, width1 - margin1.right])
        .padding(0.1);
    
    // Y - axis = Cases
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.counts)]).nice()
        .range([height1 - margin1.bottom, margin1.top]);
    
    const xAxis = g => g
        .attr("transform", `translate(0,${height1 - margin1.bottom + 5})`)
        .call(d3.axisBottom(x));

    const yAxis = g => g
        .attr("transform", `translate(${margin1.left-5},0)`)
        .call(d3.axisLeft(y));

    svg1.append("g")
        .call(xAxis);
    
    svg1.append("g")
        .call(yAxis);
    
    // build the bars that go on the svg1
    let bar = svg1.selectAll(".bar")
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");
    
    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.Manner_of_death))
        .attr('width1', x.bandwidth())
        .attr("y", d => y(d.counts))
        .attr("height1", d => y(0) - y(d.counts));
    
    bar.append("text")
        .text(d => d.counts)
        .attr('x', d => x(d.Manner_of_death) + (x.bandwidth()/2))
        .attr('y', d => y(d.counts) - 15)
        .attr('text-anchor', 'middle')
        .style('fill', '#000')

});