function Image () {
  this.tags ="";
};

Image.prototype.setTags = function(tags){
  this.tags = tags;
}
Image.prototype.setUrl = function(url){
  this.url = url;
}
Image.prototype.setName = function(name){
  this.name = name;
}

module.exports = exports = new Image();
