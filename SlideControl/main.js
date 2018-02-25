function gebi(id){
	return document.getElementById(id);
}

var url, ext, slideCount, currentSlide;

try{
	var socket = io.connect("https://slidecontrol.herokuapp.com/");
}catch(e){
	//stuff
}

if(socket !== undefined){
	var idel = gebi("id")
	var img = gebi("slide")
	idel.addEventListener("keyup", function(e){
		if(e.keyCode == 13){
			socket.emit("screenConnect", {id: idel.value})
		}
	});

	socket.on("screenConnected", function(data){
		gebi("idlabel").style.display = "none";
		url = data.imgdata.url;
		ext = data.imgdata.extension;
		slideCount = data.slideCount;
		currentSlide = data.slideNumber;

		img.style.display = "block";
		img.src = url+currentSlide+"."+ext
	});	

	socket.on("gotoslide", function(data){
		currentSlide = data;
		img.src = url+currentSlide+"."+ext
	})
	document.addEventListener("keypress", function(e){
		if(url){
			e.preventDefault();
		}
	})
	document.addEventListener("keyup", function(e){
		if(url){
			if(e.keyCode === 70){
				var elem = img
				var requestFullScreen = elem.requestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
				var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
					(document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
					(document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
					(document.msFullscreenElement && document.msFullscreenElement !== null);
				if(isInFullScreen){
					if (document.exitFullscreen) {
						document.exitFullscreen();
					} else if (document.webkitExitFullscreen) {
						document.webkitExitFullscreen();
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if (document.msExitFullscreen) {
						document.msExitFullscreen();
					}
					img.style.cursor = "default";
				}else{
					requestFullScreen.call(elem)
					img.style.cursor = "none";
				}
			}else if(e.keyCode === 37){
				gotoSlide(currentSlide-1, socket)
			}else{
				gotoSlide(currentSlide+1, socket)
			}
		}
	})
	document.addEventListener("click", function(e){
		if(url){
			gotoSlide(currentSlide+1, socket)
		}
	})
}

function gotoSlide(slide, socket){
	if(slide > slideCount || slide < 1){
		return;
	}
	currentSlide = slide;
	img.src = url+"PNG-"+currentSlide+"."+ext
	socket.emit("gotoSlide", {
		id: gebi("id").value,
		slideNumber: slide
	});
}