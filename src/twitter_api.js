import Axios from 'axios';
import * as cred from '../keys.json';
import linkifyHtml from 'linkifyjs/html';
import dateFormat from 'dateformat';

export function consume(service, params){
    return Axios.get('https://cors-anywhere.herokuapp.com/'+cred.twitter.baseURI + service + '.json', {
        params,
        headers: {
            Authorization: 'Bearer ' + cred.twitter.token
        }
    });    
}

export function format(object){
    let ret = [];
    for (const tweet of object.data.statuses) {
        if(!tweet.in_reply_to_status_id){
            let temp = {
                text: tweet.full_text.replace(/(?:\r\n|\r|\n)/g, '<br>'),
                date: tweet.created_at,
                uri: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
                name: tweet.user.name,
                user: tweet.user.screen_name,
                image: tweet.user.profile_image_url_https,
                score: tweet.favorite_count,
                retweet: tweet.retweet_count
            };
            ret.push(temp);
        }
    }

    return ret;
}

export function createElements(items){
    let elements = "";
    for (const item of items) {
        let temp = 
            `<div class="item">
                <div class="row">
                    <div class="col-md-1 social justify-content-center align-items-center">
                        <i class="fab fa-twitter-square"></i>
                    </div>
                    <div class="col-md-8 ajustify-content-center align-items-center">
                        <h5 class="center-align">From: <a href="${item.uri}">${item.uri}</a></h5> 
                    </div>
                    <div class="col-md-3 text-right">${dateFormat(item.date, 'd mmm yyyy')} <i class="far fa-calendar-alt"></i></div>             
                </div>
                <div class="row">
                    <div class="col-md-1 profile-image">
                        <img clas="img-thumbnail" src="${item.image}">
                    </div>
                    <div class="col-md-11">
                    <p class="align-self-center"><a href="https://twitter.com/${item.user}">${item.name}</a></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 media-content">
                        <p class="text-justify text-wrap">${linkifyHtml(item.text)}</p>
                    </div>
                </div>
                <div class="row justify-content-end">
                    <div class="col-md-2 text-right">${item.retweet} <i class="fas fa-retweet"></i></div>                        
                    <div class="col-md-2 text-right">${item.score} <i class="far fa-heart"></i></div>               
                </div>
            </div>`;
            elements += temp;
    }
    return elements;
}