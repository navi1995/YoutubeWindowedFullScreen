(function () {
  var page = document.getElementById("page");

  if (page) {
    var isFullMode = false;
    var isFullScreen = false;
    var isTheatreMode = (page.classList.contains("watch-wide") && page.classList.contains("watch-stage-mode") && !page.classList.contains("watch-non-stage-mode"));
    var initialTheatreMode = isTheatreMode;
    var controlsCreated = false;

    function afterNavigate() {
      if (location.pathname == "/watch" && !controlsCreated) {
        createElements();
      } else {
        try {
          if (isFullMode) {
            leaveFullBrowser();
          }
        } catch(err) {
        }
      }
    }

    afterNavigate();
    (document.body || document.documentElement).addEventListener('transitionend', function(e) {
      if ((e.propertyName == "width" && e.target.id == "progress") || (e.target.id == "appbar-guide-menu" && e.propertyName == "opacity")) {
        afterNavigate();
      }
    }, true);

    function toggleFullBrowser() {
      if (isFullMode) {
        leaveFullBrowser();
      } else {
        enterFullBrowser();
      }
    }


    function enterFullBrowser() {
      var original = document.getElementById("original-size");

      isFullMode = true;
      isTheatreMode = (page.classList.contains("watch-wide") && page.classList.contains("watch-stage-mode") && !page.classList.contains("watch-non-stage-mode"));
      initialTheatreMode = isTheatreMode;

      if (!isTheatreMode) {
        original.click();

        isTheatreMode = true;
      }

      document.getElementById("movie_player").classList.add("full_mode");
      document.body.classList.add("full_mode");
      document.getElementById("masthead-positioner").classList.add("full_mode");
      document.getElementsByClassName("ytp-chrome-bottom")[0].classList.add("full_mode");
      document.getElementsByClassName("html5-main-video")[0].classList.add("full_mode");

      var newControl = document.getElementById("full-size");
      original.style.display = "none";
      newControl.style.display = "inline-block";
      newControl.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-container\"><path d=\"M896 960v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45zm755-672q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23z\" style=\"fill: white;\"></path></svg>";
      window.dispatchEvent(new Event('resize'));
    }

    function leaveFullBrowser() {
      isFullMode = false;

      document.getElementById("movie_player").classList.remove("full_mode");
      document.body.classList.remove("full_mode");
      document.getElementById("masthead-positioner").classList.remove("full_mode");
      document.getElementsByClassName("ytp-chrome-bottom")[0].classList.remove("full_mode");
      document.getElementsByClassName("html5-main-video")[0].classList.remove("full_mode");

      var original = document.getElementById("original-size");
      original.style.display = "inline-block";
      var newControl = document.getElementById("full-size");
      newControl.style.display = "inline-block";
      newControl.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-container\"><path d=\"M883 1056q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23zm781-864v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45z\" style=\"fill: white;\"></path></svg>";

      if (!initialTheatreMode) {
        original.click();
      }

      window.dispatchEvent(new Event('resize'));
    }

    function createElements() {
      var original = document.getElementsByClassName("ytp-size-button")[0];
      var copy = original.cloneNode(true);
      original.id = "original-size";
      copy.id = "full-size";

      var controls = document.getElementsByClassName("ytp-right-controls")[0];
      var newControl = controls.insertBefore(copy, original);

      newControl.title = "Full Browser Mode";
      newControl.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-container\"><path d=\"M883 1056q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23zm781-864v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45z\" style=\"fill: white;\"></path></svg>";

      var menu = document.getElementsByClassName("ytp-panel-menu")[0];
      menu.innerHTML = "<div class=\"ytp-menuitem\" id=\"loopVideo\" role=\"menuitemcheckbox\" aria-checked=\"false\" tabindex=\"0\"><div class=\"ytp-menuitem-label\">Loop Video</div><div class=\"ytp-menuitem-content\"><div class=\"ytp-menuitem-toggle-checkbox\"></div></div></div>" + menu.innerHTML;
      document.getElementById("loopVideo").addEventListener("click", function(e) {
        toggleLoop(this);
      })

      newControl.addEventListener("click", function() {
        toggleFullBrowser();
      });

      body.addEventListener("keyup", function(e) {
        if (e.keyCode == 27 && isFullMode) {
          leaveFullBrowser();
        }

        if (e.target.nodeName == "TEXTAREA" || e.target.nodeName == "INPUT" || e.target.classList.contains("comment-simplebox-text")) {
          //Ignore these two types.
        } else {
          if (e.keyCode == 84) {
            toggleFullBrowser();
          }

          if (e.keyCode == 70) {
            toggleIcon();
          }
        }
      });

      var fullScreenButton = document.getElementsByClassName("ytp-fullscreen-button")[0]
      fullScreenButton.addEventListener("click", function() {
        toggleIcon();
      })

      controlsCreated = true;
    }

    function toggleIcon() {
      var newControl = document.getElementById("full-size");

      if (isFullScreen && newControl.style.display != "inline-block") {
        newControl.style.display = "inline-block";
        isFullScreen = false;
      } else if (newControl.style.display == "inline-block") {
        newControl.style.display = "none";
        isFullScreen = true;
      }
    }

    function toggleLoop(element) {
      var videoPlayer = document.getElementsByTagName("video")[0];

      if (element.getAttribute("aria-checked") == "false") {
        element.setAttribute("aria-checked", true);
        videoPlayer.loop = true;
      } else {
        element.setAttribute("aria-checked", false);
        videoPlayer.loop = false;
      }
    }
  } else {
    //NEW LOGIC
    var isFullMode = false;
    var isFullScreen = false;
    var controlsCreated = false;

    document.body.addEventListener("yt-navigate-finish", function(event) {
      var video = document.querySelector("video[src^='blob:https://www.youtube.com'");

      if (video && !controlsCreated) {
        createControl();
      }
    });

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

      isFullMode = true;
      isTheatreMode = document.body.getElementsByTagName("ytd-watch")[0].hasAttribute("theater");
      initialTheatreMode = isTheatreMode;

      if (!isTheatreMode) {
        original.click();
        isTheatreMode = true;
      }

      document.getElementById("movie_player").classList.add("updated-full-mode");
      document.body.classList.add("updated-full-mode");
      document.getElementsByClassName("html5-main-video")[0].classList.add("updated-full-mode");
      original.style.display = "none";
      newControl.style.display = "inline-block";
      newControl.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-container\"><path d=\"M896 960v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45zm755-672q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23z\" style=\"fill: white;\"></path></svg>";
      window.dispatchEvent(new Event('resize'));
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
      newControl.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-container\"><path d=\"M883 1056q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23zm781-864v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45z\" style=\"fill: white;\"></path></svg>";

      if (!initialTheatreMode) {
        original.click();
      }

      window.dispatchEvent(new Event('resize'));
    }

    function createControl() {
      var original = document.getElementsByClassName("ytp-size-button")[0];
      var copy = original.cloneNode(true);

      original.id = "original-size";
      copy.id = "full-size";

      var controls = document.getElementsByClassName("ytp-right-controls")[0];
      var newControl = controls.insertBefore(copy, original);

      newControl.title = "Full Browser Mode";
      newControl.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-container\"><path d=\"M883 1056q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23zm781-864v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45z\" style=\"fill: white;\"></path></svg>";

      newControl.addEventListener("click", function() {
        toggleFullBrowser();
      });

      document.body.addEventListener("keyup", function(e) {
        if (e.keyCode == 27 && isFullMode) {
          leaveFullBrowser();
        }

        if (e.target.nodeName == "TEXTAREA" || e.target.nodeName == "INPUT") {
          //Ignore these two types.
        } else {
          if (e.keyCode == 84) {
            toggleFullBrowser();
          }

          if (e.keyCode == 70) {
            toggleIcon();
          }
        }
      });

      var fullScreenButton = document.getElementsByClassName("ytp-fullscreen-button")[0];
      
      fullScreenButton.addEventListener("click", function() {
        toggleIcon();
      })

      controlsCreated = true;
    }

    function toggleIcon() {
      var newControl = document.getElementById("full-size");

      if (isFullScreen) {
        newControl.style.display = "inline-block";
        isFullScreen = false;
      } else {
        newControl.style.display = "none";
        isFullScreen = true;
      }
    }
  }
}());
