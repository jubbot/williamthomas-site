import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: import.meta.env.S3_REGION,
  credentials: {
    accessKeyId: import.meta.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST({ request }) {
  const { fileName, fileType, clientId } = await request.json();

  const key = `uploads/${clientId}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: import.meta.env.S3_BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return new Response(JSON.stringify({
    url,
    fileUrl: `https://${import.meta.env.S3_BUCKET}.s3.${import.meta.env.S3_REGION}.amazonaws.com/${key}`,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}