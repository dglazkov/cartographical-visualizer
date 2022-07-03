import * as d3 from "https://cdn.skypack.dev/d3@7";

const HTML = `
<style>
text {
  cursor: pointer;
  user-select: none;
}
</style>;`

const NODE_RADIUS = 6;
const LOOP_RADIUS = 35;
const LINK_COLORS = {
  'reinforces': 'green',
  'funds': 'red',
};
const NODE_COLORS = {
  'ecosystem': 'blue',
  'product': 'gray',
}

const linkArc = (d) => {
  const is_loop = d.target == d.source;
  const radius = is_loop ? LOOP_RADIUS : Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  // the "- 1" is there to make the arc not be closed when it's a self-loop.
  return `
    M ${d.source.x},${d.source.y}
    A
      ${radius}, ${radius} 
      0 ${Number(is_loop)} 1 
      ${d.target.x},${d.target.y - 1}
  `;
};

const drag = (simulation) => {
  return d3
    .drag()
    .on("start", (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on("end", (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
};

function forceGraph(data, { width, height }) {

  const links = data.links;
  const nodes = data.nodes;
  const linkTypes = Array.from(new Set(links.map(l => l.type)));
  const nodeTypes = Array.from(new Set(nodes.map(n => n.type)));
  const linkColor = t => LINK_COLORS[t];
  const nodeColor = t => NODE_COLORS[t];

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((d) => d.id))
    .force("charge", d3.forceManyBody().strength(-500))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const svg = d3
    .create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .style("font", "12px sans-serif");

  svg
    .append("defs")
    .selectAll("marker")
    .data(linkTypes)
    .join("marker")
    .attr("id", (d) => `arrow-${d}`)
    .attr("viewBox", "0 -6 10 12")
    .attr("refX", 11 + NODE_RADIUS)
    .attr("refY", -0.5)
    .attr("markerWidth", NODE_RADIUS)
    .attr("markerHeight", NODE_RADIUS)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", linkColor)
    .attr("d", "M0,-6 L10,0 L0,6 L3,0");

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("stroke", d => linkColor(d.type))
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
    .attr("fill", d => nodeColor(d.type))
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("r", NODE_RADIUS);

  node
    .append("circle")
    .attr("stroke", "none")
    .attr("fill", "white")
    .attr("stroke-width", 1.5)
    .attr("r", n => n.type == 'ecosystem' ? 0 : NODE_RADIUS - 3);

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

class GraphElement extends HTMLElement {
  constructor() {
    super();

  }

  draw(data) {
    // only works once for now.
    if (this.shadowRoot)
      return;

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = HTML;

    const svg_node = forceGraph(data, {
      height: 400,
      width: 400,
    });

    shadow.appendChild(svg_node);
  }
}

customElements.define("carto-graph", GraphElement);