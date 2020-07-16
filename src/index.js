import {
  consume as ytConsume,
  format as ytFormater,
  createElements as ytCreate
} from "./youtube_api";

import {
  consume as mapConsume,
  format as mapFormater,
  createElements as mapCreate
} from "./geocode_api";

import {
  consume as imgurConsume,
  format as imgurFormater,
  createElements as imgurCreate
} from "./imgur_api";
import {
  consume as redditConsume,
  format as postFormater,
  createElements as redditCreate
} from "./reddit_api";

import { getInformation } from "./duckduckgo";

import {
  consume as twitterConsume,
  format as tweetFormater,
  createElements as tweetCreate
} from "./twitter_api";
import Axios from "axios";

window.$ = window.jQuery = require("jquery");

let list = document.getElementById("content");
let slider = $('.spinner');
$("#down").on('click', scrollToContent);

$("#up").on('click', scrollToTop);

$('#search').keyup(function(e){
    if(e.keyCode == 13)
    {
      if($('#search').val() !== '')
        search($('#search').val());
    }
});

$(document).ready( function() {
    var topOfOthDiv = $("#content").offset().top;
    $(window).scroll(function() {
        if($(window).scrollTop() > topOfOthDiv) { 
            $("#up").fadeIn("fast");
        }
        else{
            $("#up").fadeOut("fast");
        }
    });
});

initialFetch();

function getYoutube(q) {
  return ytConsume("search", {
    q: q,
    maxResults: 1,
    type: "video",
    part: "snippet"
  }).then(res => {
    return ytFormater(res);
  });
}

function getReddit(q) {
  return redditConsume("search", { q: q }).then(res => {
    return postFormater(res);
  });
}

function getImgur(q) {
  return imgurConsume("gallery/search/viral", {
    q: q
  }).then(res => {
    res.data.data = res.data.data.slice(0, 10);
    return imgurFormater(res);
  });
}

function getTwitter(q) {
  return twitterConsume("search/tweets", {
    q: q,
    result_type: "mixed",
    tweet_mode: "extended"
  }).then(res => {
    return tweetFormater(res);
  });
}

function getDuckDuckGo(q){
    return getInformation(q);
}

function getMap(q){
    return mapConsume(q)
      .then(res => {
        return mapFormater(res);
      });
}

function getResults(q) {
    return Promise.all([
        getDuckDuckGo(q),
        getYoutube(q),
        getTwitter(q),
        getReddit(q),
        getImgur(q),
        getMap(q)
    ]);
}

function getRandomWords(){
    return Axios.get(
        "https://random-word-api.herokuapp.com/word?key=AS5GN5TQ&number=" +
          (Math.floor(Math.random() * 2) + 1)
      );
}

function initialFetch(){
    operateSlider(true);
    getRandomWords()
        .then(res => {
            let words = Object.values(res.data).join(" ");
            document.getElementById("search").value = words;
            return getResults(words);      
        }).catch(err => {
            let words = "IPVC";
            document.getElementById("search").value = words;
            return getResults(words);  
        })
        .then(([duck, yt, tw, rd, im, map]) => {

            list.innerHTML += duck;
            list.innerHTML += mapCreate(map);
            list.innerHTML += ytCreate(yt);
            list.innerHTML += tweetCreate(tw);
            list.innerHTML += redditCreate(rd);
            list.innerHTML += imgurCreate(im);
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            operateSlider(false);
            scrollToContent();
        });
}

function search(val){
    operateSlider(true);
    getResults(val)
      .then(([duck, yt, tw, rd, im, map]) => {
          list.innerHTML = '';
          list.innerHTML += duck;
          list.innerHTML += mapCreate(map);
          list.innerHTML += ytCreate(yt);
          list.innerHTML += tweetCreate(tw);
          list.innerHTML += redditCreate(rd);
          list.innerHTML += imgurCreate(im);
      })
      .catch(err => {
          console.log(err);
      })
      .finally(() => {
          operateSlider(false);
          scrollToContent();
      });
}



function operateSlider(display){
    if(display){
        slider.fadeIn("slow");
    }
    else{
        slider.fadeOut("fast");
    }
}

function scrollToContent(){
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#content").offset().top
    }, 1000);
}

function scrollToTop(){
    $([document.documentElement, document.body]).animate({
        scrollTop: $("body").offset().top
    }, 1000);
}