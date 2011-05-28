Ti.include("constants.js");

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
      var duration = notes[0].duration;
      var help_me = notes[0].helpMe;
      var current_step = notes[0].currentStep;

      for (var i = 0; i < step_times.length; i++){
        var bgcolor = (i == current_step) ? "#ffc129" : ((i % 2) == 0 ? '#fff' : '#eee');
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
          text:"Step " + i,
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
        var end_date = new Date(step_times[i + 1]);
        
        var start_time = format(start_date);
        var end_time = format(end_date);
        
        var difference = step_times[i + 1] - step_times[i];
        
        var duration_label = Ti.UI.createLabel({
           text: (current_step == i) ? duration : formatDuration(difference),
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
           text: (current_step == i) ? start_time + " - " : start_time + " - " + end_time,
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
          var help_me_icon = Titanium.UI.createImageView({
            top: -46,
            left: 180,
            url:'help_me.png',
            height: 37,
            width: 37
          });
          note_view.add(help_me_icon);
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

var reload_button = Titanium.UI.createButton({
  title:'Reload'
});

reload_button.addEventListener('click', function(){
  getSeatStatus();
});
win.setRightNavButton(reload_button);

getSeatStatus();
setInterval(getSeatStatus, 10000);

function format(date) {
  var hours = date.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  var minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  var seconds = date.getSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
}

function formatDuration(milli_seconds){
  seconds = Math.floor(milli_seconds / 1000);
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = seconds % 60;
  if (h < 10){
    h = "0" + h;
  }
  if (m < 10){
    m = "0" + m;
  }
  if (s < 10){
    s = "0" + s;
  }
  return h + ":" + m + ":" + s;
}  