var win = Titanium.UI.currentWindow;
var room = win.room;
var seatNo = win.seatNo;
win.title = room + " " + seatNo;

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
getSeatStatus(room, seatNo);

function getSeatStatus(room, seatNo) {
  // create table view data object
  var data = [];

  var xhr = Ti.Network.createHTTPClient();
  xhr.timeout = 30000;
  xhr.open("GET","http://akirakusumo10.appspot.com/api/note/list?room=" + room + "&seatNo=" + seatNo);
  
  xhr.onload = function()
  {
    try
    {
      var jsonval = JSON.parse(this.responseText);
      var notes = jsonval;

      for (var i=0;i<notes.length;i++){
        var seat = notes[i].seatNo;
        var name = notes[i].name;
        var note = notes[i].note;
        var duration = notes[i].duration;
        // var help_me = notes[i].helpMe;
        var bgcolor = (i % 2) == 0 ? '#fff' : '#eee';

        var row = Ti.UI.createTableViewRow({hasChild:false,height:'auto',backgroundColor:bgcolor});

        var note_view = Ti.UI.createView({
          height:'auto',
          layout:'vertical',
          left:5,
          top:5,
          bottom:5,
          right:5
        });

        var seat_label = Ti.UI.createLabel({
          text:'',
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
          left:10,
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
          color:'#444444',
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
}