importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-messaging.js');
firebase.initializeApp({
  'messagingSenderId': '456165973999'
});

if (firebase.messaging.isSupported()) {
  // Notifications supported! Yay!
  const messaging = firebase.messaging();
}
