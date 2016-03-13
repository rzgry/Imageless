_ini();

function _ini(){

    document.getElementsByTagName("html")[0].style.display="none";

    window.onload=function(){

        //This code is loaded for every website and checks for any images
        var images = document.getElementsByTagName('img');
        var i =0;
        var postImages = [];
        var tagsArray = [];
        for (i; i < images.length; i++){
        //images[i].style.opacity = "0.0";
        tagsArray[i] = run(images[i].src);
        postImages.push({name: i, tags: tagsArray[i], image: images[i].src});
        }
        console.log(postImages);
        hideImage(postImages);
        
        document.getElementsByTagName("html")[0].style.display="block"; //to show it all back again
    }

}



//hides the function 
function hideImage(postImages)
{
    chrome.runtime.sendMessage({method: "getStorage"}, function(response) {   
    var filter = JSON.parse(response.status)
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
