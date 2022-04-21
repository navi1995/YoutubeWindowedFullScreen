(function () {
	var isFullMode = false;
	var controlsCreated = false;
	var watchContainer = null;
	var mediaQueryContainer = null;
	var resizeEvent = null;
	var initialTheatreMode = false;
	var extensionSettings = {};
	var browser = browser || false;
	var isFireFox = browser ? true : false;
	
	//Get settings from browser, then continue with page ready.
	if (!isFireFox) {
		chrome.storage.sync.get(null, loadBrowserSettings);
	} else {
		browser.storage.sync.get().then(loadBrowserSettings);
	}

	function loadBrowserSettings(items) {
		extensionSettings = {
			"shortcutDisplay": items.shortcutDisplay || "`",
			"shortcutKey": items.shortcutKey || 192,
			"hideFullScreen": items.hideFullScreen || false,
			"autoToggle": items.autoToggle || false
		};
		onPageReady();
	}

	function onPageReady() {
		if (watchContainer) {
			mediaQueryContainer = watchContainer.querySelector("iron-media-query[query='min-width: 882px']");
		}
		
		pageReadyInterval();

		//This event lets us know when the youtube player is ready, and we can inject our controls in.
		document.body.addEventListener("yt-navigate-finish", function () {
			pageReadyInterval();

			//Sometimes navigate finish won't load in video player, interval until it's loaded.
			var loop = setInterval(function() {
				if (isPageVideo() && !controlsCreated) {
					pageReadyInterval();
				} else if (controlsCreated) {
					//If navigating to a new video, enter full browser if setting is valid.
					if (isPageVideo() && extensionSettings.autoToggle) {
						enterFullBrowser();
					}

					clearInterval(loop);
				}
			}, 500);
		});
	}

	function pageReadyInterval() {
		var video = document.querySelector("video[src^='blob:https://www.youtube.com'");

		if (isPageVideo() && video && !controlsCreated) {
			createControl();
			watchContainer = document.querySelector("ytd-watch") || document.querySelector("ytd-watch-flexy");
			mediaQueryContainer = null;

			if (watchContainer) {
				mediaQueryContainer = watchContainer.querySelector("iron-media-query[query='min-width: 882px']");
			}
		} else if (!isPageVideo() && isFullMode) {
			leaveFullBrowser();
		}
	}

	function toggleFullBrowser() {
		if (isFullMode) {
			leaveFullBrowser();
		} else {
			enterFullBrowser();
		}
	}

	function enterFullBrowser() {
		var original = document.getElementById("original-size");
		var newControl = document.getElementById("full-size");
		var watchContainer = document.querySelector("ytd-watch") || document.querySelector("ytd-watch-flexy") || document.querySelector("#player");

		resizeEvent = window.matchMedia("(max-width: 882px)");
		resizeEvent.addListener(handleMediaQuery);
		isFullMode = true;
		isTheatreMode = watchContainer.hasAttribute("theater");
		initialTheatreMode = isTheatreMode;

		//Since our button is cloned from theatre button, we must toggle functionality to ensure state of player remains what it was before user clicked button.
		if (!isTheatreMode) {
			original.click();
			isTheatreMode = true;
		}

		document.getElementById("movie_player").classList.add("updated-full-mode");
		document.body.classList.add("updated-full-mode");
		document.getElementsByClassName("html5-main-video")[0].classList.add("updated-full-mode");
		original.style.display = "none";
		newControl.style.display = "inline-block";
		newControl.innerHTML = "<svg width=\"20\" height=\"28\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-container\"><path d=\"M896 960v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45zm755-672q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23z\" style=\"fill: white;\"></path></svg>";
		handleMediaQuery(resizeEvent);
		window.dispatchEvent(new Event("resize"));
	}

	function leaveFullBrowser() {
		var original = document.getElementById("original-size");
		var newControl = document.getElementById("full-size");

		isFullMode = false;
		document.getElementById("movie_player").classList.remove("updated-full-mode");
		document.body.classList.remove("updated-full-mode");
		document.getElementsByClassName("html5-main-video")[0].classList.remove("updated-full-mode");
		original.style.display = "inline-block";
		newControl.style.display = "inline-block";
		newControl.innerHTML = "<svg width=\"20\" height=\"28\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-container\"><path d=\"M883 1056q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23zm781-864v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45z\" style=\"fill: white;\"></path></svg>";

		//Since our button is cloned from theatre button, we must toggle functionality to ensure state of player remains what it was before user clicked button. This variable is set in enterFullBrowser
		if (!initialTheatreMode) {
			original.click();
		}

		if (mediaQueryContainer) {
			mediaQueryContainer.setAttribute("query", "min-width: 882px");
		}

		resizeEvent.removeListener(handleMediaQuery);
		window.dispatchEvent(new Event("resize"));
	}

	//We create control by cloning an existing button (Theater button), and replacing the HTML with SVG for the expand icon.
	function createControl() {
		var original = document.querySelector("#movie_player button.ytp-settings-button");
		var theatre = document.getElementsByClassName("ytp-size-button")[0];
		var fullScreenButton = document.getElementsByClassName("ytp-fullscreen-button")[0];
		var miniplayerButton = document.getElementsByClassName("ytp-miniplayer-button")[0];
		var copy = original.cloneNode(true);

		original.id = "settings-cog";
		theatre.id = "original-size";
		copy.id = "full-size";

		var controls = document.getElementsByClassName("ytp-right-controls")[0];
		var newControl = controls.insertBefore(copy, original);

		newControl.title = `Full Browser Mode (${extensionSettings.shortcutDisplay})`;
		newControl.className = theatre.className + " ytp-button";
		newControl.innerHTML = "<svg width=\"20\" height=\"28\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-container\"><path d=\"M883 1056q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23zm781-864v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45z\" style=\"fill: white;\"></path></svg>";
		newControl.addEventListener("click", toggleFullBrowser);
		//Adding shortcuts, also ignoring if user is typing into comment/search fields etc
		document.addEventListener("fullscreenchange", function(e) {
			toggleIcon();
		});
		document.body.addEventListener("keydown", function(e) {
			if (e.keyCode == 27 && isFullMode && isPageVideo()) {
				leaveFullBrowser();
			}

			if (e.target.nodeName == "TEXTAREA" || e.target.nodeName == "INPUT" || e.target.nodeName == "YT-FORMATTED-STRING" || (e.target.nodeName == "DIV" && e.target.className == "style-scope yt-formatted-string")) {
				//Ignore these two types. Otherwise users might get hotkey applying while they're typing in fields.
			} else if(isPageVideo()) {
				//mini player toggle
				if (e.keyCode == 73) {
					leaveFullBrowser();
				}

				//Full browser toggle
				if (e.keyCode == extensionSettings.shortcutKey) {
					toggleFullBrowser();
				}
			}
		});

		//We hide the full browser button if user is in full-screen video.
		fullScreenButton.addEventListener("click", toggleIcon);
		miniplayerButton.addEventListener("click", leaveFullBrowser);
		controlsCreated = true;

		if (extensionSettings.hideFullScreen) {
			document.querySelector(".ytp-fullscreen-button").style.display = "none";
		}

		if (extensionSettings.autoToggle) {
			enterFullBrowser();
		}
	}

	//Essentially we hide original button if screen size is too small, to ensure button always appears on resize.
	function handleMediaQuery(mq) {
		var original = document.getElementById("original-size");

		if (mq.matches && mediaQueryContainer) {
			mediaQueryContainer.setAttribute("query", "max-width: 882px");
			original.style.display = "none";
		} else if (mediaQueryContainer) {
			mediaQueryContainer.setAttribute("query", "min-width: 882px");
		}
	}

	function toggleIcon() {
		var original = document.getElementById("original-size");
		var newControl = document.getElementById("full-size");

		if (!isFullScreenActive()) {
			newControl.style.display = "inline-block";

			if (isFullMode) {
				original.style.display = "none";
			}
		} else {
			newControl.style.display = "none";
		}
	}

	function isPageVideo() {
		return location.pathname == "/watch";
	}

	function isFullScreenActive() {
		var el = document.getElementsByClassName("ytp-fullscreen-button")[0];

		if (el) {
			return el.title == "Exit full screen (f)";
		} else {
			return false;
		}
	}
}());
