const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Import and export other modules
const { deleteUser, addAdminRole, resetUserPassword } = require('./src/userManagement');
//const { autoDeleteExpiredRecords } = require('./src/adminTools');

exports.deleteUser = deleteUser;
exports.addAdminRole = addAdminRole;
exports.resetUserPassword = resetUserPassword;
//exports.autoDeleteExpiredRecords = autoDeleteExpiredRecords;
