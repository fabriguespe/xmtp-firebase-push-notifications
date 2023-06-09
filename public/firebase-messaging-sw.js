importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6zKD5-mGA5agzgv2oyQfCihzsoZ9t9Z8",
  authDomain: "xmtp-web.firebaseapp.com",
  projectId: "xmtp-web",
  storageBucket: "xmtp-web.appspot.com",
  messagingSenderId: "847135391532",
  appId: "1:847135391532:web:8043a2c7d076957e2bb689",
  measurementId: "G-LCVXYFVFQ0",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = { body: payload.notification.body };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
