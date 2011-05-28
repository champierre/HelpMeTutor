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

function formatTime(date) {
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
