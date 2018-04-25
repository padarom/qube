# qube
A modern Vue.js based speedcubing timer.

## Roadmap
The following features are currently planned for implementation.
- [ ] Support for different puzzles and competitions
- [ ] Scrambler for WCA puzzles
- [ ] History and statistics
- [ ] Stackmat support

The timer is supposed to be minimalistic and clutter-free, so many features on some desktop based timing applications cannot be reasonably implemented.

### Hosting Setup
Qube is hosted in an entirely serverless setup using Google Firebase services. The frontend is served via Google Firebase Hosting and times are stored in a Firestore Database using Firebase Authentication. The deployment process to Firebase Hosting is automated using TravisCI.

