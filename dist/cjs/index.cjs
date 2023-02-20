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
var s3_zip_archiver_exports = {};
__export(s3_zip_archiver_exports, {
  default: () => s3_zip_archiver_default
});
module.exports = __toCommonJS(s3_zip_archiver_exports);
var import_zipper = require("./zipper.mjs");
var import_utils = require("./utils.mjs");
var s3_zip_archiver_default = {
  zipper: import_zipper.zipper,
  utils: { validateZipperOptions: import_utils.validateZipperOptions, waitUntilValueMatch: import_utils.waitUntilValueMatch }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
