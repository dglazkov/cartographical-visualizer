import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.2.7/all/lit-all.min.js';
import { forceSimulation, forceManyBody, forceCenter, forceCollide } from 'https://cdn.skypack.dev/d3-force@3';

const ITEM_SIZE = css`100px`;

class CanvasElement extends LitElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const nodes = [...this.children];
    forceSimulation(nodes)
      .force("manyBody", forceManyBody().strength(-20))
      .force("center", forceCenter().x(400).y(300))
      .force('collide', forceCollide(50));
  }

  render() {
    return html`<slot></slot>`;
  }
}

class ProductElement extends LitElement {
  static styles = css`
  :host {
    position: absolute;
    width: ${ITEM_SIZE};
  }

  circle { 
    stroke: none; 
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
  }

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
}

  render() {
    return html`
    <style> :host { 
      transform: translate(${this.x}px, ${this.y}px); 
    } </style>
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" />
      <foreignObject x="15" y="15" width="70" height="70">
        <div><slot></slot></div>
      </foreignObject>
    </svg>`;
  }
}

customElements.define('oc-product', ProductElement);
customElements.define('oc-canvas', CanvasElement)