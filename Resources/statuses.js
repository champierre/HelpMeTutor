var win = Titanium.UI.currentWindow;
var room;

var label = Titanium.UI.createLabel({
	color:'#999',
	text:'Status',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win.add(label);


function openMordal() {
  var style = Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL;
	var presentation = Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN;
	var modal_win = Ti.UI.createWindow({
		backgroundColor:'#eee'
	});
	
  var l = Titanium.UI.createLabel({
   top:50,
   left:20,
   width:300,
   height:'auto',
   color:'#777',
   font:{fontSize:18},
   text:'Specify the Room ID.'
  });
  
  var text_field = Ti.UI.createTextField({
    color:'#336699',
    height:35,
    top:80,
    left:20,
    width:230,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    keyboardType:Titanium.UI.KEYBOARD_ASCII,
    value:room
  });
  
  var ok_button = Titanium.UI.createButton({
   top:130,
   left:20,
   height:40,
   width:100,
   title:'OK'
  });
  
  var cancel_button = Titanium.UI.createButton({
   top:130,
   left:150,
   height:40,
   width:100,
   title:'Cancel'
  });
  
  modal_win.add(ok_button);
  modal_win.add(cancel_button);
  ok_button.addEventListener('click', function()
  {
    room = text_field.value;
    win.title = room;
    modal_win.close();
    getStatus(room);
  });
  cancel_button.addEventListener('click', function()
  {
    modal_win.close();
    getStatus(room);
  });
  
  modal_win.add(l);
  modal_win.add(text_field);

	modal_win.open({modal:true,modalTransitionStyle:style,navBarHidden:true});
}

function getStatus(room) {

	// create table view data object
	var data = [];

	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 30000;
  xhr.open("GET","http://akirakusumo10.appspot.com/api/note/list?room=" + room);
  
	xhr.onload = function()
	{
		try
		{
		  var jsonval = JSON.parse(this.responseText);
      var notes = jsonval;

			for (var i=0;i<notes.length;i++){
        var seatNo = notes[i].seatNo;
				var name = notes[i].name;
				var note = notes[i].note;
				var duration = notes[i].duration;
        var help_me = notes[i].helpMe;
				var bgcolor = (i % 2) == 0 ? '#fff' : '#eee';

				var row = Ti.UI.createTableViewRow({hasChild:false,height:'auto',room:room,seatNo:seatNo,backgroundColor:bgcolor});

				var note_view = Ti.UI.createView({
          height:'auto',
					layout:'vertical',
					left:5,
					top:5,
					bottom:5,
					right:5
				});

        var seat_label = Ti.UI.createLabel({
          text:seatNo,
          left:10,
          width:120,
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

        if (help_me) {
          var help_me_icon = Titanium.UI.createImageView({
            top: -32,
            left: 250,
            url:'help_me.png',
            height: 43,
            width: 43
          });
          note_view.add(help_me_icon);
        } else {
          var duration_label = Ti.UI.createLabel({
             text:duration,
             right:20,
             top:-32,
             bottom:2,
             height:30,
             textAlign:'right',
             width:110,
             color:'#444444',
             font:{fontFamily:'Trebuchet MS',fontSize:24}
          });
  				// Add the date to the view
          note_view.add(duration_label);
        }

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
			
      tableview.addEventListener('click', function(e){
        // alert(e.rowData.seatNo);
        // if (e.rowData.seatNo && (e.rowData.seatNo == 0))
        // {
          var status_win = Titanium.UI.createWindow({
            url:"status.js",
            seatNo:e.rowData.seatNo,
            room:e.rowData.room
          });
          Titanium.UI.currentTab.open(status_win,{animated:true});
        // }
      });
			
			win.add(tableview);
		}
		catch(E){
			alert(E);
		}
	};
	// Get the data
	xhr.send();
}

var set_room_button = Titanium.UI.createButton({
  title:'Set Room'
});

set_room_button.addEventListener('click', function(){
  openMordal();
});
win.setLeftNavButton(set_room_button);

var reload_button = Titanium.UI.createButton({
  title:'Reload'
});

reload_button.addEventListener('click', function(){
  getStatus(room);
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
if (room) {
  win.add(actInd);
  actInd.show();
  getStatus(room);
} else {
  openMordal();
  // alert("Please specify room ID.");
}

