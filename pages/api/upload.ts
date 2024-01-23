import multiparty, {Fields, Files} from 'multiparty';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import { NextApiRequest, NextApiResponse } from 'next';
import Error from 'next/error';

const bucketName = process.env.S3_BUCKET_NAME;


export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  const form = new multiparty.Form();

  const {fields, files}: {fields: Fields, files: Files} = await new Promise((resolve, reject) => {
    form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
      if (err) reject(err);
      resolve({fields, files});
    })
  });

  const client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }
  });

  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop();
    const newFilename = Date.now() + '.' + ext;
    await client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: newFilename,
      Body: fs.readFileSync(file.path),
      ContentType: mime.lookup(file.path)
    }));
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`
    links.push(link);
  }
  
  res.json({links});
}

export const config = {
  api: {bodyParser: false},
}