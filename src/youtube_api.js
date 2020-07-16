import Axios from 'axios';
import * as cred from '../keys.json';
import dateFormat from 'dateformat';

export function consume(service, params){
    if(params)
        Object.assign(params, {key: cred.youtube.token});
    else
        return;
    return Axios.get(cred.youtube.baseURI + service, {
        params,
        headers:{
            Accept: 'application/json'
        }
    });
}

export async function format(object){
    let ret = [];
    for (const video of object.data.items) {
        let temp = {
            videoID: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            author: video.snippet.channelTitle,
            date: video.snippet.publishedAt,
            userID: video.snippet.channelId
        }
        Object.assign(temp, await getVideoInfo(temp.videoID));
        ret.push(temp);
    }
    return ret;
}

function getVideoInfo(videoID){
    return consume('videos', {id: videoID, part: 'id, statistics'})
        .then(res => { return {
                score: res.data.items[0].statistics.likeCount - res.data.items[0].statistics.dislikeCount,
                numComments: res.data.items[0].statistics.commentCount,
                views: res.data.items[0].statistics.viewCount
                };
            });
}

export function createElements(items){
    let elements = [];
    for (const item of items) {
        let temp = 
            `<div class="item">
                <div class="row">
                    <div class="col-md-1 social">
                        <i class="fab fa-youtube"></i>
                    </div>
                    <div class="col-md-10">
                    <h3><a href="https://www.youtube.com/watch?v=${item.videoID}">${item.title}</a></h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-1">
                        <p>by:</p>
                    </div>
                    <div class="col-md-8">
                        <a href="https://www.youtube.com/channel/${item.userID}">
                            <p>${item.author}</p>
                        </a>
                    </div>
                    <div class="col-md-3 text-right">${dateFormat(item.date, 'd mmm yyyy')} <i class="far fa-calendar-alt"></i></div>             
                </div>
                <div class="row">
                    <div class="col-md-12 media-content">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${item.videoID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 media-content">
                        <p class="text-justify text-wrap">${item.description}</p>
                    </div>
                </div>
                <div class="row justify-content-end">
                    <div class="col-md-2 text-right">${item.numComments ? item.numComments : 0} <i class="far fa-comments"></i></div>               
                    <div class="col-md-2 text-right">${item.views}<i class="far fa-eye"></i></div>               
                    <div class="col-md-2 text-right">${item.score} <i class="far fa-heart"></i></div>               
                </div>
            </div>`;
            elements.push(temp);
    }
    return elements;
}