import archiver from "archiver";
import stream from "stream";
import { Upload } from "@aws-sdk/lib-storage";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { waitUntilValueMatch } from "./utils.js";
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
  const streamArchiver = archiver("zip", {
    zlib: {
      level: 0
    },
    forceZip64: true,
    store: true,
    statConcurrency: 125
  });
  const uploadStream = new stream.PassThrough();
  streamArchiver.pipe(uploadStream);
  const upload = new Upload({
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
        new GetObjectCommand({ Bucket: bucket, Key: key })
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
export {
  zipper
};
