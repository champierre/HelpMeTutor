Ti.include("constants.js");
Ti.include("utilities.js");

var win = Titanium.UI.currentWindow;
var room;
var steps;

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
  
  var label_for_steps = Ti.UI.createLabel({
    top: 130,
    left: 20,
    height:'auto',
    color:'#777',
    font:{fontSize:18},
    text: 'Number of steps:'
  });
  
  var steps_text_field = Ti.UI.createTextField({
    color:'#336699',
    height:35,
    top:160,
    left:20,
    width:230,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    keyboardType:Titanium.UI.KEYBOARD_NUMBER_PAD,
    value:steps
  });
  
  var ok_button = Titanium.UI.createButton({
   top:210,
   left:20,
   height:40,
   width:100,
   title:'OK'
  });
  
  var cancel_button = Titanium.UI.createButton({
   top:210,
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
    steps = steps_text_field.value;
    win.title = room;
    modal_win.close();
    updateRoom(room, steps);
    getStatus();
  });
  cancel_button.addEventListener('click', function()
  {
    modal_win.close();
    getStatus();
  });
  
  modal_win.add(l);
  modal_win.add(text_field);
  modal_win.add(label_for_steps);
  modal_win.add(steps_text_field);

	modal_win.open({modal:true,modalTransitionStyle:style,navBarHidden:true});
}

function updateRoom(room, steps) {  
  var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 30000;
	
	xhr.onerror = function(e)
	{
		Ti.UI.createAlertDialog({title:'Error', message:e.error}).show();
		Ti.API.info('IN ERROR ' + e.error);
	};
	xhr.onload = function(e)
	{
		Ti.API.info('IN ONLOAD ' + this.status + ' readyState ' + this.readyState);
	};
	
  xhr.open("POST", API_URL + "room/update");
  xhr.send({name:room,totalStep:steps});
}

// function getStatus(room) {
var getStatus = function() {

	// create table view data object
	var data = [];
	var vibrate = false;

	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 30000;
  xhr.open("GET", API_URL + "roommember/list?roomName=" + room);
  
	xhr.onload = function()
	{
		try
		{
		  var jsonval = JSON.parse(this.responseText);
      var notes = jsonval;

			for (var i=0;i<notes.length;i++){
        var seatNo = notes[i].seatNo;
				var name = notes[i].name;
				var current_step = notes[i].currentStep;
				var step_times = notes[i].stepTimes;
        var help_me = notes[i].helpMe;
        var done = notes[i].done;
				var bgcolor = (i % 2) == 0 ? '#fff' : '#eee';

				var row = Ti.UI.createTableViewRow({hasChild:false,height:'auto',name:name,room:room,seatNo:seatNo,backgroundColor:bgcolor});

        if (help_me　&& !done) {
          vibrate = true;
        }

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
          width:100,
          bottom:2,
          height:30,
          textAlign:'left',
          color:'#444444',
          font:{fontFamily:'Trebuchet MS',fontSize:24,fontWeight:'bold'}
        });
        note_view.add(seat_label);
								
				var name_label = Ti.UI.createLabel({
					text:name,
					left:40,
					width:130,
          top:-32,
					bottom:2,
					height:30,
					textAlign:'left',
					color:'#444444',
					font:{fontFamily:'Trebuchet MS',fontSize:24,fontWeight:'bold'}
				});
				// Add the username to the view
				note_view.add(name_label);

        var now = new Date();
        var last_time = new Date(step_times[step_times.length - 1]);
        var duration = now.getTime() - last_time.getTime();
        
        var duration_label = Ti.UI.createLabel({
           text: done ? '-' : formatDuration(duration),
           right: 20,
           top: -32,
           bottom: 2,
           height: 30,
           textAlign: 'right',
           width: 100,
           color: '#444444',
           font: {fontFamily:'Trebuchet MS',fontSize:16}
        });
				// Add the date to the view
        note_view.add(duration_label);

        var current_step_label = Ti.UI.createLabel({
          text: done ? "Done" : "Current Step: " + (current_step + 1),
          left: 10,
          top: 0,
          bottom: 2,
          height: 'auto',
          width: 160,
          textAlign: 'left',
          font: {fontSize:14}
        });
				// Add the note to the view
        note_view.add(current_step_label);
        
        if (help_me || done) {
          var icon = Titanium.UI.createImageView({
            top: -46,
            left: 180,
            url: done ? 'done.png' : 'help_me.png',
            height: 43,
            width: 43
          });
          note_view.add(icon);
        }

				// Add the vertical layout view to the row
				row.add(note_view);
        // row.className = 'item'+c;
				data[i] = row;
			}
			// Create the tableView and add it to the window.
			var tableview = Titanium.UI.createTableView({data:data,minRowHeight:58});
			
      tableview.addEventListener('click', function(e){
        var status_win = Titanium.UI.createWindow({
          url:"status.js",
          seatNo:e.rowData.seatNo,
          room:e.rowData.room,
          name:e.rowData.name
        });
        Titanium.UI.currentTab.open(status_win,{animated:true});
      });
			
			win.add(tableview);
			
			if (vibrate) {
        // alert("Help Me Tutor!!");
    	  Titanium.Media.vibrate();
    	}
		}
		catch(E){
			alert(E);
		}
	};
	// Get the data
	xhr.send();
};

var set_room_button = Titanium.UI.createButton({
  title:'Set Room'
});

set_room_button.addEventListener('click', function(){
  openMordal();
});
win.setRightNavButton(set_room_button);

// var reload_button = Titanium.UI.createButton({
//   title:'Reload'
// });
// 
// reload_button.addEventListener('click', function(){
//   getStatus();
// });
// win.setRightNavButton(reload_button);

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

setInterval(getStatus, 10000);

if (room) {
  win.add(actInd);
  actInd.show();
  getStatus();
} else {
  openMordal();
}

