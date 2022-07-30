import { LitElement, html, svg, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.2.7/all/lit-all.min.js'

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
    }`;

  // static properties = {
  //   name: {type: String},
  // };

  constructor() {
    super();
  }
  
  render() {
    return html`
    <svg viewBox="0 0 300 300">
      <foreignObject x="100" y="100" width="100" height="100">
        <slot></slot>
      </foreignObject>
      <g>
        <circle class="flow" cx="150" cy="150" r="150" />
        <circle class="stock" cx="45" cy="45" r="60" />
        <circle class="stock" cx="255" cy="45" r="60" />
        <circle class="stock" cx="255" cy="255" r="60" />
        <circle class="stock" cx="45" cy="255" r="60" />
      </g>
    </svg>`;
  }
}

class CircleElement extends LitElement {
  static styles = css`
  circle { 
    stroke: none; 
  }
  
  div.flex {
    display: flex;
    height: 100%;
    align-items: center;
    text-align: center;
  }`;

  constructor() {
    super();
  }

  render() {
    return html`
    <svg>
      <circle cx="50" cy="50" r="50" />
      <foreignObject x="15" y="15" width="70" height="70">
        <div class="flex"><slot></slot></div>
      </foreignObject>
    </svg>`;
  }
}

customElements.define('customer-vendor-loop', CustomerVendorLoop);
customElements.define('my-circle', CircleElement);