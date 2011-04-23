var win = Titanium.UI.currentWindow;

var label = Titanium.UI.createLabel({
	color:'#999',
	text:'Status',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win.add(label);

function getStatus() {

	// create table view data object
	var data = [];

	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 30000;
  xhr.open("GET","http://libron.net/top/status");
  
	xhr.onload = function()
	{
		try
		{
		  var jsonval = JSON.parse(this.responseText);
      // alert(jsonval);
      // var notes = jsonval.results;
      var notes = jsonval;

			for (var i=0;i<notes.length;i++){
        var seat = notes[i].seat;
				var name = notes[i].name;
				var note = notes[i].note;
				var duration = notes[i].duration;
        
        // var created_at = prettyDate(strtotime(tweets[c].created_at));
				var bgcolor = (i % 2) == 0 ? '#fff' : '#eee';

				var row = Ti.UI.createTableViewRow({hasChild:false,height:'auto',name:name,backgroundColor:bgcolor});

				// Create a vertical layout view to hold all the info labels and images for each tweet
				var note_view = Ti.UI.createView({
          height:'auto',
          // heitht:32,
					layout:'vertical',
					left:5,
					top:5,
					bottom:5,
					right:5
				});

        // var av = Ti.UI.createImageView({
        //    image:avatar,
        //    left:0,
        //    top:0,
        //    height:48,
        //    width:48
        //  });
        // // Add the avatar image to the view
        // post_view.add(av);

				var seat_label = Ti.UI.createLabel({
					text:seat,
					left:10,
					width:120,
          // top:-48,
					bottom:2,
					height:30,
					textAlign:'left',
					color:'#444444',
					font:{fontFamily:'Trebuchet MS',fontSize:24,fontWeight:'bold'}
				});
				note_view.add(seat_label);

				var name_label = Ti.UI.createLabel({
					text:name,
					left:50,
					width:120,
          top:-32,
					bottom:2,
					height:30,
					textAlign:'left',
					color:'#444444',
					font:{fontFamily:'Trebuchet MS',fontSize:24,fontWeight:'bold'}
				});
				// Add the username to the view
				note_view.add(name_label);

        var duration_label = Ti.UI.createLabel({
           text:duration,
           right:20,
           top:-32,
           bottom:2,
           height:30,
           textAlign:'right',
           width:110,
           color:i==1 ? '#ff0000' : '#444444',
           font:{fontFamily:'Trebuchet MS',fontSize:24}
        });
				// Add the date to the view
        note_view.add(duration_label);

        var note_text = Ti.UI.createLabel({
          text:note,
          left:10,
          top:0,
          bottom:2,
          height:'auto',
          width:280,
          textAlign:'left',
          font:{fontSize:14}
        });
				// Add the note to the view
        note_view.add(note_text);
				// Add the vertical layout view to the row
				row.add(note_view);
        // row.className = 'item'+c;
				data[i] = row;
			}
			// Create the tableView and add it to the window.
			var tableview = Titanium.UI.createTableView({data:data,minRowHeight:58});
			
      // tableview.addEventListener('click', function(e)
      //       {
      //        if (e.rowData.tweet)
      //        {
      //          var tweet_win = Titanium.UI.createWindow({
      //            url:"tweet.js",
      //            user_name:e.rowData.user_name,
      //            tweet:e.rowData.tweet
      //          });
      //          Titanium.UI.currentTab.open(tweet_win,{animated:true});
      //        }
      //       });
			
			win.add(tableview);
		}
		catch(E){
			alert(E);
		}
	};
	// Get the data
	xhr.send();
}

var reload_button = Titanium.UI.createButton({
  title:'Reload'
});

reload_button.addEventListener('click', function(){
  getStatus();
});
win.setRightNavButton(reload_button);

var actInd = Titanium.UI.createActivityIndicator({
  top:160, 
  height:50,
  width:10,
  style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
});

var view = Ti.UI.createView({
  backgroundColor:'#fff'
});

win.add(view);
win.add(actInd);
actInd.show();

getStatus();