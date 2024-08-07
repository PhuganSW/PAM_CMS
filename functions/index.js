/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.deleteUser = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const uid = data.uid;

  return admin.auth().deleteUser(uid)
    .then(() => {
      return { message: `Successfully deleted user with UID: ${uid}` };
    })
    .catch((error) => {
      throw new functions.https.HttpsError('unknown', `Error deleting user: ${error.message}`);
    });
});

exports.resetUserPassword = functions.https.onCall(async (data, context) => {
  const { uid, newPassword } = data;

  try {
      // Ensure the request is authenticated
      if (!context.auth) {
          throw new functions.https.HttpsError(
              'failed-precondition',
              'The function must be called while authenticated.'
          );
      }

      // Update the user's password
      await admin.auth().updateUser(uid, { password: newPassword });

      return { message: 'Password reset successful' };
  } catch (error) {
      console.error('Error resetting user password:', error);
      throw new functions.https.HttpsError('unknown', error.message, error);
  }
});
