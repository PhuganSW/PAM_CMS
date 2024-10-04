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

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Define a callable function to delete a user by UID
exports.deleteUser = functions.https.onCall(async (data, context) => {
    const { uid } = data;

    // Only allow authenticated users with admin privileges to delete users
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Must be an administrative user to delete a user.');
    }

    try {
        await admin.auth().deleteUser(uid);
        return { message: 'User deleted successfully' };
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new functions.https.HttpsError('internal', 'Unable to delete user');
    }
});

exports.addAdminRole = functions.https.onCall(async (data, context) => {
    const uid = data.uid;

    // Only allow authenticated users with admin privileges to set admin roles
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Must be an administrative user to assign roles.');
    }

    try {
        // Set the custom admin claim
        await admin.auth().setCustomUserClaims(uid, { admin: true });
        return { message: `Admin role assigned to user with UID: ${uid}` };
    } catch (error) {
        console.error('Error setting admin claim:', error);
        throw new functions.https.HttpsError('internal', 'Unable to assign admin role');
    }
});

exports.resetUserPassword = functions.https.onCall(async (data, context) => {
    const { uid, newPassword } = data;

    // Check if the requester is authenticated and has admin privileges
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Must be an administrative user to reset passwords.');
    }

    try {
        await admin.auth().updateUser(uid, { password: newPassword });
        return { message: 'Password reset successfully' };
    } catch (error) {
        console.error('Error resetting password:', error);
        throw new functions.https.HttpsError('internal', 'Unable to reset password');
    }
});
