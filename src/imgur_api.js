import Axios from 'axios';
import * as cred from '../keys.json';
import linkifyHtml from 'linkifyjs/html';
import dateFormat from 'dateformat';

export function consume(service, params){
    return Axios.get(cred.imgur.baseURI + service, {
        params,
        headers:{
            Accept: 'application/json',
            Authorization: 'Client-ID ' + cred.imgur.token
        }
    });
}

export async function format(object){
    let ret = [];
    for (const img of object.data.data) {
        let temp = {
            id: img.id,
            author: img.account_url,
            date: new Date(img.datetime * 1000),
            title: img.title,
            score: img.score,
            num_comments: img.comment_count,
            images: await formatImages(img.images),
            views: img.views,
            url: img.link
        }
        ret.push(temp);
    }
    return ret;
}

async function formatImages(images){
    let ret = [];
    if(images){
        for (const img of images) {
            let link = await getLocalImage(img.link);
            let temp = {
                height: img.height,
                width: img.width,
                url: 'http://127.0.0.1/SIR/' + link,
                description: img.description,
                type: img.type
            }
            ret.push(temp);
        }
    }
    return ret;
}

function getLocalImage(image){
    return Axios.get('http://127.0.0.1/SIR/imgur.php?image=' + image)
        .then(res => res.data.image)
        .catch(err => console.log(err));
}

export function createElements(items){
    let elements = "";
    for (const item of items) {
        let temp = 
            `<div class="item">
                <div class="row">
                    <div class="col-md-2 justify-content-center align-items-center">
                            <h3>imgur</h3>
                    </div>
                    <div class="col-md-10 ajustify-content-center align-items-center">
                        <h3><a href="${item.url}">${item.title}</a></h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-1 profile-image">
                        <p>by:</p>
                    </div>
                    <div class="col-md-8">
                    <p class="align-self-center"><a href="https://imgur.com/user/${item.author}">${item.author}</a></p>
                    </div>
                    <div class="col-md-3 text-right">${dateFormat(item.date, 'd mmm yyyy')} <i class="far fa-calendar-alt"></i></div>             
                </div>
                <div class="row">
                    <div class="col-md-12 media-content">
                        ${createImages(item.images)}
                    </div>
                </div>
                <div class="row justify-content-end">
                    <div class="col-md-2 text-right">${item.num_comments} <i class="far fa-comments"></i></div>                        
                    <div class="col-md-2 text-right">${item.views}<i class="far fa-eye"></i></div>   
                    <div class="col-md-2 text-right">${item.score} <i class="far fa-heart"></i></div>
                </div>
            </div>`;
            elements += temp;
    }
    return elements;
}


function createImages(images){
    let ret = "";
    for (const img of images) {
        if(img.type.includes('video'))
            ret += `<video width="400" controls>
                <source src="${img.url}" type="${img.type}">
                Your browser does not support HTML5 video.
            </video>
            `;
        else
            ret += `<img class="" src="${img.url}">`;
        if(img.description)
            ret+= `<p class="text-justify text-wrap">${linkifyHtml(img.description)}</p>`;
    }
    return ret;
}