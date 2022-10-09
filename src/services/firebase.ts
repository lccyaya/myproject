const firebaseConfig = {
  apiKey: "AIzaSyB1z3JM66HHmVfCkxeFdZtb-Pdsgq8M0Q8",
  authDomain: "football-master-311805.firebaseapp.com",
  projectId: "football-master-311805",
  storageBucket: "football-master-311805.appspot.com",
  messagingSenderId: "328500312724",
  appId: "1:328500312724:web:de5870fb36ae0b88305281",
  measurementId: "G-9RNLQX23W2"
};

const vapidKey = 'BAeScCu1-Q9p0J_s80R5iZEoMViOIsZny-oVMfnfWRAlIGfgP3I7WcwZRMwSTg5PRTN8RK2_bxoFKSU1ZEuz_to';

export async function importFirebaseMessaging() {
  try {
    return await import('firebase/messaging');
  } catch (e) {
    console.error('importFirebaseMessaging failed:', e);
  }
  return undefined;
}

export async function importFirebaseApp() {
  try {
    return await import('firebase/app');
  } catch (e) {
    console.error('importFirebaseApp failed:', e);
  }
  return undefined;
}

export async function getMsgToken() {
  const firebaseApp = await importFirebaseApp();
  const firebaseMessaging = await importFirebaseMessaging();
  if (!firebaseApp || !firebaseMessaging) {
    return '';
  }
  const { initializeApp } = firebaseApp;
  const { getMessaging, getToken, isSupported } = firebaseMessaging;
  try {
    if (!await isSupported()) return '';
    if (!window.FIREBASE_APP) {
      window.FIREBASE_APP = initializeApp(firebaseConfig);
    }
    if (window.FIREBASE_MESSAGE_TOKEN) {
      return window.FIREBASE_MESSAGE_TOKEN;
    }
    const messaging = getMessaging();
    const token = await getToken(messaging, { vapidKey });
    if (token) {
      window.FIREBASE_MESSAGE_TOKEN = token;
      return token;
    }
  } catch (e) {
    console.error('getToken failed:', e);
  }
  return '';
}
