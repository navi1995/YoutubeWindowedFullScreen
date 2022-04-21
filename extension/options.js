function saveOptions(e) {
	chrome.storage.sync.set({
		"shortcutDisplay": document.querySelector("#shortcut").value,
		"shortcutKey": document.querySelector("#shortcut").getAttribute("key-code"),
		"hideFullScreen": document.querySelector("#fullscreen").checked,
		"autoToggle": document.querySelector("#auto").checked
	}, function() {
		document.getElementById("status").textContent =  "Options have been Saved!";
	});
	e.preventDefault();
}
  
function restoreOptions() {
	var isFireFox = (window.browser) ? true : false;
	
	//Try to fetch using chrome API. If fails, use firefox sync.
	if (!isFireFox) {
		chrome.storage.sync.get(null, function(items) {
			document.querySelector("#shortcut").value = items.shortcutDisplay || '`';
			document.querySelector("#shortcut").setAttribute("key-code", items.shortcutKey || '192');
			document.querySelector("#fullscreen").checked = items.hideFullScreen || false;
			document.querySelector("#auto").checked = items.autoToggle || false;
		});
	} else {
		browser.storage.sync.get().then(function(items) {
			document.querySelector("#shortcut").value = items.shortcutDisplay || '`';
			document.querySelector("#shortcut").setAttribute("key-code", items.shortcutKey || '192');
			document.querySelector("#fullscreen").checked = items.hideFullScreen || false;
			document.querySelector("#auto").checked = items.autoToggle || false;
		});
	}
}
  
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#shortcut").addEventListener("keydown", function(e) {
	e.preventDefault();
});
document.querySelector("#shortcut").addEventListener("keyup", function(e) {
	e.preventDefault();
	var el = document.querySelector("#shortcut");

	el.value = e.key;
	el.setAttribute("key-code", e.keyCode);
});