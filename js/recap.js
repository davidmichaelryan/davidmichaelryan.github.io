function quoteSize(){
  var speakers = ['marissa', 'kapsalis', 'divin', 'dryer', 'stanton', 'katie','julie', 'loelbach'];
  var h = $('#quote p.active').height()+5;
  $('#quote').height(h);

  if ($(window).width() > 1501){
    var w = $(window).width() - 1501;   
    $('#speechGradient').css('margin-left', w);     
  }
  else if ($(window).width() > 905){
    var w = $(window).width() - 905;
    $('#speechGradient').css('margin-left', w);
  }
  else {
    $('#speechGradient').css('margin-left', 0); 
  }
};

$(window).load(function(){
  setTimeout(2);
  quoteSize()
});
$(window).resize(quoteSize);

var speakers = ['marissa', 'kapsalis', 'divin', 'dreher', 'stanton', 'katie','julie', 'loelbach']
var count = 0;
$('#next').click(function(){
  $('#'+speakers[count]).removeClass('active');
  count+=1;
  if (count > 7){
    count = 0;
  }
  if (count == 6){
    count = 7;
  }
  if ((count == 1) && ($('body').width() < 400)){
    $('#speechID .words').css('padding-top', 0);
  }
  else {
    $('#speechID .words').removeAttr('style'); 
  }
  $('#'+speakers[count]).addClass('active');
  $('#speechID').css('background-image', 'url(../images/recap/'+speakers[count]+'.jpg)');
  quoteSize()
});

$('#prev').click(function(){
  $('#'+speakers[count]).removeClass('active');
  count-=1;
  if (count < 0){
    count = 7;
  }
  if (count == 6){
    count = 5;
  }
  if ((count == 1) && ($('body').width() < 400)){
    $('#speechID .words').css('padding-top', 0);
  }
  else {
    $('#speechID .words').removeAttr('style'); 
  }
  setTimeout(400);
  $('#'+speakers[count]).addClass('active');
  $('#speechID').css('background-image', 'url(../images/recap/'+speakers[count]+'.jpg)');
  quoteSize()
});

$('.moment').click(function(){
  $('.active').toggleClass('active');
  var newID = $(this).attr('id');
  $('#momentID').css('background-image', 'url(../images/recap/'+newID+'.jpg)');
  $('#momentID').css('background-image', 'url(../images/recap/'+newID+'.jpg)');
  $(this).toggleClass('active');
})
