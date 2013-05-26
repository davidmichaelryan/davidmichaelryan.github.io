var menu_toggle = function(){
	var e = document.getElementById("nav-list");
	if(e.style.maxHeight == "0px")
		e.style.maxHeight = "135px";
	else
		e.style.maxHeight = '0px';
}