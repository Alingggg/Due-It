import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  NotFound,
  S3Client,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

let client: S3Client | undefined;

function s3() {
  if (!process.env.AWS_REGION) throw new Error("AWS_REGION is not set");
  return (client ??= new S3Client({ region: process.env.AWS_REGION }));
}

function bucket() {
  const name = process.env.AWS_BUCKET;
  if (!name) throw new Error("AWS_BUCKET is not set");
  return name;
}

export function createUploadPost(key: string, contentType: string) {
  return createPresignedPost(s3(), {
    Bucket: bucket(),
    Key: key,
    Conditions: [
      ["content-length-range", 1, MAX_FILE_SIZE],
      ["eq", "$Content-Type", contentType],
    ],
    Fields: { "Content-Type": contentType },
    Expires: 600,
  });
}

export async function headFile(key: string) {
  try {
    const head = await s3().send(new HeadObjectCommand({ Bucket: bucket(), Key: key }));
    return { size: head.ContentLength ?? 0, type: head.ContentType ?? null };
  } catch (err) {
    if (err instanceof NotFound) return null;
    throw err;
  }
}

export async function copyFile(from: string, to: string) {
  const source = [bucket(), ...from.split("/")].map(encodeURIComponent).join("/");
  await s3().send(new CopyObjectCommand({ Bucket: bucket(), Key: to, CopySource: source }));
}

export async function deleteFile(key: string) {
  await s3().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}

export async function deleteFiles(keys: string[]) {
  if (!keys.length) return;
  await s3().send(
    new DeleteObjectsCommand({
      Bucket: bucket(),
      Delete: { Objects: keys.map((Key) => ({ Key })), Quiet: true },
    }),
  );
}

export async function deletePrefix(prefix: string) {
  let ContinuationToken: string | undefined;
  do {
    const page = await s3().send(
      new ListObjectsV2Command({ Bucket: bucket(), Prefix: prefix, ContinuationToken }),
    );
    await deleteFiles((page.Contents ?? []).map((obj) => obj.Key!));
    ContinuationToken = page.NextContinuationToken;
  } while (ContinuationToken);
}

export function getDownloadUrl(key: string, filename: string) {
  return getSignedUrl(
    s3(),
    new GetObjectCommand({
      Bucket: bucket(),
      Key: key,
      ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    }),
    { expiresIn: 300 },
  );
}
