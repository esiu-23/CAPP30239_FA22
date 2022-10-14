// Bar Chart of library visits by branch in January 2022

d3.csv("library_visits_jan22.csv").then(data => {
    for (let d of data) {
        d.num = +d.num;
    }

    const height = 400,
        width = 600,
        margin = ({top: 25, right: 30, bottom: 35, left: 50});

    
    // Build the SVG Bar Chart
    
    let svg = d3.select("#chart")
                .append("svg")
                .attr("viewbox", [0, 0, width, height]);

    // X - axis = Branches
    const x = d3.scaleBand()
        .domain(data.map(d => d.branch))
        .range([margin.left, width - margin.right])
        .padding(0.1);
    
    // Y - axis = Number of vists
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.num)]).nice()
        .range([height - margin.bottom, margin.top]);
    
    // Create and set location of x-axis
    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));

    // Create and set location of y-axis
    const yAxis = g => g
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    // Join all elements together to build the axes 
    svg.append("g")
        .call(xAxis);
    
    svg.append("g")
        .call(yAxis);
    
    // Build the bars that go on the bar chart
    let bar = svg.selectAll(".bar")
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");
    
    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.branch))
        .attr('width', x.bandwidth())
        .attr("y", d => y(d.num))
        .attr("height", d => y(0) - y(d.num));
    
    // Add data labels on the graph
    bar.append("text")
        .text(d => d.num)
        .attr('x', d => x(d.branch) + (x.bandwidth()/2))
        .attr('y', d => y(d.num) - 15)
        .attr('text-anchor', 'middle')
        .style('fill', '#000')

});