// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var seats_win = Titanium.UI.createWindow({  
    title:'Seats',
    backgroundColor:'#fff',
    url:'seats.js' 
});

var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Seats',
    window:seats_win
});


//
// create controls tab and root window
//
var status_win = Titanium.UI.createWindow({  
    title:'Status',
    backgroundColor:'#fff',
    url:'statuses.js'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Status',
    window:status_win
});


//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();
