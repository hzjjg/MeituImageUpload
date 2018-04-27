export declare class upload {
    constructor(options?: UploadOptions)

    /**
     * @description protocol
     * @param url url
     */
    private protocol(url: string): string

    /**
     * @description 上传
     * @param target 要上传的文件，可为File/Blob/base64的类型
     * @param success 上传成功回调
     * @param error 上传失败回调
     * @param start 获取token后开始上传时的钩子
     * @param progress 获取上传进度的钩子
     */
    up(target: File,
        success?: (data: { img: string; type: string; uploadTime: number; canvasTime: number; }) => void,
        error?: (error: { msg: string; xhr: XMLHttpRequest }) => void,
        start?: () => void,
        progress?: (progress: number) => void
    ): void

    /**
     * @description 上传
     * @param target 要上传的文件，可为File/Blob/base64的类型
     * @param callback 回调函数集合
     */
    up(target: File, callback: {
        /**
         * 上传成功回调
         */
        success?: (data: {
            img: string;
            type: string;
            uploadTime: number;
            canvasTime: number;
        }) => void,
        /**
         * 上传失败回调
         */
        error?: (error: {
            msg: string;
            xhr: XMLHttpRequest;
        }) => void,
        /**
         * 获取token后开始上传时的钩子
         */
        start?: () => void,
        /**
         * 获取上传进度的钩子
         */
        progress?: (progress: number) => void
    }, ): void

    private fileToBase64(file: any, ops: UploadOptions): void

    private _get_token(): any

    private _handle_b64(b64: any, cb: any): any

    private _to_64(file: File, cb: any): any

    private _up_file(file: File): any

    private _up_b64_qiniu_meitu(b64: any): any

    private _up_cb(xhr: XMLHttpRequest, reposne: any, st: any): any

}

/**
 * 上传配置选项
 */
export declare interface UploadOptions{
    /**
     * 可以传入：Number: 0/1/2/3 (分别对应阿里云，七牛，亚马逊S3、美图云)
     * 或者  String: 'oss/qiniu/s3/meitu'
     *  Defaut: 1
     */
    type?: UploadType,

    /**
     * 图片进行压缩后的宽度，图片地址的thumb参数的逻辑由业务方自行控制添加
     * Defaut: 600
     */
    width?: number,

    /**
     * 图片压缩质量 (0-100)
     * Defaut:90 
     */
    quality?: number,

    /**
     * 所有请求的超时时间 ms
     * Defaut: 20000
     */
    timeout?: number,

    /**
     * Defaut:true
     * 会在new实例的时候去预先获取token，合理的时间点创建实例可以优化初次上传的时间
     * 当创建实例后马上使用up上传时，将该参数设置为false，会避免获取两次token导致的token浪费  
     */
    preToken?:boolean,

    /**
     * 所有 `api` 接口可由此参数进行配置覆盖；
     */
    api?:{
        token: {
            qiniu: string,
            s3: string,
            oss: string,
        },
        domain: {
            oss: string,
            qiniu: string,
        },
        imgDomain: {
            qiniu: string,
        },
    }
}

/**
 * 上传图片平台类型
 */
declare enum UploadType {
    ALIYUN = 0,
    QINIU = 1,
    AMAZON = 2,
    MEITU = 3
}
