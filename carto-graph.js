import * as d3 from 'https://cdn.skypack.dev/d3@7';

const HTML = `
<style>
text {
  cursor: pointer;
  user-select: none;
}

</style>`;

// Kinds of notes:
// * 'product' -- a customer-vendor loop
// * 'platform' -- a platform
// Kinds of links:
// * 'P' -- 🏗️ strong 'builds Product' link
// * 'C' -- 👥 strong 'attracts Customers' link
// * 'I' -- ⚡ strong 'engages in Interaction' link
// * 'p' -- 🏗️ weak 'builds Product' link
// * 'c' -- 👥 weak 'attracts Customers' link
// * 'i' -- ⚡ weak 'engages in Interaction' link
// * '$' -- 💰 weak 'funds' link

const NODE_RADIUS = 6;
const LOOP_RADIUS = 35;
const NODE_COLORS = {
  'platform': 'blue',
  'product': 'gray',
}
const FORCE_MARKERS = {
  'A': {
    x: -4,
    icon: 'A'
  },
  'P': {
    x: -6,
    icon: '🏗️'
  },
  'I': {
    x: -6,
    icon: '⚡'
  },
  '$': {
    x: -6,
    icon: '💰'
  },
  'C': {
    x: -6,
    icon: '👥'
  },
  '?': {
    x: -4,
    icon: '?'
  }
}

const getForceMarker = d => {
  return FORCE_MARKERS[d.type.toUpperCase()] ?? FORCE_MARKERS['?'];
}

const linkArc = (d) => {
  const is_loop = d.target == d.source;
  const radius = is_loop ? 
    LOOP_RADIUS : 
    Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  // the '- 1' is there to make the arc not be closed when it's a self-loop.
  return `
    M ${d.source.x},${d.source.y}
    A
      ${radius}, ${radius} 
      0 ${Number(is_loop)} 1 
      ${d.target.x},${d.target.y - 1}
  `;
};

const linkLine = (d) => {
  const mid_x = (d.source.x + d.target.x) / 2;
  const mid_y = (d.source.y + d.target.y) / 2;
  return `
    M ${d.source.x},${d.source.y}
    L ${mid_x}, ${mid_y}
    L ${d.target.x},${d.target.y}`;
}

const drag = (simulation) => {
  return d3
    .drag()
    .on('start', (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on('drag', (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on('end', (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
};

function forceGraph(data, { width, height }) {

  const links = data.links;
  const nodes = data.nodes;
  const linkTypes = Array.from(new Set(links.map(l => l.type)));
  const nodeColor = t => NODE_COLORS[t];

  const simulation = d3
    .forceSimulation(nodes)
    .force('link', d3.forceLink(links).id((d) => d.id))
    .force('charge', d3.forceManyBody().strength(-250))
    .force('collide', d3.forceCollide(40))
    .force('x', d3.forceCenter());

  const svg = d3
    .create('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .style('font', '12px sans-serif');

  svg
    .append('defs')
    .selectAll('marker')
    .data(linkTypes)
    .join('marker')
    .attr('id', (d) => `arrow-${d}`)
    .attr('viewBox', '0 -6 10 12')
    .attr('refX', 11 + NODE_RADIUS)
    .attr('refY', -0.5)
    .attr('markerWidth', NODE_RADIUS)
    .attr('markerHeight', NODE_RADIUS)
    .attr('orient', 'auto')
    .append('path')
    .attr('fill', 'gray')
    .attr('d', 'M0,-6 L10,0 L0,6 L3,0');

  // append mid-marker
  const force_marker = svg
    .append('defs')
    .selectAll('marker').data(links).join('marker')
    .filter(d => d.type.toUpperCase() != 'A') // don't show force marker for platforms
    .append('marker')
    .attr('id', d => `mid-${d.type}`)
    .attr('viewBox', '-10 -10 20 20')
    .attr('refX', 0)
    .attr('refY', 0)
    .attr('markerWidth', 14)
    .attr('markerHeight', 14)
    .attr('orient', 0)

  force_marker
    .append('circle')
    .attr('fill', 'white')
    .attr('r', NODE_RADIUS + 2);

  force_marker
    .append('text')
    .style('font', '12px serif')
    .attr('y', 4)
    .attr('x', d => getForceMarker(d).x)
    .text(d => getForceMarker(d).icon);

  const link = svg
    .append('g')
    .attr('fill', 'none')
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 1.5)
    .selectAll('path')
    .data(links)
    .join('path')
    .attr('stroke', 'gray')
    .attr('marker-mid', d => `url(${new URL(`#mid-${d.type}`, location)})`)
    .attr('marker-end', d => `url(${new URL(`#arrow-${d.type}`, location)})`);

  link
    .filter(d => d.type != d.type.toUpperCase() || d.type == '$')
    .attr('stroke-dasharray', '4')

  const node = svg
    .append('g')
    .attr('fill', 'currentColor')
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .call(drag(simulation));

  node
    .append('circle')
    .attr('fill', d => nodeColor(d.type))
    .attr('stroke', 'white')
    .attr('stroke-width', 1.5)
    .attr('r', NODE_RADIUS);

  node
    .append('circle')
    .attr('stroke', 'none')
    .attr('fill', 'white')
    .attr('stroke-width', 1.5)
    .attr('r', NODE_RADIUS - 3);

  node
    .append('text')
    .attr('x', 8)
    .attr('y', '0.31em')
    .text((d) => d.id)
    .clone(true)
    .lower()
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 4);

  simulation.on('tick', () => {

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
      .attr('transform', (d) => `translate(${setX(d)},${setY(d)})`);

    link.attr('d', linkLine);

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

customElements.define('carto-graph', GraphElement);