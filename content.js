_ini();

function _ini(){

    //document.getElementsByTagName("html")[0].style.display="none";

    window.onload=function(){

        //This code is loaded for every website and checks for any images
        var images = document.getElementsByTagName('img');
        var i =0;
        var postImages = [];
        var tagsArray = [];
        var isRead = [];
        for (var j = 0; j < images.length; j++){
          isRead[j] = false;
        }
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
        checkImages();


        document.getElementsByTagName("html")[0].style.display="block"; //to show it all back again

        function checkImages() {
          for (var j = 0; j < images.length; j++){
          if (isScrolledIntoView(images[j]) === true && isRead[j] === false) {
            console.log("found image: " + j);
            isRead[j] = true;
            tagsArray[j] = run(images[j].src);
            postImages.push({name: j, tags: tagsArray[j], image: images[j].src});
            }
          }
          console.log(postImages);
          hideImage(postImages);
        }
    }

}



//hides the function
function hideImage(postImages)
{
    chrome.runtime.sendMessage({method: "getStorage"}, function(response) {
    var filter = JSON.parse(response.status);
    hideImageHelper(filter, postImages);
    });
}
function hideImageHelper(filter, postImages)
{
    var isBlocked
    var img = document.getElementsByTagName("img");
    //loop through each image
    for (var i = 0; i < img.length; i++)
    {
      //loop through the first 5 tags of every image
      isBlocked = false;
      var length;
      if(postImages.tags == 'undefined' || postImages[i].tags.length < 5)
      {
          length = postImages[i].tags.length;
      }
      else
      {
        length = 5;
      }
      for(var j = 0; j < length; j++)
      {
        var tagArray = postImages[i].tags[j];
        //tagArray = finalImage.tags;
        for(var k = 0; k < filter.length; k++)
        {
          if (tagArray === filter[k].name)
          {
            img[i].style.opacity = "0.0";
            //isBlocked = true;
            //break;
          }
        }
        /*if(isBlocked)
        {
          break;
        }*/
      }
      /*if(!isBlocked)
      {
        //delete the image
        img[i].style.opacity = "";
      }*/
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
  return tags;
}

function isScrolledIntoView(elem)
{
  var $elem = $(elem);
  var $window = $(window);
  var docViewTop = $window.scrollTop();
  var docViewBottom = docViewTop + 2*$window.height();
  console.log($window.height());
  var elemTop = $elem.offset().top;
  var elemBottom = elemTop + $elem.height();
  return (elemTop <= docViewBottom);
}
