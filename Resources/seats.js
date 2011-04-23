var win = Titanium.UI.currentWindow;

// var label = Titanium.UI.createLabel({
//  color:'#999',
//  text:'Please upload seats image.',
//  font:{fontSize:20,fontFamily:'Helvetica Neue'},
//  textAlign:'center',
//  width:'auto'
// });
// 
// win.add(label);

var imageView = Titanium.UI.createImageView({
	height:368,
	width:320,
  // top:20,
  // left:10,
	backgroundColor:'#999'
});

win.add(imageView);

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
