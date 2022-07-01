const data = {
  nodes: [
    { id: "one" },
    { id: "two" },
    { id: "three" },
    { id: "four" },
    { id: "five" },
  ],
  links: [
    { source: "one", target: "two", type: "accelerates" },
    { source: "two", target: "one", type: "attenuates" },
    { source: "four", target: "one", type: "attenuates" },
    { source: "four", target: "three", type: "accelerates" },
    { source: "five", target: "one", type: "accelerates" },
    { source: "three", target: "three", type: "attenuates" },
  ]
};

export { data };