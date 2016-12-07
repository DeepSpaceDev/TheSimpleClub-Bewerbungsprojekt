//Copyright design
var styles = ['background: #3f51b5',
    'color: white',
    'display: block',
    'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)',
    'box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);',
    'line-height: 40px',
    'text-align: center',
    'font-weight: bold',
    'padding: 10px',
    'font-family: "Source Code Pro", sans-serif',
    'font-size: 17px'
	].join(';');
console.info("%c Copyright 2016 DeepSpace Development", styles);

var scrollingState = STATE_NOT_SCROLLING;
var STATE_NOT_SCROLLING = 0;
var STATE_SCROLLING = 1;
var hasScrolled = false;

var pswpElement = document.querySelectorAll('.pswp')[0];

// build items array
var items = [
    {
        src: 'images/image001.jpeg',
        w: 600,
        h: 400,
        timing: 23
    },
    {
        src: 'images/image002.jpeg',
        w: 600,
        h: 400,
        timing: 54
    },
    {
        src: 'images/image003.jpeg',
        w: 600,
        h: 400,
        timing: 62
    },
    {
        src: 'images/image004.jpeg',
        w: 600,
        h: 400,
        timing: 101
    },
    {
        src: 'images/image005.jpeg',
        w: 600,
        h: 400,
        timing: 126
    },
    {
        src: 'images/image006.jpeg',
        w: 600,
        h: 400,
        timing: 146
    },
    {
        src: 'images/image007.jpeg',
        w: 600,
        h: 400,
        timing: 175
    },
    {
        src: 'images/image008.jpeg',
        w: 600,
        h: 400,
        timing: 234
    }
];

var imageGallery = document.querySelector('.image-gallery');

/* Start main javascript */
//vars
var videoId = "lfIUilgq4qo";
var apiKey = "AIzaSyAzH9gS5uv6jhzeSMp4oGtMrlxH2id_JtE";

//functions
function init(){
	setViewCount();
  setUpHandlers();
  calulateImageScrollingMode();
}

function setViewCount(){
	//Fetch polyfill via 'bower install fetch'
	//https://github.com/github/fetch
	fetch("https://www.googleapis.com/youtube/v3/videos?part=statistics&id=" + videoId + "&key=" + apiKey)
		.then(function(response){
			//Parse to json
			return response.json();
		}).then(function(json) {
		    //json format provided by youtube api
		    //https://developers.google.com/apis-explorer/#p/youtube/v3/
		    var viewCount = json["items"][0]["statistics"]["viewCount"];

			//Check if apicall was successfull
			if(viewCount !== undefined){
				//update the view count for user
				document.querySelector(".view-count").innerHTML = viewCount + " Aufrufe";
			}
		});
}

function calulateImageScrollingMode() {
  new Promise(function(resolve) {
    var mainBounds = document.querySelector('main').getBoundingClientRect();
    var youtubeBounds = document.querySelector('main .yt-container')
      .getBoundingClientRect();
    var infoHeight = 86;
    var image = imageGallery.querySelector('img');
    var imageBounds = image.getBoundingClientRect();
    if ((mainBounds.height - youtubeBounds.height - infoHeight)
          >= imageBounds.height * 1.5) {
      imageGallery.classList.add('vertical-scrolling');
    } else {
      imageGallery.classList.remove('vertical-scrolling');
    }
    resolve();
  });
}

function setUpHandlers() {
  imageGallery.addEventListener('mousedown', onImageGalleryDown);
  imageGallery.addEventListener('click', onImageGalleryClick);
  imageGallery.addEventListener('keypress', onImageGalleryClick);
  window.addEventListener('resize', calulateImageScrollingMode);
}

function onImageGalleryDown(e) {
  scrollingState = STATE_SCROLLING;
  hasScrolled = false;
  imageGallery.addEventListener('mousemove', onImageGalleryMove);
  window.addEventListener('mouseup', onImageGalleryUp, {once: true});
}

function onImageGalleryMove(e) {
  var dX = e.movementX;
  if (Math.abs(dX) > 0) hasScrolled = true;
  imageGallery.scrollLeft -= dX;
}

function onImageGalleryUp(e) {
  imageGallery.removeEventListener('mousemove', onImageGalleryMove);
}

function onImageGalleryClick(e) {
  if (e instanceof KeyboardEvent && !(e.key === ' ' || e.key === 'Enter'))
    return;
  var children = [].slice.call(imageGallery.children);
  var index = children.indexOf(e.target.parentNode);
  if (hasScrolled) return;
  if (e.target.tagName === 'IMG' ||
      e.target.firstElementChild.tagName === 'IMG') {
    // Initializes and opens PhotoSwipe
    var pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, {
      index: index,
      shareEl: false
    });
    pswp.init();
  } else if (e.target.tagName === 'I' ||
             e.target.firstElementChild.tagName === 'I') {
    var timing = items[index].timing;
    player.seekTo(timing, true);
  }
}

// start init
init();
