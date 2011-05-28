Ti.include("constants.js");
Ti.include("utilities.js");

var win = Titanium.UI.currentWindow;
var room = win.room;
var seatNo = win.seatNo;
var name = win.name;
var step_times = win.step_times;
win.title = "Seat " + seatNo + ": " + name;

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

var getSeatStatus = function() {
  // create table view data object
  var data = [];

  var xhr = Ti.Network.createHTTPClient();
  xhr.timeout = 30000;
  xhr.open("GET", API_URL + "roommember/list?roomName=" + room + "&seatNo=" + seatNo);
  
  xhr.onload = function()
  {
    try
    {
      var jsonval = JSON.parse(this.responseText);
      var notes = jsonval;
      var step_times = notes[0].stepTimes;
      var help_me = notes[0].helpMe;
      var current_step = notes[0].currentStep;
      var done = notes[0].done;

      for (var i = 0; i < (done ? step_times.length - 1 : step_times.length); i++){    
        var bgcolor = (i == current_step && !done) ? "#ffc129" : ((i % 2) == 0 ? '#fff' : '#eee');
        var row = Ti.UI.createTableViewRow({hasChild:false,height:'auto',backgroundColor:bgcolor});
        var note_view = Ti.UI.createView({
          height:'auto',
          layout:'vertical',
          left:5,
          top:5,
          bottom:5,
          right:5
        });

        var step_label = Ti.UI.createLabel({
          text:"Step " + (i + 1),
          left:10,
          width:100,
          bottom:2,
          height:20,
          textAlign:'left',
          color:'#444444',
          font:{fontFamily:'Trebuchet MS',fontSize:18,fontWeight:'bold'}
        });
        note_view.add(step_label);

        var start_date = new Date(step_times[i]);
        var end_date = (current_step == i) ? new Date() : new Date(step_times[i + 1]);
        
        var start_time = formatTime(start_date);
        var end_time = formatTime(end_date);
        
        var duration = end_date.getTime() - start_date.getTime();
        
        var duration_label = Ti.UI.createLabel({
           text: formatDuration(duration),
           right:20,
           top:-24,
           bottom:2,
           height:20,
           textAlign:'right',
           width:110,
           color:'#444444',
           font:{fontFamily:'Trebuchet MS',fontSize:16}
        });
        note_view.add(duration_label);
        
        var time_label = Ti.UI.createLabel({
           text: ((current_step == i) ? start_time + " - " : start_time + " - " + end_time),
           right:20,
           top:0,
           bottom:2,
           height:16,
           textAlign:'right',
           width:110,
           color:'#444444',
           font:{fontFamily:'Trebuchet MS',fontSize:12}
        });
        note_view.add(time_label);

        if (help_me && current_step == i) {
          var icon = Titanium.UI.createImageView({
            top: -46,
            left: 180,
            url: 'help_me.png',
            height: 43,
            width: 43
          });
          note_view.add(icon);
        }

        // Add the vertical layout view to the row
        row.add(note_view);
        data[i] = row;
      }
      // Create the tableView and add it to the window.
      var tableview = Titanium.UI.createTableView({data:data,minRowHeight:58});
          
      win.add(tableview);
    }
    catch(E){
      alert(E);
    }
  };
  // Get the data
  xhr.send();
};

// var reload_button = Titanium.UI.createButton({
//   title:'Reload'
// });
// 
// reload_button.addEventListener('click', function(){
//   getSeatStatus();
// });
// win.setRightNavButton(reload_button);

getSeatStatus();
setInterval(getSeatStatus, 10000);
 