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

// States for scrolling on desktop
var scrollingState = STATE_NOT_SCROLLING;
var STATE_NOT_SCROLLING = 0;
var STATE_SCROLLING = 1;
var hasScrolled = false;

var imageGallery = document.querySelector('.image-gallery');
var pswpElement = document.querySelectorAll('.pswp')[0];

// build items array (images)
// {
//   src: source of the image,
//   w: width of the image,
//   h: height of the image,
//   timing: timestamp in sec when the topic of the video is discussed
// }
var items = [
    {
        src: 'images/image001.jpeg',
        w: 1024,
        h: 576,
        timing: 23
    },
    {
        src: 'images/image002.jpeg',
        w: 1024,
        h: 576,
        timing: 54
    },
    {
        src: 'images/image003.jpeg',
        w: 1024,
        h: 576,
        timing: 62
    },
    {
        src: 'images/image004.jpeg',
        w: 1024,
        h: 576,
        timing: 101
    },
    {
        src: 'images/image005.jpeg',
        w: 1024,
        h: 576,
        timing: 126
    },
    {
        src: 'images/image006.jpeg',
        w: 1024,
        h: 576,
        timing: 146
    },
    {
        src: 'images/image007.jpeg',
        w: 1024,
        h: 576,
        timing: 175
    },
    {
        src: 'images/image008.jpeg',
        w: 1024,
        h: 576,
        timing: 234
    }
];


/* Start main javascript */
// vars
var videoId = "lfIUilgq4qo";
var apiKey = "AIzaSyAzH9gS5uv6jhzeSMp4oGtMrlxH2id_JtE";

// init functions
function init(){
	setViewCount();
  setUpHandlers();
  calulateImageScrollingMode();
}

//set View Count via Youtube API
function setViewCount(){
	//Fetch polyfill via 'bower install fetch'
	//https://github.com/github/fetch
	fetch("https://www.googleapis.com/youtube/v3/videos?part=statistics&id=" +
      videoId + "&key=" + apiKey)
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
				document.querySelector(".view-count").innerHTML =
          viewCount + " Aufrufe";
			}
		});
}
/**
 * Calculate if the image gallery should scroll horizontally or vertically
 */
function calulateImageScrollingMode() {
  // Run asynchronously because `getBoundingClientRect()` may cause some laggs
  // on main thred and block rendering
  new Promise(function(resolve) {
    // The bounds of the main area
    var mainBounds = document.querySelector('main').getBoundingClientRect();
    // Bounds of the video
    var youtubeBounds = document.querySelector('main .yt-container')
      .getBoundingClientRect();
    // The height of the info section (view count, fav button). Has fixed height
    var infoHeight = 86;
    var image = imageGallery.querySelector('img');
    // Bounds of one image (on page load width is unfortuately 0, so I use 500)
    var imageBounds = image.getBoundingClientRect();
    if ((mainBounds.height - youtubeBounds.height - infoHeight)
          >= imageBounds.height * 1.5 && mainBounds.width >= 1000) {
      // CSS properties for vertical scrolling
      imageGallery.classList.add('vertical-scrolling');
    } else {
      imageGallery.classList.remove('vertical-scrolling');
    }
    // Notify the Promise was successfull and is finished
    resolve();
  });
}

//register eventhandlers
function setUpHandlers() {
  imageGallery.addEventListener('mousedown',
      onImageGalleryDown); // desktop scrolling
  imageGallery.addEventListener('click',
      onImageGalleryClick); // image to fullscreen
  imageGallery.addEventListener('keypress',
      onImageGalleryClick); // Listen especially for Space and/or Enter
  window.addEventListener('resize',
      calulateImageScrollingMode); // incase of screen resize recalculations
}

// scrolling on desktop
function onImageGalleryDown(e) {
  scrollingState = STATE_SCROLLING;
  // Track if mousedown was for a click or a drag
  hasScrolled = false;
  // Listener to set the new scrolling position
  imageGallery.addEventListener('mousemove', onImageGalleryMove);
  // Listener when to change scrolling state,
  // `once: true` that you don't have to unregister from the mouseup event
  window.addEventListener('mouseup', onImageGalleryUp, {once: true});
}
//move the image gallery on desktop
function onImageGalleryMove(e) {
  // The movement in x direction since the last event
  var dX = e.movementX;
  // If cursor has ever moved, remember that user has scrolled
  if (Math.abs(dX) > 0) hasScrolled = true;
  // Update scrolling postition
  imageGallery.scrollLeft -= dX;
}
//removal of desktop scrolling eventlistener
function onImageGalleryUp(e) {
  // Unregister from mousemove events, because user isn't dragging anymore
  imageGallery.removeEventListener('mousemove', onImageGalleryMove);
}
//toggle fullscreen image view
function onImageGalleryClick(e) {
  // Check if event was a KeyboardEvent and click was not a `Space` or `Enter`
  if (e instanceof KeyboardEvent && !(e.key === ' ' || e.key === 'Enter'))
    return;
  // Get all children from the image gallery
  var children = [].slice.call(imageGallery.children);
  // Get the index of the clicked child
  var index = children.indexOf(e.target.parentNode);
  // Check if the target's parentNode was not the `.image-container`
  if (index === -1)
    // The target's parentNode was the button
    // So walk the DOM tree on node further up
    index = children.indexOf(e.target.parentNode.parentNode);
  //abort click if click was scrolling
  if (hasScrolled) return;
  // If click/KeyboardEvent was performed on the image
  if (e.target.tagName === 'IMG' || (e.target.firstElementChild &&
      e.target.firstElementChild.tagName === 'IMG')) {
    // Initializes and opens PhotoSwipe
    var pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, {
      index: index,
      shareEl: false
    });
    pswp.init();
    // If click/KeyboardEvent was performed on the icon
  } else if (e.target.tagName === 'I' ||
             e.target.firstElementChild.tagName === 'I') {
    // Get timing of the image
    var timing = items[index].timing;
    // Jump to the predefined timestamp for that image
    player.seekTo(timing, true);
  }
}

// start init
init();
