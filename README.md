
[![npm](https://img.shields.io/npm/v/s3-zip-archiver)](https://www.npmjs.com/package/s3-zip-archiver)
[![CodeQL](https://github.com/rawpixel-vincent/s3-zip-archiver/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/rawpixel-vincent/s3-zip-archiver/actions/workflows/github-code-scanning/codeql)
[![ESLint](https://github.com/rawpixel-vincent/s3-zip-archiver/actions/workflows/eslint.yml/badge.svg)](https://github.com/rawpixel-vincent/s3-zip-archiver/actions/workflows/eslint.yml)

# s3-zip-archiver

Upload to s3 a zip archive of s3 files using node streams.

- Open streams of the s3 files using @aws-sdk/client-s3
- Pipe the file stream into a zip archive using https://www.npmjs.com/package/archiver
- Pipe the zip archive to s3 using @aws-sdk/lib-storage

## Example

```javascript
import { S3Client } from '@aws-sdk/client-s3';
import { zipper } from 's3-zip-archiver';

await zipper({
  s3Client: new S3Client({
    region: 'bucket-region',
  }),
  sourceFiles: [
    {
      key: 'path/file1.ext',
      name: 'filename1.ext',
      bucket: 'bucket-name',
    },
    {
      key: 'path/file2.ext',
      name: 'filename2.ext',
      bucket: 'bucket-name',
    },
  ],
  destinationBucket: 'bucket-name',
  destinationKey: `path/archive.zip`,
  onError: async (err) => {
    console.log('onError', err);
  },
  onFileMissing: async (key) => {
    console.log('onFileMissing', key);
  },
  onFileDownloaded: async (key, completed) => {
    console.log('onFileDownloaded', key);
    console.log('completed', completed, 'downloads');
  },
  onHttpUploadProgress: async (progress) => {
    console.log('onProgress', progress);
  },
  onComplete: async (result) => {
    console.log('onComplete', result);
  },
  maxConcurrentDownloads = 25,
  minConcurrentDownloads = 4,
  streamArchiverOptions = {},
});
```
