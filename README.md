# qube
A modern Vue.js based speedcubing timer

### Hosting Setup
Qube is hosted in an entirely serverless setup using Google Firebase services. The frontend is served via Google Firebase Hosting and times are stored in a Firestore Database using Firebase Authentication. The deployment process to Firebase Hosting is automated using TravisCI.

### Privacy
The only data stored on the Firebase Firestore is your Firebase user ID with your times (those include a record date, the speed and a number of flags). No additional information about the account you signed up with (besides the email address for identification) is stored and accessible by me.
