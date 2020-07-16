import Axios from 'axios';
import linkifyHtml from 'linkifyjs/html';
import dateFormat from 'dateformat';


export function consume(data){
    return Axios.get(`https://nominatim.openstreetmap.org/search?q=${data}&format=geocodejson`);
}

export function format(data){
    if(data.data.features.length == 0)
        return {};
    return {
        address: data.data.features[0].properties.geocoding.label,
        lat: data.data.features[0].geometry.coordinates[1],
        long:data.data.features[0].geometry.coordinates[0]
    }
}

export function createElements(data){
    console.log(data);
    if(data.address)
        return `
            <div class="item">
                <h3>${data.address}</h3>
                <div class="media-content">
                    <iframe width="425" height="350" frameborder="0" scrolling="" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=${data.long-0.5}%2C${data.lat-0.5}%2C${data.long+0.5}%2C${data.lat+0.5}&amp;layer=mapnik&amp;marker=${data.lat}%2C${data.long}" style="border: 1px solid black"></iframe><br/><small><a href="https://www.openstreetmap.org/?mlat=${data.lat}&amp;mlon=${data.long}#map=9/${data.lat}/${data.long}">See on OpenStreetMap</a></small>
                </div>
            </div>
        `;
    else 
        return '';
}