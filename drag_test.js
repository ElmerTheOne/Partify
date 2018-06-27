window.onload = function() {
	var dropZone = document.getElementById("drop");
	console.log("TESTING DROP ZONE");
	console.log(dropZone);
	
	
	document.addEventListener('drop', function(e) {
		console.log("document");
		e.preventDefault;
	});
	
	document.addEventListener("dragover", function(event) {
		event.preventDefault();
	});
	
	window.addEventListener("dragover", function(event) {
		event.preventDefault();
	});
	
	window.addEventListener('drop', function(e) {
		console.log("test");
		e.preventDefault;
		console.log(e);
		console.log(e.dataTransfer.getData("Text"));
	});
	// window.addEventListener('drop', function(e) {
		// console.log("sadssd");
		// e.preventDefault();
		// e.stopPropagation();
		
		
		// var song = e.dataTransfer; // Array of all files
    
	// }, false);
}



