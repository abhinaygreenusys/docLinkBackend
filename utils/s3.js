const AWS = require("aws-sdk");

// const Credentials={
//         region: process.env.AWS_REGION,
//         accessKeyId: process.env.S3_ACCESS_KEY_ID,
//         secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//     }
// console.log(Credentials,)
// );

const getSignedUrl = async (key) => {
  const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 60 * 60,
  };
  const url = await s3.getSignedUrlPromise("getObject", params);
  console.log(url, "url");
  return url;
};

const uploadFile = async (file, fileName) => {
  const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${fileName}`,
    Body: file.buffer,
    mimetype: file.mimetype,
    ContentType: file.mimetype, //<-- this is what you need!
    ACL: "public-read",
    // ContentDisposition: 'inline', //<-- and this !
  };
  const data = await s3.upload(params).promise();
  return data;
};

const deleteFile = async (key) => {
  const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });
  console.log({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };
  const data = await s3.deleteObject(params).promise();
  console.log(data);
  return data;
};

const getFiles = async () => {
  const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
  };
  const data = await s3.listObjects(params).promise();
  return data;
};

module.exports = { getSignedUrl, uploadFile, deleteFile, getFiles };
