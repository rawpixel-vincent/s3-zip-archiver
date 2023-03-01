import { zipper } from './zipper.mjs';
import { waitUntilValueMatch, validateZipperOptions } from './utils.mjs';

const utils = { waitUntilValueMatch, validateZipperOptions };

const s3ZipArchiver = {
  zipper,
  utils,
};

export default s3ZipArchiver;

export { zipper, utils };
