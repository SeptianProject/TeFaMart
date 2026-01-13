declare module "cloudinary" {
  export interface ConfigOptions {
    cloud_name?: string;
    api_key?: string;
    api_secret?: string;
    secure?: boolean;
  }

  export interface UploadApiResponse {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    access_mode: string;
    original_filename: string;
    [key: string]: any;
  }

  export interface UploadApiErrorResponse {
    message: string;
    name: string;
    http_code: number;
  }

  export const v2: {
    config(options: ConfigOptions): void;
    uploader: {
      upload(file: string, options?: any): Promise<UploadApiResponse>;
      destroy(publicId: string, options?: any): Promise<any>;
    };
    url(publicId: string, options?: any): string;
    [key: string]: any;
  };
}
