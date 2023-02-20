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
  validateZipperOptions: () => validateZipperOptions,
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
const validateZipperOptions = (options) => {
  if (options.maxConcurrentDownloads < options.minConcurrentDownloads) {
    throw new Error(
      "maxConcurrentDownloads must be greater than or equal to minConcurrentDownloads"
    );
  }
  if (options.minConcurrentDownloads < 1) {
    throw new Error("minConcurrentDownloads must be greater than 0");
  }
  if (options.maxConcurrentDownloads < 1) {
    throw new Error("maxConcurrentDownloads must be greater than 0");
  }
  if (!options.sourceFiles.length) {
    throw new Error(
      "sourceFiles must contain at least one file to download and zip"
    );
  }
  if (!options.destinationBucket) {
    throw new Error("destinationBucket must be provided");
  }
  if (!options.destinationKey) {
    throw new Error("destinationKey must be provided");
  }
  if (!options.s3Client) {
    throw new Error("s3Client must be provided");
  }
  if (!options.onComplete) {
    throw new Error("onComplete must be provided");
  }
  if (options.onError && typeof options.onError !== "function") {
    throw new Error("onError must be a function");
  }
  if (options.onHttpUploadProgress && typeof options.onHttpUploadProgress !== "function") {
    throw new Error("onProgress must be a function");
  }
  if (options.onFileMissing && typeof options.onFileMissing !== "function") {
    throw new Error("onFileMissing must be a function");
  }
  if (options.onFileDownloaded && typeof options.onFileDownloaded !== "function") {
    throw new Error("onFileDownloaded must be a function");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validateZipperOptions,
  waitUntilValueMatch
});
