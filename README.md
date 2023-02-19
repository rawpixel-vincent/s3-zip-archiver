# s3-zip-archiver
Read and upload a zip archive of s3 files to s3 using streams

## Example

```javascript
import { S3Client } from '@aws-sdk/client-s3';
import { zipper } from './index.js';

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
  onProgress: async (progress) => {
    console.log('onProgress', progress);
  },
  onComplete: async (result) => {
    console.log('onComplete', result);
  },
});
```
