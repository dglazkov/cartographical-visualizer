const data = {
  nodes: [
    { id: "Social Media Platform", type: "setting" },
    { id: "Content", type: "product" },
    { id: "Creator Surface", type: "product" },
    { id: "Social Media PWA", type: "product" },
    { id: "Social Media App", type: "product" },
    { id: "UI Framework", type: "product" },
    { id: "App Platform", type: "setting" },
    { id: "App Store", type: "product" },
    { id: "App Developer Kit", type: "product" },
    { id: "Web Platform", type: "setting" },
    { id: "Web Browser", type: "product" },
    { id: "Web Platform APIs", type: "product" },
  ],
  links: [
    {
      source: "App Developer Kit",
      target: "UI Framework",
      type: "setting"
    },
    {
      source: "UI Framework",
      target: "Social Media App",
      type: "setting"
    },
    {
      source: "UI Framework",
      target: "Creator Surface",
      type: "setting"
    },
    {
      source: "Social Media Platform",
      target: "Content",
      type: "setting"
    },
    {
      source: "Web Platform",
      target: "Social Media PWA",
      type: "setting"
    },
    {
      source: "Creator Surface",
      target: "Social Media Platform",
      type: "vendor"
    },
    {
      source: "Social Media PWA",
      target: "Social Media Platform",
      type: "customer"
    },
    // {
    //   source: "Creator Surface",
    //   target: "Social Media App",
    //   type: "relates"
    // },
    {
      source: "Social Media App",
      target: "Social Media Platform",
      type: "customer"
    },
    {
      source: "App Platform",
      target: "Social Media App",
      type: "setting",
    },
    {
      source: "App Store",
      target: "App Platform",
      type: "customer"
    },
    // {
    //   source: "App Developer Kit",
    //   target: "App Store",
    //   type: "relates"
    // },
    // {
    //   source: "Web Platform APIs",
    //   target: "Web Browser",
    //   type: "relates"
    // },
    {
      source: "App Developer Kit",
      target: "App Platform",
      type: "vendor"
    },
    {
      source: "Web Browser",
      target: "Web Platform",
      type: "customer"
    },
    {
      source: "Web Platform APIs",
      target: "Web Platform",
      type: "vendor"
    },
  ]
};

export { data };