//This code is loaded for every website and checks for any images
var images = document.getElementsByTagName('img');
var i =0;
var update = false;
var isRead = [];
for (var j = 0; j < images.length; j++){
  isRead[j] = false;
}
var postImages = [];
var tagsArray = [];
var special = jQuery.event.special,
        uid1 = 'D' + (+new Date()),
        uid2 = 'D' + (+new Date() + 1);
    special.scrollstart = {
        setup: function() {
            var timer,
                handler =  function(evt) {
                    var _self = this,
                        _args = arguments;
                    if (timer) {
                        clearTimeout(timer);
                    } else {
                        evt.type = 'scrollstart';
                        console.log("start");

                    }
                    timer = setTimeout( function(){
                        timer = null;
                    }, special.scrollstop.latency);
                };
            jQuery(this).bind('scroll', handler).data(uid1, handler);
        },
        teardown: function(){
            jQuery(this).unbind( 'scroll', jQuery(this).data(uid1) );
        }
    };
    special.scrollstop = {
        latency: 300,
        setup: function() {
            var timer,
                    handler = function(evt) {
                    var _self = this,
                        _args = arguments;
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout( function(){
                        timer = null;
                        evt.type = 'scrollstop';
                        console.log("stop");
                        checkImages();
                    }, special.scrollstop.latency);
                };
            jQuery(this).bind('scroll', handler).data(uid2, handler);
        },
        teardown: function() {
            jQuery(this).unbind( 'scroll', jQuery(this).data(uid2) );
        }
    };

jQuery(window).bind('scrollstart', function(){});

jQuery(window).bind('scrollstop', function(e){});


//console.log(postImages);

function hideImage(postImages)
{
    chrome.runtime.sendMessage({method: "getStorage"}, function(response) {
    console.log(response.status);
    var filter = JSON.parse(response.status)
    //return filter//console.log(JSON.parse(filter)[0].name);
    //console.log(JSON.parse(filter).Object.name);
    //console.log(JSON.parse(filter).Object);
    hideImageHelper(filter, postImages);
    });
}
function hideImageHelper(filter, postImages)
{
    //console.log(filter[1].name);
    //var filter = JSON.parse(localStorage["filterArray"]);
    //console.log(localStorage["filterArray"]);
    var img = document.getElementsByTagName("img");
    //loop through each image
    for (var i = 0; i < img.length; i++) {
      //loop through the first 5 tags of every image
      /*if(postImages.tagsArray.length < 5)
      {
        for(var j = 0; j < postImages.tagsArray.length; j++)
        {
          var tagArray = postImages[i].tagsArray[j];
           for(var k = 0; k < filter.length; k++)
           {
              if (tagArray === fliter[k])
              {
                 //delete the image
                 img[i].style.opacity = "0.0";
              }
           }
        }
      }
      else{*/
        //console.log(postImages.peek());
        //var finalImage = postImages.pop();
        //console.log(finalImage);
        for(var j = 0; j < 5; j++)
        {
          var tagArray = postImages[i].tags[j];
          //tagArray = finalImage.tags;
          console.log(tagArray);
          for(var k = 0; k < filter.length; k++)
          {
           if (tagArray === filter[k].name)
           {
              //delete the image
              img[i].style.opacity = "0.0";
            }
          }
        }
      //}
    }
}

function getCredentials(cb) {
  var data = {
    'grant_type': 'client_credentials',
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET
  };

  return $.ajax({
    'url': 'https://api.clarifai.com/v1/token',
    'data': data,
    'type': 'POST'

  })
  .then(function(r) {
    localStorage.setItem('accessToken', r.access_token);
    localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
    cb();
  });
}

function postImage(imgurl) {
  var data = {
    'url': imgurl
  };
  var accessToken = localStorage.getItem('accessToken');
  var tags = [];
  $.ajax({
    'url': 'https://api.clarifai.com/v1/tag',
    'headers': {
      'Authorization': 'Bearer ' + accessToken
    },
    'data': data,
    'type': 'POST',
    'async': false

  }).then(function(r){
    tags = parseResponse(r);
  });
      return tags;
}

function parseResponse(resp) {
  var tags = [];
  if (resp.status_code === 'OK') {
    var results = resp.results;
    tags = results[0].result.tag.classes;
  } else {
    console.log('Sorry, something is wrong.');
  }
  return tags;
}

function run(imgurl) {
  var tags = []
  if (localStorage.getItem('tokenTimeStamp') - Math.floor(Date.now() / 1000) > 86400
    || localStorage.getItem('accessToken') === null) {
    getCredentials(function() {
      tags = postImage(imgurl);
    });
  } else {
    tags = postImage(imgurl);
  }
  console.log(tags);
  return tags;
}

function isScrolledIntoView(elem)
{
  var $elem = $(elem);
  var $window = $(window);
  var docViewTop = $window.scrollTop();
  var docViewBottom = docViewTop + $window.height() + ($window.height()/2);
  console.log(($window.height() + $window.height()/2));
  var elemTop = $elem.offset().top;
  var elemBottom = elemTop + $elem.height();
  return (elemTop <= docViewBottom);
}
function checkImages() {
  for (var j = 0; j < images.length; j++){
  if (isScrolledIntoView(images[j]) === true && isRead[j] === false) {
    console.log("found image: " + j);
    isRead[j] = true;
    tagsArray[j] = run(images[j].src);
    postImages.push({name: j, tags: tagsArray[j], image: images[j].src});
    }
  }
  hideImage(postImages);
}

checkImages();
