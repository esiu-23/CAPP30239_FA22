/* D3 Line Chart */

const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('long-term-interest-monthly.csv').then(data => {
    // Tell it what format the date is in right now to parse (4 digit year in String, 2 digit month in String)
    let timeParse = d3.timeParse("%Y-%m");

    // Convert value from string to number, use "+" to change string to number
    for (let d of data){
        d.Value = +d.Value 
        d.Date = timeParse(d.Date);
    }
    console.log(data);
    let x = d3.scaleTime()
    // every scale gets a domain & a range
        .domain(d3.extent(data, d => d.Date))
        .range([margin.left, width - margin.right]);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value)])
        .range([height - margin.bottom, margin.top]);

    

    // Put the chart together
    
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
    
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "y-axis")
      .call(d3.axisLeft(y)
        .tickSizeOuter(0)
        .tickFormat(d => d + "%")
        .tickSize(-width));

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em") 
      .text("Year");
    
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Interest rate");

    let line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.Value));
    
    svg.append("path")
        .datum(data)
        .attr("d", line)
        .attr("fill", "lightblue")
        .attr("stroke", "steelblue");

  });