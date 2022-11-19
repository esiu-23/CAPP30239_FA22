(function dumbbells(){
  let height = 300,
    width = 400,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });

  d3.csv("IL_cleaned_actions.csv").then(dataset => {
    for (let d of dataset) {
        d.Created_date = +d.Created_date;
        d.Latest_date = +d.Latest_date;
    }
  
  let svg = d3.select(DOM.svg(width + margin.left + margin.top, height + margin.top + margin.bottom))
  
  let barCenter = horzScale.bandwidth() / 2;
  
  let chart1 = svg.append("g").classed("chart", true).attr("transform", `translate(${margin.left}, ${margin.top})`)
  
  chart1.selectAll("rect.bar")
    .data(dataset)
    .join("rect")
    .classed("bar", true)
    .attr("x", (d)=>horzScale(d[0]))
    .attr("y", (d)=>{
      let {Latest_date, Created_date} = d[1],
          max = Math.max(Latest_date, Created_date);
      
      return vertScale(max);
    })
    .attr("width", horzScale.bandwidth())
    .attr("height", (d)=>{
      let {Latest_date, Created_date} = d[1]
      return (height - vertScale(Math.abs(Latest_date - Created_date)))
     })
    .attr("fill", "gray")
  
  chart1.selectAll("circle.created_date")
    .data(dataset)
    .join("circle")
    .classed("created_date", true)
    .attr("cx", (d)=>(horzScale(d[0])+barCenter))
    .attr("cy", (d)=>(vertScale(d[1].Created_date)))
    .attr("r", 7)
    .attr("fill", "steelblue")
  
    chart1.selectAll("circle.latest_date")
    .data(dataset)
    .join("circle")
    .classed("latest_date", true)
    .attr("cx", (d)=>(horzScale(d[0])+barCenter))
    .attr("cy", (d)=>(vertScale(d[1].Latest_date)))
    .attr("r", 7)
    .attr("fill", "red")
  
  //Add axis
  chart1.call(horzAxis)
  chart1.call(vertAxisLeft)
  chart1.call(vertAxisRight)
  
  return svg.node();
});
})();