const data = {
  nodes: [
    { id: "Social Media App", type: "product" },
    { id: "Viewer/Creator", type: "ecosystem" },
    { id: "Creator Surface", type: "product" },
    { id: "Viewer Surface", type: "product" },
  ],
  links: [
    {
      source: "Social Media App",
      target: "Viewer/Creator",
      type: "reinforces"
    },
    {
      source: "Viewer/Creator",
      target: "Social Media App",
      type: "funds"
    },
    {
      source: "Creator Surface",
      target: "Social Media App",
      type: "reinforces"
    },
    {
      source: "Social Media App",
      target: "Creator Surface",
      type: "funds"
    },
    {
      source: "Viewer Surface",
      target: "Social Media App",
      type: "reinforces"
    },
    {
      source: "Social Media App",
      target: "Viewer Surface",
      type: "funds"
    },
  ]
};

export { data };