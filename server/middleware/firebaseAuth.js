const admin = require('firebase-admin');

// Initialize Firebase Admin only if credentials are provided
if (admin.apps.length === 0) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  console.log('Checking Firebase Config:');
  console.log('- Project ID:', projectId ? 'Found' : 'MISSING');
  console.log('- Client Email:', clientEmail ? 'Found' : 'MISSING');
  console.log('- Private Key:', privateKey ? 'Found' : 'MISSING');

  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
      console.error('❌ Firebase Admin initialization FAILED:', error.message);
    }
  } else {
    console.warn('⚠️ Firebase Admin credentials missing. Social login and verification will not work.');
  }
}

const verifyFirebaseToken = async (req, res, next) => {
  // Check if firebase admin was initialized
  if (admin.apps.length === 0) {
    console.error('Firebase Admin not initialized. Check your environment variables.');
    return res.status(500).json({ message: 'Server configuration error: Firebase not initialized' });
  }

  const token = req.headers.authorization?.split('Bearer ')[1] || req.body.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { verifyFirebaseToken };
