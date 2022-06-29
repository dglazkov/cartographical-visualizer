const data = {
  nodes: [{ id: "one" }, { id: "two" }],
  links: [
    {
      source: "one",
      target: "two",
      type: "accelerates"
    },
    {
      source: "two",
      target: "one",
      type: "attenuates"
    }
  ]
};

export { data };