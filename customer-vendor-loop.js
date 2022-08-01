import { LitElement, html, svg, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.2.7/all/lit-all.min.js';
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceLink
} from 'https://cdn.skypack.dev/d3-force@3';

const ITEM_RADIUS = 50;
const ITEM_SIZE_CSS = css`${ITEM_RADIUS*2}px`;
const ITEM_RADIUS_CSS = css`${ITEM_RADIUS}px`;

class CanvasElement extends LitElement {
  static styles = css`
    svg {
      position: absolute;
      width: 100%;
      height: 100%;
      transform: translate(${ITEM_RADIUS_CSS}, ${ITEM_RADIUS_CSS});
    }
  `;

  static properties = {
    _links: { type: Array }
  }

  constructor() {
    super();
    this._links = [];
  }

  nodeSlotChanged(event) {
    const nodes = event.target.assignedElements();
    this._links = [];
    nodes.forEach(node => {
      node.hires.forEach(hireLink => {
        this._links.push({
          source: node.id,
          target: hireLink
        });
      })
    });
    console.log('links', this._links);
    forceSimulation(nodes)
      .force('manyBody', forceManyBody().strength(-300))
      .force('center', forceCenter().x(400).y(300))
      .force('collide', forceCollide(100))
      .force('links', forceLink(this._links).id(d => d.id))
      .on('tick', () => this.requestUpdate())
  }

  render() {
    return html`
    <svg>
      ${this._links.map(link => svg`
        <path d="M ${link.source.x} ${link.source.y} L ${link.target.x} ${link.target.y}" stroke="grey"></path>`)}
    </svg>
    <slot @slotchange=${this.nodeSlotChanged} name="nodes"></slot>
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
        fromAttribute: (value, type) => {
          return value.split(' ');
        }
      }
    },
  }

  constructor() {
    super();
    this.hires = [];
    this.x = 0;
    this.y = 0;
  }

  render() {
    return html`
    <style>
      :host { 
        transform: translate(${this.x}px, ${this.y}px) 
      } 
    </style>
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" />
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
