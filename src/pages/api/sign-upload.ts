import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: import.meta.env.MYAPP_S3_REGION,
  credentials: {
    accessKeyId: import.meta.env.MYAPP_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.MYAPP_AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST({ request }) {
  const { fileName, fileType, clientId } = await request.json();

  const key = `uploads/${clientId}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: import.meta.env.MYAPP_S3_BUCKET,
    Key: key,
    ContentType: fileType,
    ACL: 'public-read', // Optional if you're serving directly from the bucket
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  return new Response(JSON.stringify({
    url: signedUrl,
    fileUrl: `https://${import.meta.env.MYAPP_S3_BUCKET}.s3.${import.meta.env.MYAPP_S3_REGION}.amazonaws.com/${key}`,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
