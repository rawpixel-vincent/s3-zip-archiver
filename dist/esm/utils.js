const waitUntilValueMatch = async (props, field, value, operator = "eq") => {
  let attempts = 0;
  while (attempts < 2e4 / 50) {
    switch (operator) {
      case "eq":
        if (props[field] === value) {
          return;
        }
        break;
      case "neq":
        if (props[field] !== value) {
          return;
        }
        break;
      case "lte":
        if (props[field] <= value) {
          return;
        }
        break;
      case "gte":
        if (props[field] >= value) {
          return;
        }
        break;
      case "lt":
        if (props[field] < value) {
          return;
        }
        break;
      case "gt":
        if (props[field] > value) {
          return;
        }
        break;
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
    attempts += 1;
    await new Promise((r) => setTimeout(r, 50));
  }
};
export {
  waitUntilValueMatch
};
