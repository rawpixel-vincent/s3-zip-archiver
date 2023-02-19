var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var utils_exports = {};
__export(utils_exports, {
  waitUntilValueMatch: () => waitUntilValueMatch
});
module.exports = __toCommonJS(utils_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  waitUntilValueMatch
});
