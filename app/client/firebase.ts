const firebaseConfig = {
    apiKey: import.meta.env.VITE_ENV_APIKEY,
    authDomain: import.meta.env.VITE_ENV_AUTHDOMAIN,
    projectId: import.meta.env.VITE_ENV_PROJECTID,
    storageBucket: import.meta.env.VITE_ENV_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_ENV_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_ENV_APPID,
    measurementId: import.meta.env.VITE_ENV_MEASUREMENTID
};

export default firebaseConfig;