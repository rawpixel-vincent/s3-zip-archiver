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

// index.mjs
var s3_zip_archiver_exports = {};
__export(s3_zip_archiver_exports, {
  default: () => s3_zip_archiver_default,
  utils: () => utils,
  zipper: () => zipper
});
module.exports = __toCommonJS(s3_zip_archiver_exports);

// zipper.mjs
var import_archiver = __toESM(require("archiver"), 1);
var import_stream = __toESM(require("stream"), 1);
var import_lib_storage = require("@aws-sdk/lib-storage");
var import_client_s3 = require("@aws-sdk/client-s3");

// utils.mjs
var waitUntilValueMatch = async (props, field, value, operator = "eq") => {
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
var validateZipperOptions = (options) => {
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

// zipper.mjs
var notifyCompletion = async (completionState) => {
  completionState.count += 1;
};
var zipper = async (options) => {
  validateZipperOptions(options);
  const {
    s3Client,
    destinationBucket,
    destinationKey,
    sourceFiles,
    onError,
    onHttpUploadProgress,
    onFileMissing,
    onComplete,
    maxConcurrentDownloads = 25,
    minConcurrentDownloads = 4,
    streamArchiverOptions = {}
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
    ...streamArchiverOptions || {}
  });
  const uploadStream = new import_stream.default.PassThrough();
  streamArchiver.pipe(uploadStream);
  const upload = new import_lib_storage.Upload({
    client: s3Client,
    params: {
      Bucket: destinationBucket,
      Key: destinationKey,
      Body: uploadStream,
      ACL: "private"
    }
  });
  upload.on("httpUploadProgress", async (progress) => {
    if (onHttpUploadProgress) {
      await onHttpUploadProgress(progress);
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
    if (!(res == null ? void 0 : res.Body)) {
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
      await waitUntilValueMatch(downloadState, "count", max, "lte");
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

// index.mjs
var utils = { waitUntilValueMatch, validateZipperOptions };
var s3ZipArchiver = {
  zipper,
  utils
};
var s3_zip_archiver_default = s3ZipArchiver;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  utils,
  zipper
});
