document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems);
  });

const videoElement = document.getElementById('videoPlayer');

// Initialize Shaka Player
const player = new shaka.Player(videoElement);

// Configure Shaka Player for adaptive streaming
player.configure({
  streaming: {
    bufferingGoal: 30,  // Buffer for 30 seconds ahead
  },
});

// Load the manifest file
player.load('./videos/manifest.mpd')  // or .m3u8 for HLS
.then(() => {
  // Video loaded successfully
  console.log('Video loaded');
    player.setTextTrackVisibility(true);
})
.catch((error) => {
  // Error loading video
  console.error('Error loading video:', error);
});

function changeVideoLanguage() {
  const selector = document.getElementById('languageSelector');
  const selectedValue = selector.options[selector.selectedIndex].value;

  var audioTracks = player.getAudioTracks();
  var track = audioTracks[selectedValue];
  player.selectAudioTrack(track);
}

// Function to change video quality based on dropdown selection
function changeVideoQuality() {
  const selector = document.getElementById('qualitySelector');
  const selectedValue = selector.options[selector.selectedIndex].value;

  if (selectedValue === '0') {
    // Set quality to auto (adaptive)
    player.configure({
      streaming: {
        abr: {
          enabled: true,
        },
      },
    });
  } else {
    // Set a specific quality
    player.configure({
      streaming: {
        abr: {
          enabled: false,
        },
      },
    });
    
    var tracks = player.getVariantTracks();
    // Manually select quality
    const selectedTrack = tracks[selectedValue];
    player.selectVariantTrack(selectedTrack, /* clearBuffer */ true);
  }
}