const data = {
  nodes: [
    { id: "one", type: "product" },
    { id: "two", type: "ecosystem" },
    { id: "three", type: "product" },
    { id: "four", type: "ecosystem" },
    { id: "five", type: "product" },
    { id: "six", type: "ecosystem" },
  ],
  links: [
    { source: "one", target: "two", type: "accelerates" },
    { source: "two", target: "one", type: "attenuates" },
    { source: "four", target: "one", type: "attenuates" },
    { source: "four", target: "three", type: "accelerates" },
    { source: "five", target: "one", type: "accelerates" },
    { source: "three", target: "three", type: "attenuates" },
    { source: "two", target: "two", type: "accelerates" },
    { source: "six", target: "four", type: "accelerates" },
    { source: "six", target: "two", type: "accelerates" },
  ]
};

export { data };