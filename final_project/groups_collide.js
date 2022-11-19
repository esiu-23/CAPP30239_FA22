(function movement(){
   
    let width = 860,
    height = 600,
    radius = 5,
    padding = 1,
    cluster_padding = 5,
    margin = ({top: 25, right: 30, bottom: 35, left: 10});

    // Create SVG & Enter data
    const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);
    
    d3.csv('month_actions.csv').then(dataset => {

        for (let d of dataset){
            d.classification = +d.classification;
        }
    console.log(dataset);

    groups = {
    const groups = {
        "met": { x: width/5, y: height/3, color: "#FAF49A", cnt: 0, fullname: "Met" },
        "romantic": { x: 3*width/5, y: height/3, color: "#BEE5AA", cnt: 0, fullname: "Romantic" },
        "lived": { x: 3*width/5, y: 2*height/3, color: "#93D1BA", cnt: 0, fullname: "Lived Together" },
        "married": { x: width/5, y: 2*height/3, color: "#79BACE", cnt: 0, fullname: "Married" },
    };
    return groups
    }

    console.log(groups['lived'])


    // Consolidate stages by pid.
    // The data file is one row per stage change.
    people = {
    const people = {};
    stages.forEach(d => {
        if (d3.keys(people).includes(d.pid + "")) {
        people[d.pid + ""].push(d);
        } else {
        people[d.pid + ""] = [d];
        }
    });
    return people
    }

    // Create node data.
    nodes = d3.keys(people).map(function(d) {
        // Initialize count for each group.
        groups[people[d][0].grp].cnt += 1;
        return {
        id: "node"+d,
        x: groups[people[d][0].grp].x + Math.random(),
        y: groups[people[d][0].grp].y + Math.random(),
        r: radius,
        color: groups[people[d][0].grp].color,
        group: people[d][0].grp,
        timeleft: people[d][0].duration,
        istage: 0,
        stages: people[d]
        }
    });

    chart = {
        // Variables.
        let time_so_far = 0;
        
        // The SVG object.

        const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width+40, height+40]);
        
        // ???
        svg.append("g")
        .attr("transform", "translate(" + 20 + "," + 20 + ")");
        
        // ???
        d3.select("#chart").style("width", (width + 20 + 20) + "px");
    
        // Circle for each node.
        const circle = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", d => d.color);
    
        // Ease in the circles.
        circle.transition()
        .delay((d, i) => i * 5)
        .duration(800)
        .attrTween("r", d => {
            const i = d3.interpolate(0, d.r);
            return t => d.r = i(t);
        });
        
        // Group name labels
        svg.selectAll('.grp')
        .data(d3.keys(groups))
        .join("text")
        .attr("class", "grp")
        .attr("text-anchor", "middle")
        .attr("x", d => groups[d].x)
        .attr("y", d => groups[d].y - 70)
        .text(d => groups[d].fullname);
    
        // Group counts
        svg.selectAll('.grpcnt')
        .data(d3.keys(groups))
        .join("text")
        .attr("class", "grpcnt")
        .attr("text-anchor", "middle")
        .attr("x", d => groups[d].x)
        .attr("y", d => groups[d].y - 50)
        .text(d => groups[d].cnt);
        
        // Forces
        const simulation = d3.forceSimulation(nodes)
        .force("x", d => d3.forceX(d.x))
        .force("y", d => d3.forceY(d.y))
        .force("cluster", forceCluster())
        .force("collide", forceCollide())
        .alpha(.09)
        .alphaDecay(0);
    
        // Adjust position of circles.
        simulation.on("tick", () => {
        circle
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("fill", d => groups[d.group].color);
        });
        
        // Make time pass. Adjust node stage as necessary.
        function timer() {
        nodes.forEach(function (o, i) {
            o.timeleft -= 1;
            if (o.timeleft == 0 && o.istage < o.stages.length - 1) {
            // Decrease count for previous group.
            groups[o.group].cnt -= 1;
            // Update current node to new group.
            o.istage += 1;
            o.group = o.stages[o.istage].grp;
            o.timeleft = o.stages[o.istage].duration;
            // Increment count for new group.
            groups[o.group].cnt += 1;
            }
        });
        // Increment time.
        time_so_far += 1;
        d3.select("#timecount .cnt").text(time_so_far);
        // Update counters.
        svg.selectAll('.grpcnt').text(d => groups[d].cnt);
        // Do it again.
        d3.timeout(timer, 500);
        } // @end timer()
        
        // Start things off after a few seconds.
        d3.timeout(timer, 2000);
        
        return svg.node()
    }

    // Force to increment nodes to groups.
    function forceCluster() {
        const strength = .15;
        let nodes;
    
        function force(alpha) {
        const l = alpha * strength;
        for (const d of nodes) {
            d.vx -= (d.x - groups[d.group].x) * l;
            d.vy -= (d.y - groups[d.group].y) * l;
        }
        }
        force.initialize = _ => nodes = _;
    
        return force;
    }

    // Force for collision detection.
    function forceCollide() {
        const alpha = 0.2; // fixed for greater rigidity!
        const padding1 = padding; // separation between same-color nodes
        const padding2 = cluster_padding; // separation between different-color nodes
        let nodes;
        let maxRadius;
    
        function force() {
        const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
        for (const d of nodes) {
            const r = d.r + maxRadius;
            const nx1 = d.x - r, ny1 = d.y - r;
            const nx2 = d.x + r, ny2 = d.y + r;
            
            quadtree.visit((q, x1, y1, x2, y2) => {
            if (!q.length) do {
                if (q.data !== d) {
                const r = d.r + q.data.r + (d.group === q.data.group ? padding1 : padding2);
                let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l, d.y -= y *= l;
                    q.data.x += x, q.data.y += y;
                }
                }
            } while (q = q.next);
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        }
        }
    
        force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1, padding2);
    
        return force;
    }
})();