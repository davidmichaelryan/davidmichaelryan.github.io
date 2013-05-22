function swapImage() {
theImages = new Array("data/images/soon1.jpg", "data/images/soon3.jpg", "data/images/soon4.jpg", "data/images/soon5.jpg", "data/images/soon6.jpg", "data/images/soon7.jpg", "data/images/soon8.jpg");
whichImage = Math.floor(Math.random()*theImages.length);
$('#results_box').append('<IMG style="margin-top:40px;display:block;margin-left:auto;margin-right:auto;width:auto;" SRC="' +theImages[whichImage]+ '">');

}

window.onload = function()
                {
                   swapImage();
                };