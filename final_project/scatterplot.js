
  let height = 300,
    width = 1100,
    margin = ({ top: 25, right: 30, bottom: 50, left: 50 });
  
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
    .selectAll(".tick text")
    .call(wrap, x.bandwidth())

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y))

  let line = d3.line()
    .x(d => x(d.classifcation))
    .y(d => y(d.date));

  svg.append("path")
    .datum(data)
    .attr("d", line)
    .attr("fill", "lightblue")
    .attr("stroke", "steelblue");

  svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.classification))
    .attr("cy", d => y(d.date))
    .attr("r", 4)
    .attr("opacity", 0.75)
    .style("fill", d => color(d.Chamber));


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
      d3.select(this).style("fill", d => color(d.Chamber))
      tooltip.style("visibility", "hidden");
    })
    
    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
        while (word = words.pop()) {
          line.push(word)
          tspan.text(line.join(" "))
          if (tspan.node().getComputedTextLength() > width) {
            line.pop()
            tspan.text(line.join(" "))
            line = [word]
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
          }
        }
      })

    }

  });
    
