//This code is loaded for every website and checks for any images
var images = document.getElementsByTagName('img');
if (images.length <= 0) {
  return;
}
var imageArray = [];
for (var i = 0; i < images.length; i++) {
    console.log(images[i].src);
}
