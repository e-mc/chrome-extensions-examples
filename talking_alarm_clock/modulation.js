
$(document).ready(function() {
  $("#play").click(function() {
    alert("Play clicked!");
    console.log("clicked play!");
    return false;
  });

  $("#play").click(function() {
    $(this).append("<br><div>You clicked play!</div>");
  });


  $("#stop_sound").click(function() {
    carrier.stop();
  });
});