// Bar Chart of COVID cases by country

// file needs to have path or be at same directory level
// all elements brought in by CSV is default a string
d3.csv("covid.csv").then(data => {
    for (let d of data) {
        d.cases = +d.cases;
        // d.num = +d.cases; - save as a new variables
        //  plus symbol changes a string to an integer - integer is same as float
    }
    // console.log(data);

    const height = 400,
        width = 600,
        margin = ({top: 25, right: 30, bottom: 35, left: 50});

    // build the SVG
    
    let svg = d3.select("#chart")
    // use select to get a unique instance of a div id
    // selects all to get all p div elements
    // d3.selectAll("p")
                .append("svg")
                .attr("viewbox", [0, 0, width, height]);

    // Scales give it a domain (your values) and a range (how much space you want it to take up on the page)
    // X - axis = Countries
    const x = d3.scaleBand()
        // map is a function in javascript that matches up values in CSV
        // d is the row of data that we're on, d.country is attribute of the row of the data we're on (d)
        // d in d3 is used to represent row of data you're on (though technically could be any variable)
        .domain(data.map(d => d.country))
        .range([margin.left, width - margin.right])
        .padding(0.1);
    
    // Y - axis = Cases
    const y = d3.scaleLinear()
        // .nice is something that makes the top value nicer - roll 327 up to 330 as the max value
        .domain([0, d3.max(data, d => d.cases)]).nice()
        .range([height - margin.bottom, margin.top]);
    
    const xAxis = g => g
        // .attr("transform", `translate(0, ${height - margin.bottom})`)
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        // immediately call this function whenever you see this keyword xAxis
        .call(d3.axisBottom(x));

    const yAxis = g => g
        // .attr("transform", `translate(${margin.left - 5}, 0)`)
        .attr("transform", `translate(${margin.left-5},0)`)
        .call(d3.axisLeft(y));

    svg.append("g")
        .call(xAxis);
    
    svg.append("g")
        .call(yAxis);
    
    // build the bars that go on the SVG
    let bar = svg.selectAll(".bar")
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");
    
    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.country))
        .attr('width', x.bandwidth())
        .attr("y", d => y(d.cases))
        .attr("height", d => y(0) - y(d.cases));
    
    bar.append("text")
        .text(d => d.cases)
        .attr('x', d => x(d.country) + (x.bandwidth()/2))
        .attr('y', d => y(d.cases) - 15)
        .attr('text-anchor', 'middle')
        .style('fill', '#000')

});