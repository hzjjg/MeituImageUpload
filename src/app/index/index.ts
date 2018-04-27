import $ from 'jquery';
import { upload, UploadOptions } from '../../../assets/upload.es';
import { UploadType } from "../utils/const";

export class IndexPage {
    private $uploader: JQuery;
    private uploader: upload;
    private uploadOptions: UploadOptions;
    private parentProtocol:boolean = true;
    private currentCopyUrl:string = '';
    
    private _uploading: boolean = false;
    private _imageCount: number = 0;
    private _uploadedImageCount: number = 0;

    constructor() {
        this.uploadOptions = {
            timeout: 1000,
            type: UploadType.MEITU
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
        if(!v){
            $('.uploading').hide();
        }else{
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
                this.doUpload(files).then(() => {
                    console.log('success');
                }).catch((e) => {
                    console.log(e);
                })
            }
        })
        document.addEventListener('copy',(e)=>{
            try{
                (<any>e).clipboardData.setData('text/plain', this.currentCopyUrl);
                e.preventDefault(); // default behaviour is to copy any selected text
            }catch(e){
                console.log(e);
                
            }
        })
    }

    private async doUpload(files: File[]) {
        this.clearImage();
        this.uploading = true;
        this.imageCount = files.length;
        for (const file of files) {
            try {
                let imageItem = await this.uploadImg(file);
                this.renderImage(imageItem);
                this.uploadedImageCount += 1;
            } catch (e) {
                console.log(e);
            }
        }
        this.uploading = false;
    }

    private uploadImg(file: File): Promise<ImageItem> {
        return new Promise((resolve, reject) => {
            this.uploader.up(file, (data) => {
                resolve({
                    originFileName: file.name,
                    url: data.img,
                    size:file.size
                });
            }, (error) => {
                reject(error);
            }, () => {
                //start
            }, (process) => {
                // console.log(process);
            })
        })
    }

    private clearImage(){
        this.uploadedImageCount = 0;
        this.imageCount = 0;
        $('.images').html('');
    }

    private renderImage(imageItem: ImageItem) {
        let image = new Image();
        let fragment = document.createDocumentFragment();
        let $imgItem = $(document.createElement('div'));
        let parsedUrl:string;
        
        if(this.parentProtocol){
            let index = imageItem.url.indexOf('://');
            parsedUrl = imageItem.url.substr(index+1);
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
        $imgItem.find('.js-copy').click((e)=>{
            this.currentCopyUrl = $imgItem.find('.imageItem_url').html()
            document.execCommand('copy');
        })

        //加载图片
        image.src = imageItem.url;
        image.onload = () => {
            let $img = $imgItem.find('.imageItem_img');
            let width = image.width;
            let height = image.height;
            if(height<200 && width<200){
                $img.addClass('imageItem_img-origin');                
            }else if(height > width){
                $img.addClass('imageItem_img-long');
            }
            $img.removeClass('imageItem_img-loading');
            $imgItem.find('.imageItem_width').html(`width:${width}px`);
            $imgItem.find('.imageItem_height').html(`height:${height}px`);
            console.log(image.width);
            $img.append(image);
            
        }
    }

    init() {
        this.bindEvent();
    }
}

interface ImageItem {
    originFileName: string;
    url: string;
    size?: number;
}