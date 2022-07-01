const NODE_RADIUS = 5;
const LOOP_RADIUS = 25;

const linkArc = (d) => {
  const is_loop = d.target == d.source;
  const radius = is_loop ? LOOP_RADIUS : Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  const large_arc_flag = Number(is_loop);
  const target_y = d.target.y - large_arc_flag;
  return `
    M ${d.source.x},${d.source.y}
    A
      ${radius}, ${radius} 
      0 ${large_arc_flag} 1 
      ${d.target.x},${target_y}
  `;
};

const drag = (simulation) => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

function forceGraph(data, { width, height }) {

  const links = data.links;
  const nodes = data.nodes;
  const types = Array.from(new Set(links.map(l => l.type)));
  const color = d3.scaleOrdinal(types, d3.schemeCategory10);

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((d) => d.id))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const svg = d3
    .create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .style("font", "12px sans-serif");

  svg
    .append("defs")
    .selectAll("marker")
    .data(types)
    .join("marker")
    .attr("id", (d) => `arrow-${d}`)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -0.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", color)
    .attr("d", "M0,-5L10,0L0,5");

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("stroke", d => color(d.type))
    .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

  const node = svg
    .append("g")
    .attr("fill", "currentColor")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .call(drag(simulation));

  node
    .append("circle")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("r", NODE_RADIUS);

  node
    .append("text")
    .attr("x", 8)
    .attr("y", "0.31em")
    .text((d) => d.id)
    .clone(true)
    .lower()
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 3);

  simulation.on("tick", () => {

    const setX = d => {
      const x = d.x + width / 2; 
      return d.x = Math.max(
        NODE_RADIUS, 
        Math.min(width - NODE_RADIUS, x)) - width / 2; 
    };
    const setY = d => { 
      const y = d.y + height / 2; 
      return d.y = Math.max(
        NODE_RADIUS,
        Math.min(height - NODE_RADIUS, y)) - height / 2;
    };

    node
      .attr("transform", (d) => `translate(${setX(d)},${setY(d)})`);

    link.attr("d", linkArc);

  });

  return svg.node();
}

export { forceGraph };