import { LitElement, html, svg, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.2.7/all/lit-all.min.js'
// import * as d3 from "https://cdn.skypack.dev/d3@7";


class CustomerVendorLoop extends LitElement {
  static styles = css`
    circle.stock { 
      cursor: pointer;
      fill: white;
      stroke: none; 
    }
    
    circle.flow { 
      cursor: pointer;
      fill: none;
      stroke: magenta;
      stroke-width: 3px;
    }
    
    g {
      transform: scale(0.5) translate(150px, 150px);
    }
    `;

  // static properties = {
  //   name: {type: String},
  // };

  constructor() {
    super();
  }
  
  render() {
    return html`
    <svg viewBox="0 0 300 300">
      <g>
        <circle class="flow" cx="150" cy="150" r="150" />
        <circle class="stock" cx="45" cy="45" r="40" />
        <circle class="stock" cx="255" cy="45" r="40" />
        <circle class="stock" cx="255" cy="255" r="40" />
        <circle class="stock" cx="45" cy="255" r="40" />
      </g>
    </svg>`;
  }
}

customElements.define('customer-vendor-loop', CustomerVendorLoop);
