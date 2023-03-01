export default s3ZipArchiver;
declare namespace s3ZipArchiver {
    export { zipper };
    export { utils };
}
import { zipper } from "./zipper.mjs";
export namespace utils {
    export { waitUntilValueMatch };
    export { validateZipperOptions };
}
import { waitUntilValueMatch } from "./utils.mjs";
import { validateZipperOptions } from "./utils.mjs";
export { zipper };
