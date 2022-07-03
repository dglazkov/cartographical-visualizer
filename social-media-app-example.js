const data = {
  nodes: [
    { id: "Social Media App", type: "setting" },
    { id: "Content", type: "product" },
    { id: "Creator Surface", type: "product" },
    { id: "Viewer Surface", type: "product" },
    { id: "UI Framework", type: "product" },
    { id: "App Platform", type: "setting" },
    { id: "App Store", type: "product" },
    { id: "App Developer Surface", type: "product" },
    { id: "Web Platform", type: "setting" },
    { id: "Web Viewing Surface", type: "product" },
    { id: "Web Developer Surface", type: "product" },
  ],
  links: [
    {
      source: "Social Media App",
      target: "Content",
      type: "setting"
    },
    {
      source: "Web Platform",
      target: "Creator Surface",
      type: "setting"
    },
    {
      source: "Web Platform",
      target: "Viewer Surface",
      type: "setting"
    },
    {
      source: "Creator Surface",
      target: "Social Media App",
      type: "vendor"
    },
    {
      source: "Creator Surface",
      target: "Viewer Surface",
      type: "relates"
    },
    {
      source: "Viewer Surface",
      target: "Social Media App",
      type: "customer"
    },
    {
      source: "App Platform",
      target: "Viewer Surface",
      type: "setting",
    },
    {
      source: "App Store",
      target: "App Platform",
      type: "customer"
    },
    {
      source: "App Developer Surface",
      target: "App Store",
      type: "relates"
    },
    {
      source: "Web Developer Surface",
      target: "Web Viewing Surface",
      type: "relates"
    },
    {
      source: "App Developer Surface",
      target: "App Platform",
      type: "vendor"
    },
    {
      source: "Web Viewing Surface",
      target: "Web Platform",
      type: "customer"
    },
    {
      source: "Web Developer Surface",
      target: "Web Platform",
      type: "vendor"
    },
  ]
};

export { data };