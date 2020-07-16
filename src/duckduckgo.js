import Axios from 'axios';

export function getInformation(string){
    string.replace(' ', '+');
    return Axios.get(`https://api.duckduckgo.com/?q=${string}&format=json&pretty=1`)
        .then(res => {
            let f = formatInformation(res);
            if(f)
                return createElements(f);
            else
                return '';
        });
}

function formatInformation(item){
    if(!item.data.AbstractText)
        return false;
    let obj = {
        source: item.data.AbstractSource,
        image: item.data.Image,
        text: item.data.AbstractText,
        title: item.data.Heading,
        url: item.data.AbstractURL
    }
    return obj;
}

function createElements(data){
    let image = formatImg(data.image);
    return `
        <div class="item">
            <h3>${data.title}</h3>
            <div class="row">
                <div class="col-md-${image ? '8' : '12'}">
                    <p class="text-justify text-wrap">${data.text}</p>
                </div>
                ${image ? image : ''}
            </div>
            <p><a href="${data.url}">${data.source}</a></p>
        </div>
    `;
}

function formatImg(image){
    if(image)
        return `<div class="col-md-4">
            <img class="what-image" src="${image}">
            </div>`;
    else
        return false; 
}