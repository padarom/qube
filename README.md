# qube
A modern Vue.js based speedcubing timer

### Hosting Setup
Qube is hosted in a serverless setup. The frontend is served via Netlify and times are stored in Firebase using Firebase Authentication. The deployment process is completely automated thanks to the Netlify hosting and happens on each commit in this repository.

### Privacy
The only data stored on the Firebase Firestore is your Firebase user ID with your times (those include a record date, the speed and a number of flags). No additional information about the account you signed up with (besides the email address for identification) is stored and accessible by me.
