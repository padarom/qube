import * as Firebase from 'firebase/app'
import 'firebase/firestore'

function initFirebase () {
    Firebase.initializeApp({
        apiKey: 'AIzaSyBykYa61kZAhjQTmUUYjLIVN7UvUeYfXrc',
        authDomain: 'qube-timer.firebaseapp.com',
        databaseURL: 'https://qube-timer.firebaseio.com',
        projectId: 'qube-timer',
        storageBucket: 'qube-timer.appspot.com',
        messagingSenderId: '155102122747',
        timestampsInSnapshots: true
    })

    return new Promise((resolve, reject) => {
        Firebase.firestore().enablePersistence()
            .then(resolve)
            .catch(err => {
                if (err.code === 'failed-precondition') {
                    reject(err)
                } else if (err.code === 'unimplemented') {
                    reject(err)
                }
            })
    })
}

export { Firebase, initFirebase }
