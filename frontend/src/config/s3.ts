export const S3_CONFIG = {
  BASE_URL: 'https://hai-project-images.s3.us-east-1.amazonaws.com/',
  BUCKET_NAME: 'hai-project-images',
  REGION: 'us-east-1'
};

export const getS3Url = (filename?: string): string | null => {
  if (!filename) return null;
  return S3_CONFIG.BASE_URL + filename;
};
