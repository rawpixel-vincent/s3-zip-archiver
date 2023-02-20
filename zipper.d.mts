export function zipper(options: ZipperOptions): Promise<void>;
export type ZipperOptions = {
    s3Client: import('@aws-sdk/client-s3').S3Client;
    destinationBucket: string;
    destinationKey: string;
    sourceFiles: Array<{
        key: string;
        name: string;
        bucket: string;
    }>;
    onComplete: (result: {
        bucket: string;
        key: string;
        filesize: number;
    }) => Promise<void>;
    onError?: (err: Error) => Promise<void>;
    onHttpUploadProgress?: (progress: import('@aws-sdk/lib-storage').Progress) => Promise<void>;
    onFileMissing?: (key: string) => Promise<void>;
    onFileDownloaded: (key: string, completed: number) => Promise<void>;
    maxConcurrentDownloads?: number;
    minConcurrentDownloads?: number;
    streamArchiverOptions?: [format: archiver.Format, options?: archiver.ArchiverOptions][1];
};
import archiver from "archiver";
