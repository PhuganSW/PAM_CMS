//userManagement.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Delete user function
exports.deleteUser = functions.https.onCall(async (data, context) => {
    const { uid } = data;
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Must be an admin to delete a user.');
    }
    try {
        await admin.auth().deleteUser(uid);
        return { message: 'User deleted successfully' };
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new functions.https.HttpsError('internal', 'Unable to delete user');
    }
});

// Add admin role function
exports.addAdminRole = functions.https.onCall(async (data, context) => {
    const { uid } = data;
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Must be an admin to assign roles.');
    }
    try {
        await admin.auth().setCustomUserClaims(uid, { admin: true });
        return { message: `Admin role assigned to user with UID: ${uid}` };
    } catch (error) {
        console.error('Error setting admin role:', error);
        throw new functions.https.HttpsError('internal', 'Unable to assign admin role');
    }
});

// Reset user password function
exports.resetUserPassword = functions.https.onCall(async (data, context) => {
    const { uid, newPassword } = data;
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Must be an admin to reset passwords.');
    }
    try {
        await admin.auth().updateUser(uid, { password: newPassword });
        return { message: 'Password reset successfully' };
    } catch (error) {
        console.error('Error resetting password:', error);
        throw new functions.https.HttpsError('internal', 'Unable to reset password');
    }
});
