
(function radial_bar(){
    let width = 960,
    height = 500,
    outerRadius = width/2 - 10 ,
    innerRadius = width/5;
    margin = ({top: 25, right: 30, bottom: 35, left: 10});

    const svg = d3.select("#chart2")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.csv('month-actions2.csv').then(data => {
    for (let d of data){
        d.counts = +d.counts;
    }
    console.log(data);

    const svg = d3.create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round");

    line = d3.lineRadial()
    .curve(d3.curveLinearClosed)
    .angle(d => x(d.months))
    
    area = d3.areaRadial()
    .curve(d3.curveLinearClosed)
    .angle(d => x(d.months))

svg.append("path")
    .attr("fill", "lightsteelblue")
    .attr("fill-opacity", 0.2)
    .attr("d", area
        .innerRadius(d => y(d.))
        .outerRadius(d => y(d.maxmax))
      (data));

svg.append("path")
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.2)
    .attr("d", area
        .innerRadius(d => y(d.min))
        .outerRadius(d => y(d.max))
      (data));
  
svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line
        .radius(d => y(d.avg))
      (data));

svg.append("g")
    .call(xAxis);

svg.append("g")
    .call(yAxis);

x = d3.scaleBand()
    .domain([d.months])
    .range([0, 2 * Math.PI])

y = d3.scaleLinear()
.domain(0, 20000)
.range([innerRadius, outerRadius])

xAxis = g => g
.attr("font-family", "sans-serif")
.attr("font-size", 10)
.call(g => g.selectAll("g")
    .data(x.ticks())
    .join("g")
    .each((d, i) => d.id = DOM.uid("months"))
    .call(g => g.append("path")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
        .attr("d", d => `
            M${d3.pointRadial(x(d), innerRadius)}
            L${d3.pointRadial(x(d), outerRadius)}
        `))
    .call(g => g.append("path")
        .attr("id", d => d.id.id)
        .datum(d => [d, d3.month.offset(d, 1)])
        .attr("fill", "none")
        .attr("d", ([a, b]) => `
            M${d3.pointRadial(x(a), innerRadius)}
            A${innerRadius},${innerRadius} 0,0,1 ${d3.pointRadial(x(b), innerRadius)}
        `))
    .call(g => g.append("text")
        .append("textPath")
        .attr("startOffset", 6)
        .attr("xlink:href", d => d.id.href)
        .text(d3.utcFormat("%B"))))

    yAxis = g => g
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .call(g => g.selectAll("g")
        .data(y.ticks().reverse())
        .join("g")
        .attr("fill", "none")
        .call(g => g.append("circle")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.2)
            .attr("r", y))
        .call(g => g.append("text")
            .attr("y", d => -y(d))
            .attr("dy", "0.35em")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .text((x, i) => `${x.toFixed(0)}${i ? "" : "°F"}`)
            .clone(true)
            .attr("y", d => y(d))
            .selectAll(function() { return [this, this.previousSibling]; })
            .clone(true)
            .attr("fill", "currentColor")
            .attr("stroke", "none")))
    

    })

})();