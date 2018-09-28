import $ from 'jquery';
import { upload, UploadOptions } from '../../../assets/upload.es';
import { UploadType } from "../utils/const";

export class IndexPage {
    private $uploader: JQuery;
    private uploadOptions: UploadOptions;
    private parentProtocol: boolean = true;
    private currentCopyUrl: string = '';
    private isAutoImageSize: boolean = true;

    private _uploading: boolean = false;
    private _imageCount: number = 0;
    private _uploadedImageCount: number = 0;
    private images: ImageInfo[] = [];

    constructor() {
        this.uploadOptions = {
            timeout: 10000,
            type: UploadType.MEITU,
            quality: 100,
        }
        this.$uploader = $('#upload');
    }

    public get uploading(): boolean {
        return this._uploading
    }

    public set uploading(v: boolean) {
        if (!v) {
            $('.uploading').hide();
        } else {
            $('.uploading').show();
        }
        this._uploading = v;
    }


    public get imageCount(): number {
        return this._imageCount
    }


    public set imageCount(v: number) {
        $('.result_total').html(<any>v);
        this._imageCount = v;
    }


    public get uploadedImageCount(): number {
        return this._uploadedImageCount
    }

    public set uploadedImageCount(v: number) {
        $('.result_completed').html(<any>v);
        this._uploadedImageCount = v;
    }

    private bindEvent() {
        //上传
        this.$uploader.change((e) => {
            let files = (<any>e.target).files;
            if (files) {
                this.uploadAndRender(files).then(() => {
                    this.setCache();
                }).catch((e) => {
                    console.log(e);
                })
            }
        })

        // 复制url
        document.addEventListener('copy', (e) => {
            try {
                (<any>e).clipboardData.setData('text/plain', this.currentCopyUrl);
                this.toast('复制成功');
                e.preventDefault();
            } catch (e) {
                console.log(e);

            }
        })

        $('.clear_all').click(() => {
            this.clearCache();
            this.clearImages();
        })

        $('.images').on('click', '.imageItem_close', (e) => {
            const $target = $(e.currentTarget);
            const index = $target.parents('.imageItem').index();
            this.removeImage(index);
        })
    }

    /**
     * 渲染所有图片
     */
    private renderImages() {
        $('.images').empty();
        (this.images || []).forEach(imageInfo => {
            this.renderImage(imageInfo)
        });
    }

    private toast(content: string) {
        const $toast = $(`<div class="toast">${content}<div>`);
        $('body').append($toast);
        setTimeout(() => {
            $toast.remove();
        }, 1000);
    }

    private setCache() {
        localStorage.setItem('cache', JSON.stringify(this.images))
    }

    private getCache() {
        const cache = JSON.parse(localStorage.getItem('cache'));
        this.images = cache || [];
        this.renderImages();
        this.uploadedImageCount = this.images.length;
        this.imageCount = this.images.length;
    }

    private clearCache() {
        localStorage.removeItem('cache');
    }

    /**
     * 上传多张图片并且渲染
     * @param files files
     */
    private async uploadAndRender(files: File[]) {
        // this.clearImage();
        this.uploading = true;
        this.imageCount += files.length;
        for (const file of files) {
            try {
                let imageItem = await this.doUpload(file);
                this.images.push(imageItem);
                this.renderImage(imageItem);
                this.uploadedImageCount += 1;
            } catch (error) {
                console.log(error);
            }
        }
        this.uploading = false;
    }

    /**
     * 上传单个文件 并且返回图片信息
     * @param file File
     */
    private async doUpload(file: File) {
        let imageItem: ImageInfo = {};
        let originImageItem: ImageInfo;
        let currentImageItem: ImageInfo;
        let options: UploadOptions = {};

        originImageItem = await this.readImageFile(file);
        if (this.isAutoImageSize) {
            options = Object.assign({}, this.uploadOptions, {
                width: originImageItem.originWidth,
            })
        }
        currentImageItem = await this.uploadImage(file, options);
        imageItem = Object.assign(imageItem, originImageItem, currentImageItem);
        return imageItem;
    }

    private removeImage(index: number) {
        this.images.splice(index, 1);
        this.renderImages();
        this.setCache();
    }

    /**
     * 上传
     * @param file file
     * @param options options
     */
    private uploadImage(file: File, options?: any): Promise<ImageInfo> {
        let uploader = new upload(Object.assign({}, this.uploadOptions, options))
        return new Promise((resolve, reject) => {
            uploader.up(file, (data) => {
                let imageItem: ImageInfo = {
                    url: data.img,
                }
                resolve(imageItem);
            }, (error) => {
                reject(error);
            }, () => {
                //start
            }, (process) => {
                // console.log(process);
            })
        })
    }

    /**
     * 读取图片信息
     * @param file file
     */
    private readImageFile(file: File): Promise<ImageInfo> {
        let reader = new FileReader();
        reader.readAsDataURL(file)
        return new Promise((reoslve, reject) => {
            reader.onload = (e: any) => {
                let data = e.target.result;
                let image = new Image();
                image.src = data;
                image.onload = () => {
                    reoslve({
                        originFileName: file.name,
                        originWidth: image.width,
                        originHeight: image.height,
                        originSize: file.size
                    })
                }
            }
        })
    }

    /**
     * 清空页面上的图片
     */
    private clearImages() {
        this.uploadedImageCount = 0;
        this.imageCount = 0;
        $('.images').html('');
    }

    /**
     * 渲染单张图片
     * @param imageInfo 图片信息
     */
    private renderImage(imageInfo: ImageInfo) {
        let image = new Image();
        let fragment = document.createDocumentFragment();
        let $imgItem = $(document.createElement('div'));
        let parsedUrl: string;

        if (this.parentProtocol) {
            let index = imageInfo.url.indexOf('://');
            parsedUrl = imageInfo.url.substr(index + 1);
        }
        let template = `
            <div class="imageItem_img imageItem_img-loading">
                <a class="imageItem_link" href="${imageInfo.url}" target="_blank"></a>
            </div>
            <a href="javascript:;" title="删除" class="imageItem_close">✕</a>
            <div class="imageItem_info">
                <div class="imageItem_filename" title="${imageInfo.originFileName}">${imageInfo.originFileName}</div>
                <div class="imageItem_data">
                    <span class="imageItem_width"></span>
                    <span class="imageItem_height"></span>
                </div>
            </div>
            <div class="imageItem_footer">
                <div class="imageItem_url" title="${parsedUrl}">${parsedUrl}</div>
                <a class="js-copy imageItem_copy" href="javascript:;">copy url</a>
            </div>
        `

        //插入dom
        $imgItem.html(template);
        $imgItem.addClass('imageItem');
        fragment.appendChild($imgItem[0]);
        $('.images')[0].appendChild(fragment);

        //绑定事件
        $imgItem.find('.js-copy').click((e) => {
            this.currentCopyUrl = $imgItem.find('.imageItem_url').html()
            document.execCommand('copy');
        })

        //加载图片
        image.src = imageInfo.url;
        image.onload = () => {
            let $img = $imgItem.find('.imageItem_img');
            let width = image.width;
            let height = image.height;
            if (height < 200 && width < 200) {
                $img.addClass('imageItem_img-origin');
            } else if (height > width) {
                $img.addClass('imageItem_img-long');
            }
            $img.removeClass('imageItem_img-loading');
            $imgItem.find('.imageItem_width').html(`width:${width}px`);
            $imgItem.find('.imageItem_height').html(`height:${height}px`);
            $img.find('.imageItem_link').append(image);

        }
    }

    init() {
        this.bindEvent();
        this.getCache();
    }
}

interface ImageInfo {
    originFileName?: string;
    url?: string;
    originSize?: number;
    width?: number;
    height?: number;
    originHeight?: number;
    originWidth?: number;

}