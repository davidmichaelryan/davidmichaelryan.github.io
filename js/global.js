$(window).load(function(){
  var circleImages = $('.circle-img img');
  circleImages.height(circleImages.width());
  pop_in(circleImages);
});

$(window).resize(function(){
  var circleImages = $('.circle-img img');
  circleImages.height(circleImages.width());
});

function pop_in(obj){
}