import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from './upload.js'


const firebaseConfig = {
    apiKey: "AIzaSyBevDtTtw6K6P9GArdVaYzuwXWIpzdTHRw",
    authDomain: "plugin-uppic.firebaseapp.com",
    projectId: "plugin-uppic",
    storageBucket: "plugin-uppic.appspot.com",
    messagingSenderId: "750499894864",
    appId: "1:750499894864:web:b48604b785210b30fe6355"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const storage = firebase.storage()

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`)
            const task = ref.put(file)

            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error)
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download URL', url)
                })
            })
        })
    }
})
