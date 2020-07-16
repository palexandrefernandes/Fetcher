import Axios from 'axios';
import * as cred from '../keys.json';
import linkifyHtml from 'linkifyjs/html';
import dateFormat from 'dateformat';

export function consume(service, params){
    return Axios.get(cred.reddit.baseURI + service + '.json', {params});
}

export async function format(object){
    let ret = [];
    for (const post of object.data.data.children) {
        let temp = {
            title: post.data.title,
            text: post.data.selftext,
            author: post.data.author,
            url: post.data.url,
            subreddit: post.data.subreddit_name_prefixed,
            score: post.data.score,
            numComments: post.data.num_comments,
            image: await getUserImage(post.data.author),
            date: new Date(post.data.created_utc * 1000),
            type: post.data.post_hint
        };
        ret.push(temp);
    }
    return ret;
}

function getUserImage(username){
    return consume('/user/'+username+'/about', {})
        .then(res => {return res.data.data.icon_img});
}

export function createElements(items){
    let elements = "";
    for (const item of items) {
        let temp = 
            `<div class="item">
                <div class="row">
                    <div class="col-md-1 social justify-content-center align-items-center">
                        <i class="fab fa-reddit-square"></i>
                    </div>
                    <div class="col-md-11 ajustify-content-center align-items-center">
                        <h3><a href="${item.url}">${item.title}</a></h3> <p>${item.subreddit}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-1 profile-image">
                        <img clas="img-thumbnail" src="${item.image}">
                    </div>
                    <div class="col-md-8">
                    <p class="align-self-center"><a href="https://www.reddit.com/user/${item.author}">${item.author}</a></p>
                    </div>
                    <div class="col-md-3 text-right">${dateFormat(item.date, 'd mmm yyyy')} <i class="far fa-calendar-alt"></i></div>             

                </div>
                <div class="row">
                    <div class="col-md-12 media-content">
                        ${contentFormater(item)}
                    </div>
                </div>
                <div class="row justify-content-end">
                    <div class="col-md-2 text-right">${item.numComments} <i class="far fa-comments"></i></div>                        
                    <div class="col-md-2 text-right">${item.score} <i class="far fa-heart"></i></div>               
                </div>
            </div>`;
            elements += temp;
    }
    return elements;
}

function contentFormater(item){
    let ret = "";
    if(item.type == 'image'){
        ret = `<img src="${item.url}">`
    }else if(item.type == 'rich:video'){
        let temp = item.url.replace(/^(.*[\\\/])/g, '');
        temp = temp.replace(/^(.*[\=])/g, '');
        ret = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${temp}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
        ret = linkifyHtml(ret);
        ret = item.text.replace(/(?:\r\n|\r|\n)/g, '<br>');
        ret = ret.replace('&#x200B;', '<br>');
        ret = `<p class="text-justify text-wrap">${ret}</p>`;
    }
    return ret;
}