/**
 * Returns a promise that resolve when
 * props[field] match the given value.
 * @param {Object} props
 * @param {String} field
 * @param {unknown} value
 * @param {'eq'|'lte'|'gte'|'neq'|'lt'|'gt'} operator
 */
export const waitUntilValueMatch = async (
  props,
  field,
  value,
  operator = 'eq',
) => {
  let attempts = 0;
  while (attempts < 20000 / 50) {
    switch (operator) {
      case 'eq':
        if (props[field] === value) {
          return;
        }
        break;
      case 'neq':
        if (props[field] !== value) {
          return;
        }
        break;
      case 'lte':
        if (props[field] <= value) {
          return;
        }
        break;
      case 'gte':
        if (props[field] >= value) {
          return;
        }
        break;
      case 'lt':
        if (props[field] < value) {
          return;
        }
        break;
      case 'gt':
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

/**
 * @param {import('./zipper.mjs').ZipperOptions} options
 * @throws {Error}
 */
export const validateZipperOptions = (options) => {
  if (options.maxConcurrentDownloads < options.minConcurrentDownloads) {
    throw new Error(
      'maxConcurrentDownloads must be greater than or equal to minConcurrentDownloads',
    );
  }
  if (options.minConcurrentDownloads < 1) {
    throw new Error('minConcurrentDownloads must be greater than 0');
  }
  if (options.maxConcurrentDownloads < 1) {
    throw new Error('maxConcurrentDownloads must be greater than 0');
  }
  if (!options.sourceFiles.length) {
    throw new Error(
      'sourceFiles must contain at least one file to download and zip',
    );
  }
  if (!options.destinationBucket) {
    throw new Error('destinationBucket must be provided');
  }
  if (!options.destinationKey) {
    throw new Error('destinationKey must be provided');
  }
  if (!options.s3Client) {
    throw new Error('s3Client must be provided');
  }
  if (!options.onComplete) {
    throw new Error('onComplete must be provided');
  }
  if (options.onError && typeof options.onError !== 'function') {
    throw new Error('onError must be a function');
  }
  if (
    options.onHttpUploadProgress &&
    typeof options.onHttpUploadProgress !== 'function'
  ) {
    throw new Error('onProgress must be a function');
  }
  if (options.onFileMissing && typeof options.onFileMissing !== 'function') {
    throw new Error('onFileMissing must be a function');
  }
  if (
    options.onFileDownloaded &&
    typeof options.onFileDownloaded !== 'function'
  ) {
    throw new Error('onFileDownloaded must be a function');
  }
};
