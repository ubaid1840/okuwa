import admin from 'firebase-admin';

const serviceAccount = process.env.SERVICE_KEY_ACCOUNT; 

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

export default admin;
