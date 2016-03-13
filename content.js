//This code is loaded for every website and checks for any images
var images = document.getElementsByTagName('img');
var i =0;
var postImages = [];
var tagsArray = [];
for (i; i < images.length; i++){
  tagsArray[i] = run(images[i].src);
  //console.log(tagsArray[i]);
  postImages.push({name: i, tags: tagsArray[i], image: images[i].src});
}
hideImage(postImages);
//console.log(postImages);

function hideImage(postImages)
{
    //var filter = JSON.parse(localStorage["filterArray"]);
    console.log(localStorage["filterArray"])
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
        for(var j = 0; j < 5; j++)
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
  console.log('before');
  $.ajax({
    'url': 'https://api.clarifai.com/v1/tag',
    'headers': {
      'Authorization': 'Bearer ' + accessToken
    },
    'data': data,
    'type': 'POST',
    async: false

  }).then(function(r){
    tags = parseResponse(r);
    return tags;
  });
  console.log("after");
  console.log(tags);

}

function parseResponse(resp) {
  var tags = [];
  if (resp.status_code === 'OK') {
    var results = resp.results;
    tags = results[0].result.tag.classes;
  } else {
    console.log('Sorry, something is wrong.');
  }
  console.log(tags);
  return tags;
}

function run(imgurl) {
  var tags = []
  if (localStorage.getItem('tokenTimeStamp') - Math.floor(Date.now() / 1000) > 86400
    || localStorage.getItem('accessToken') === null) {
    getCredentials(function() {
      tags = postImage(imgurl);
      console.log(tags);
    });
  } else {
    tags = postImage(imgurl);
    console.log(tags);
  }
  console.log(tags);
  return tags;
}
