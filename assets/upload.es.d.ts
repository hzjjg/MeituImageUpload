declare class upload {
    constructor(options: UploadOptions)

    /**
     * @description protocol
     * @param url url
     */
    protocol(url: string): string

    /**
     * @description 上传
     * @param target target
     */
    up(target: any): any

    fileToBase64(file: any, ops: UploadOptions): void

    _get_token(): any

    _handle_b64(b64: any, cb: any): any

    _to_64(file: File, cb: any): any

    _up_file(file: File): any

    _up_b64_qiniu_meitu(b64: any): any

    _up_cb(xhr: XMLHttpRequest, reposne: any, st: any): any

}

export default upload;

/**
 * 上传配置选项
 */
declare interface UploadOptions {
    type?: UploadType;
    width?: number;
    quality?: number;
    timeout?: number;
    preToken?: boolean;
    tokenParams?: any;
    api?: any;
    rotate?: number;
    success?(b64: any): any | void;
}

declare enum UploadType {
    QINIU = 0,
    MEITU = 1
}