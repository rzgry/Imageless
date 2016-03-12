var Image = function (url, name) {
  this.url = url;
  this.name = name;
};

Image.prototype.setTags = function(tags){
  this.tags = tags;
}

var image = new Image('sam.com', 'sam');
image.setTags(['samm', 'yo', 'im']);
console.log(image.tags);
