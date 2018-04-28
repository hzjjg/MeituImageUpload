import $ from 'jquery';
import { upload, UploadOptions } from '../../../assets/upload.es';
import { UploadType } from "../utils/const";

export class IndexPage {
    private $uploader: JQuery;
    private uploader: upload;
    private uploadOptions: UploadOptions;
    private parentProtocol: boolean = true;
    private currentCopyUrl: string = '';
    private isAutoImageSize: boolean = true;

    private _uploading: boolean = false;
    private _imageCount: number = 0;
    private _uploadedImageCount: number = 0;

    constructor() {
        this.uploadOptions = {
            timeout: 10000,
            type: UploadType.MEITU,
            quality: 100,
        }
        this.$uploader = $('#upload');
        this.uploadOptions = {
            type: UploadType.MEITU,
        }
        this.uploader = new upload(this.uploadOptions);
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
        this.$uploader.change((e) => {
            let files = (<any>e.target).files;
            if (files) {
                this.uploadAll(files).then(() => {
                    // console.log('success');
                }).catch((e) => {
                    console.log(e);
                })
            }
        })
        document.addEventListener('copy', (e) => {
            try {
                (<any>e).clipboardData.setData('text/plain', this.currentCopyUrl);
                e.preventDefault(); // default behaviour is to copy any selected text
            } catch (e) {
                console.log(e);

            }
        })
    }

    private async uploadAll(files: File[]) {
        this.clearImage();
        this.uploading = true;
        this.imageCount = files.length;
        for (const file of files) {
            try {
                let imageItem = await this.doUpload(file);
                this.renderImage(imageItem);
                this.uploadedImageCount += 1;
            } catch (e) {
                console.log(e);
            }
        }
        this.uploading = false;
    }

    private async doUpload(file: File) {
        let imageItem: ImageInfo = {};
        let originImageItem: ImageInfo;
        let currentImageItem: ImageInfo;
        let options:UploadOptions = {};

        originImageItem = await this.readImageFile(file);
        if(this.isAutoImageSize){
            options = Object.assign({},this.uploadOptions,{
                width:originImageItem.originWidth,
            })
        }
        currentImageItem = await this.uploadImage(file,options);
        imageItem = Object.assign(imageItem, originImageItem, currentImageItem);
        return imageItem;
    }

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

    private clearImage() {
        this.uploadedImageCount = 0;
        this.imageCount = 0;
        $('.images').html('');
    }

    private renderImage(imageItem: ImageInfo) {
        let image = new Image();
        let fragment = document.createDocumentFragment();
        let $imgItem = $(document.createElement('div'));
        let parsedUrl: string;

        if (this.parentProtocol) {
            let index = imageItem.url.indexOf('://');
            parsedUrl = imageItem.url.substr(index + 1);
        }
        let template = `
            <div class="imageItem_img imageItem_img-loading"></div>
            <div class="imageItem_info">
                <div class="imageItem_filename" title="${imageItem.originFileName}">${imageItem.originFileName}</div>
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
        image.src = imageItem.url;
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
            $img.append(image);

        }
    }

    init() {
        this.bindEvent();
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