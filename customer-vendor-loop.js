import { LitElement, html, svg, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.2.7/all/lit-all.min.js';
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceLink
} from 'https://cdn.skypack.dev/d3-force@3';

const ITEM_RADIUS = 50;
const ITEM_SIZE_CSS = css`${ITEM_RADIUS * 2}px`;
const ITEM_RADIUS_CSS = css`${ITEM_RADIUS}px`;

const makeDraggable = (element, start_callback, end_callback) => {
  let x_offset = 0;
  let y_offset = 0;
  let dragging = false;

  const getPointerCoords = (x, y) => {
    return [x - x_offset - ITEM_RADIUS, y - y_offset - ITEM_RADIUS];
  }

  element.addEventListener('pointerdown', e => {
    let x, y;
    x_offset = 0;
    y_offset = 0;

    dragging = true;

    start_callback && start_callback();

    [x, y] = getPointerCoords(e.clientX, e.clientY);
    x_offset = x - element.x;
    y_offset = y - element.y;
    [element.fx, element.fy] =
      getPointerCoords(e.clientX, e.clientY);

    element.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  element.addEventListener('pointermove', e => {
    if (!dragging) return;

    [element.x, element.y] =
      [element.fx, element.fy] =
      getPointerCoords(e.clientX, e.clientY);

    e.preventDefault();
  });
  element.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;

    end_callback && end_callback();

    element.fx = null;
    element.fy = null;
    [element.x, element.y] = getPointerCoords(e.clientX, e.clientY);

    element.releasePointerCapture(e.pointerId);
    e.preventDefault();
  });
}


class CanvasElement extends LitElement {
  static styles = css`
    svg {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    g#links {
      transform: translate(${ITEM_RADIUS_CSS}, ${ITEM_RADIUS_CSS});
    }
  `;

  static properties = {
    px: { type: Number },
    py: { type: Number },
    zoom: { type: Number },
    _links: { type: Array }
  }

  constructor() {
    super();
    this.px = 0;
    this.py = 0;
    this.zoom = 1;
    this._links = [];

    let panning = false;
    let x_offset = 0;
    let y_offset = 0;

    const getPointerCoords = (x, y) => {
      return [x - x_offset, y - y_offset];
    }  

    this.addEventListener('pointerdown', e => {
      if (e.target != this) return;

      let x, y;
      x_offset = 0;
      y_offset = 0;
  
      panning = true;
  
      [x, y] = getPointerCoords(e.clientX, e.clientY);
      x_offset = x - this.px;
      y_offset = y - this.py;
      [this.px, this.py] =
        getPointerCoords(e.clientX, e.clientY);
  
      e.preventDefault();
    });
    this.addEventListener('pointermove', e => {
      if (!panning) return;
  
      [this.px, this.py] =
        getPointerCoords(e.clientX, e.clientY);
  
      e.preventDefault();
    });
    this.addEventListener('pointerup', e => {
      if (!panning) return;
      panning = false;
  
      [this.px, this.py] = getPointerCoords(e.clientX, e.clientY);
  
      e.preventDefault();
    });
    this.addEventListener('wheel', e => {
      if (e.ctrlKey) {
        this.zoom -= e.deltaY * 0.01;
      }
      e.preventDefault();
    });
  }

  nodeSlotChanged(event) {
    const nodes = event.target.assignedElements();
    const simulation = forceSimulation(nodes)
      .force('manyBody', forceManyBody().strength(-900))
      .force('center', forceCenter().x(400).y(300))
      .force('collide', forceCollide(100))
    this._links = [];
    nodes.forEach(node => {
      makeDraggable(node,
        () => simulation.alphaTarget(0.1).restart(),
        () => simulation.alphaTarget(0));
      node.hires.forEach(link =>
        this._links.push({
          source: node.id,
          target: link
        })
      )
    });
    simulation
      .force('links', forceLink(this._links).id(d => d.id))
      .on('tick', () => this.requestUpdate())
  }

  render() {
    return html`
    <svg>
      <g id="zoomable" transform="scale(${this.zoom}) translate(${this.px}, ${this.py})">
        <g id="links">
        ${this._links.map(link => svg`
          <path d="M ${link.source.x} ${link.source.y} L ${link.target.x} ${link.target.y}"/>`)}
        </g>
        <foreignObject width="1000%" height="1000%">
          <slot @slotchange=${this.nodeSlotChanged}></slot>
        </foreignObject>
      </g>
    </svg>
    `;
  }
}

class ProductElement extends LitElement {
  static styles = css`
  :host {
    position: absolute;
    width: ${ITEM_SIZE_CSS};
  }
  
  div {
    display: flex;
    height: 100%;
    align-items: center;
    text-align: center;
    justify-content: center;   
  }`;

  static properties = {
    x: { type: Number },
    y: { type: Number },
    hires: {
      converter: {
        fromAttribute: value => value.split(' ')
      }
    }
  }

  constructor() {
    super();
    this.hires = [];
    this.x = 0;
    this.y = 0;
    this.fx = null;
    this.fy = null;
  }

  render() {
    return html`
    <style>
      :host { 
        transform: translate(${this.x}px, ${this.y}px) 
      } 
    </style>
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" />
      <foreignObject x="15" y="15" width="70" height="70">
        <div><span><slot></slot></span></div>
      </foreignObject>
    </svg>`;
  }
}

class PlatformElement extends ProductElement {
  constructor() {
    super();
  }
}

customElements.define('oc-product', ProductElement);
customElements.define('oc-platform', PlatformElement);
customElements.define('oc-canvas', CanvasElement);
