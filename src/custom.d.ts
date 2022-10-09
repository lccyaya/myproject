declare module '*.mp4' {
  const src: string;
  export default src;
}

interface Window {
  FIREBASE_APP?: any;
  FIREBASE_MESSAGE_TOKEN?: string;
}
