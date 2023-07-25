import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const bucketName = process.env.S3_BUCKET_NAME;

export default async function handler(req, res) {

  const file = req.query + '';

  const client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }
  });

  const params = {
    Bucket: bucketName,
    Key: file,
  };
  const command = new DeleteObjectCommand(params);
  
  try {
    const res = await client.send(command);
    res.json(res);
  } catch(err) {
    res.json(err);
  }
  
}

export const config = {
  api: {bodyParser: false},
}