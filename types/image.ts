export type ImageUploadSignature = {
  uploadUrl: string;
  apiKey: string;
  signature: string;
  params: {
    timestamp: number;
    public_id: string;
    type: string;
    overwrite: boolean;
    allowed_formats: string;
    transformation: string;
    eval: string;
  };
};

export type UploadedImage = {
  id: string;
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};
