var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var s3_zip_archiver_exports = {};
__export(s3_zip_archiver_exports, {
  zipper: () => zipper
});
module.exports = __toCommonJS(s3_zip_archiver_exports);
var import_archiver = __toESM(require("archiver"), 1);
var import_stream = __toESM(require("stream"), 1);
var import_lib_storage = require("@aws-sdk/lib-storage");
var import_client_s3 = require("@aws-sdk/client-s3");
var import_utils = require("./utils.js");
const notifyCompletion = async (completionState) => {
  completionState.count += 1;
};
const zipper = async (options) => {
  const {
    s3Client,
    destinationBucket,
    destinationKey,
    sourceFiles,
    onError,
    onProgress,
    onFileMissing,
    onComplete,
    maxConcurrentDownloads = 25,
    minConcurrentDownloads = 4
  } = options;
  const downloadState = { count: 0 };
  const completionState = {
    count: 0,
    total: sourceFiles.length,
    notifying: false
  };
  const streamArchiver = (0, import_archiver.default)("zip", {
    zlib: {
      level: 0
    },
    forceZip64: true,
    store: true,
    statConcurrency: 125
  });
  const uploadStream = new import_stream.default.PassThrough();
  streamArchiver.pipe(uploadStream);
  const upload = new import_lib_storage.Upload({
    client: s3Client,
    params: {
      Bucket: destinationBucket,
      Key: destinationKey,
      Body: uploadStream,
      ACL: "private",
      ContentType: "application/zip"
    }
  });
  upload.on("httpUploadProgress", async (progress) => {
    if (onProgress) {
      await onProgress(progress);
    }
  });
  upload.done().then(async () => {
    await onComplete({
      bucket: destinationBucket,
      key: destinationKey,
      filesize: streamArchiver.pointer()
    });
  });
  for (let index = 0; index < sourceFiles.length; index++) {
    const { key, name, bucket } = sourceFiles[index];
    let res;
    try {
      res = await s3Client.send(
        new import_client_s3.GetObjectCommand({ Bucket: bucket, Key: key })
      );
    } catch (error) {
      if (onError) {
        await onError(error);
      }
    }
    if (!res?.Body) {
      if (onFileMissing) {
        await onFileMissing(key);
      }
      continue;
    }
    downloadState.count += 1;
    const fileReadStream = res.Body;
    fileReadStream.on("end", async () => {
      downloadState.count -= 1;
      await notifyCompletion(completionState);
    });
    fileReadStream.on("error", async (err) => {
      if (onError) {
        await onError(err);
      }
    });
    streamArchiver.append(fileReadStream, {
      name
    });
    const max = Math.max(
      minConcurrentDownloads,
      Math.min(maxConcurrentDownloads, minConcurrentDownloads + index - 6)
    );
    if (downloadState.count > max) {
      await (0, import_utils.waitUntilValueMatch)(downloadState, "count", max, "lte");
    }
  }
  try {
    await streamArchiver.finalize();
  } catch (error) {
    if (onError) {
      await onError(error);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  zipper
});
