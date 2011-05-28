var win = Titanium.UI.currentWindow;

var imageView = Titanium.UI.createImageView({
	height:368,
	width:320,
	backgroundColor:'#999'
});

var arrow = Titanium.UI.createImageView({
  top: 0,
  left: 210,
  url:'arrow.png',
  height: 100,
  width: 100
});

var label = Titanium.UI.createLabel({
	color:'#999',
	text:'Please upload the seats image.',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto',
	top:-140
});

var sample1_label = Titanium.UI.createLabel({
	color:'#999',
	text:'Sample 1',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	width:130,
	top:-70,
	left:45
});

var sample2_label = Titanium.UI.createLabel({
	color:'#999',
	text:'Sample 2',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	width:130,
	top: -70,
	left:190
});

var sample1 = Titanium.UI.createImageView({
  top: 165,
  left: 20,
  url:'seats.png',
  height: 180,
  width: 135
});

sample1.addEventListener('click', function(){
  imageView.url = "seats.png";
  win.add(imageView);
});

var sample2 = Titanium.UI.createImageView({
  top: 165,
  right: 20,
  url:'seats.jpg',
  height: 180,
  width: 135
});

sample2.addEventListener('click', function(){
  imageView.url = "seats.jpg";
  win.add(imageView);
});

win.add(sample1_label);
win.add(sample2_label);
win.add(sample1);
win.add(sample2);

win.add(arrow);
win.add(label);


var popoverView;
var arrowDirection;

if (Titanium.Platform.osname == 'ipad')
{
	// photogallery displays in a popover on the ipad and we
	// want to make it relative to our image with a left arrow
	arrowDirection = Ti.UI.iPad.POPOVER_ARROW_DIRECTION_LEFT;
	popoverView = imageView;
}

var upload_button = Titanium.UI.createButton({
  	title:'Upload Image'
});

upload_button.addEventListener('click', function(){
  Titanium.Media.openPhotoGallery({

  	success:function(event)
  	{
  		var cropRect = event.cropRect;
  		var image = event.media;

  		// set image view
  		Ti.API.debug('Our type was: '+event.mediaType);
  		if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
  		{
  			imageView.image = image;
  		}
  		else
  		{

  		}

      win.add(imageView);
  		Titanium.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y  + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);

  	},
  	cancel:function()
  	{

  	},
  	error:function(error)
  	{
  	},
  	allowEditing:true,
  	popoverView:popoverView,
  	arrowDirection:arrowDirection,
  	mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
  });  
});
win.setRightNavButton(upload_button);
