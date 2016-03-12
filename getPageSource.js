function scanDOM()
{
	var imgSrcs = [];
	var imgs = document.getElementsByTagName("img");
	for (var i = 0; i < imgs.length; i++)
	{
		var image = new Image(imgs[i].src, "img"+i)
		//var image = {url:imgs[i].src, name:"img"+i,tags:""}
		//var image.url = imgs[i].src;
		imgSrcs.push(image);
	}
	return img Srcs;
}

