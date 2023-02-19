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
    onError?: (err: Error) => Promise<void>;
    onProgress?: (progress: import('@aws-sdk/lib-storage').Progress) => Promise<void>;
    onFileMissing?: (key: string) => Promise<void>;
    onComplete?: (result: {
        bucket: string;
        key: string;
        filesize: number;
    }) => Promise<void>;
    maxConcurrentDownloads?: number;
    minConcurrentDownloads?: number;
};
