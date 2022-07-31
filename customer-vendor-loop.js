import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.2.7/all/lit-all.min.js';
import { forceSimulation, forceManyBody, forceCenter, forceCollide } from 'https://cdn.skypack.dev/d3-force@3';

const ITEM_SIZE = css`100px`;

class CanvasElement extends LitElement {
  static properties = {
    links: { type: Array }
  }

  constructor() {
    super();
  }

  nodeSlotChanged(event) {
    forceSimulation(event.target.assignedElements())
      .force('manyBody', forceManyBody().strength(-20))
      .force('center', forceCenter().x(400).y(300))
      .force('collide', forceCollide(50));
  }

  render() {
    return html`
    <slot name="links"></slot>
    <slot @slotchange=${this.nodeSlotChanged} name="nodes"></slot>
    `;
  }
}

class ProductElement extends LitElement {
  static styles = css`
  :host {
    position: absolute;
    width: ${ITEM_SIZE};
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
    name: { type: String },
  }

  constructor() {
    super();
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
        <div><slot></slot></div>
      </foreignObject>
    </svg>`;
  }
}

class LinkElement extends LitElement {
  static properties = {
    source: { type: String },
    target: { type: String },
    type: { type: String },
  }

  static styles = css`
  :host {
    position: absolute;
    width: 100%;
  }
  `;

  constructor() {
    super();
  }

  render() {
    return html`
    <svg viewBox="0 0 100 100">
      <path d="M 0 0 L 100 100" stroke="gray" stroke-width="1"></path>
    </svg>
    `;
  }
}

customElements.define('oc-product', ProductElement);
customElements.define('oc-canvas', CanvasElement);
customElements.define('oc-link', LinkElement);