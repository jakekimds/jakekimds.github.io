var slideCount = 19
var imgurl = "https://raw.githubusercontent.com/jakekimds/files/master/img/"
var imgext = "png";
var currentSlide = 1;
document.ontouchmove = function(event){
    event.preventDefault();
}
try{
	var socket = io.connect("https://slidecontrol.herokuapp.com/");
}catch(e){
	//stuff
}

if(socket !== undefined){
	var id = null;
	socket.emit("controllerConnect", {
		slideCount: slideCount,
		imgdata:{
			url: imgurl,
			extension: imgext
		}
	});

	socket.on("controllerConnected", function(data){
		id = data.id;
		gebi("id").innerHTML = id;
	});

	socket.on("gotoslide", function(data){
		currentSlide = data;
		gebi("slideselect").selectedIndex = data-1
	})

	gebi("slideback").addEventListener("click", function(){
		gotoSlide(currentSlide-1, socket)
	});
	gebi("slidenext").addEventListener("click", function(){
		gotoSlide(currentSlide+1, socket)
	});
	gebi("slideselect").addEventListener("change", function(){
		gotoSlide(gebi("slideselect").selectedIndex+1, socket)
	})
}

function gotoSlide(slide, socket){
	if(slide > slideCount || slide < 1){
		return;
	}
	currentSlide = slide;
	socket.emit("gotoSlide", {
		id: id,
		slideNumber: slide
	});
	gebi("slideselect").selectedIndex = slide-1
}

function gebi(id){
	return document.getElementById(id);
}

var select = gebi("slideselect");
var option;
for(var i = 0; i < slideCount; i++){
	option = document.createElement("option");
	option.text = (i+1).toString();
	select.add(option)
}
select.selectedIndex = 0;