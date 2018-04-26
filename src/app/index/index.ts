import $ from 'jquery';
import upload from '../../../assets/upload.es';
import { UploadType } from "../utils/const";

export class IndexPage {
    private $uploader: JQuery;
    private Upload: upload;
    private uploading: boolean = false;
    public uploadOptions: UploadOptions;

    constructor() {
        this.$uploader = $('#upload');
        this.uploadOptions = {
            type: UploadType.MEITU,
        }
        this.Upload = new upload(this.uploadOptions);
    }

    private bindEvent() {
        this.$uploader.change((e) => {
            console.log((<any>e.target).files);
        })
    }

    private renderImages(images: string[]) {
        let imagesFragment = document.createDocumentFragment();
        images.forEach((item: any) => {
            let imgItemTemplate = `
                <img src="${item.url}"/>
                <div>
                    <span>${item.originUrl}</span>
                </div>
                <div>
                    <span>${item.url}</span>
                    <a href="javascript:;">copy</a>
                </div>
            `
            let $imgItem = $(document.createElement('div'));
            $imgItem.html(imgItemTemplate);
            imagesFragment.appendChild($imgItem[0]);
        });
        $('.result').html('');
        $('.result')[0].appendChild(imagesFragment);
    }

    private upload() {

    }

    init() {
        this.bindEvent();
    }
}

interface UploadOptions {
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
