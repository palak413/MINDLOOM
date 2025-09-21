// Working Media URLs for Testing Meditation Player

// Working Audio URLs (Free, no copyright)
export const testAudioUrls = [
  {
    title: "Test Bell Sound",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    title: "Test Audio Sample", 
    url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"
  },
  {
    title: "Short Audio Test",
    url: "https://file-examples.com/storage/fe68c8b7c95bb67a6b52c91/2017/11/file_example_MP3_700KB.mp3"
  }
];

// Working Video URLs (Free, no copyright)
export const testVideoUrls = [
  {
    title: "Sample Video 1",
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
  },
  {
    title: "Sample Video 2", 
    url: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
  },
  {
    title: "Big Buck Bunny",
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  }
];

// Instructions for user
export const mediaInstructions = `
🎵 MEDITATION MEDIA NOT PLAYING? HERE'S WHY:

🔧 **Common Issues:**
1. **CORS Restrictions**: Some audio/video URLs are blocked by browser security
2. **Invalid URLs**: Placeholder URLs don't contain real media content
3. **Browser Autoplay Policy**: Browsers block autoplay without user interaction

🎯 **Solutions:**

**Option 1: Use Local Media Files**
- Download meditation music/videos to your computer
- Place them in frontend/public/media/ folder
- Update URLs to use local files: "/media/ocean-waves.mp3"

**Option 2: Use Streaming Services**
- YouTube embedded videos (requires iframe)
- Spotify web player integration
- SoundCloud embedded audio

**Option 3: Free Media Libraries**
- Freesound.org (requires account)
- Pixabay Music (free downloads)
- Pexels Videos (free downloads)

**Quick Test:**
The current URLs are placeholders. Click play and check browser console for error messages.
`;

export default {
  testAudioUrls,
  testVideoUrls,
  mediaInstructions
};
