const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

// Define constants
const DAYS_TO_KEEP = 95;

// Utility function to calculate the expiration date
function getExpirationDate() {
  const date = new Date();
  date.setDate(date.getDate() - DAYS_TO_KEEP);
  return date;
}

// Function to delete expired records from a given sub-collection
async function deleteExpiredRecords(companyId, subCollectionPath, expirationDate) {
  const batch = db.batch();

  try {
    const expiredRecords = await db.collection(`companies/${companyId}/${subCollectionPath}`)
      .where('date', '<', expirationDate)
      .get();

    if (expiredRecords.empty) {
      console.log(`No expired records found in ${subCollectionPath} for company: ${companyId}`);
      return;
    }

    expiredRecords.forEach((doc) => {
      console.log(`Deleting expired record with ID: ${doc.id} from ${subCollectionPath}`);
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Expired records deleted successfully from ${subCollectionPath} for company: ${companyId}`);
  } catch (error) {
    console.error(`Error deleting expired records from ${subCollectionPath} for company: ${companyId}`, error);
  }
}

// Main scheduled function to delete expired records
exports.autoDeleteExpiredRecords = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const expirationDate = getExpirationDate();

  try {
    // Get all companies
    const companiesSnapshot = await db.collection('companies').get();

    if (companiesSnapshot.empty) {
      console.log('No companies found.');
      return null;
    }

    // Process each company
    const deleteTasks = companiesSnapshot.docs.map(async (companyDoc) => {
      const companyId = companyDoc.id;

      console.log(`Processing company: ${companyId}`);

      // Delete expired records from `leaveRequest`
      await deleteExpiredRecords(companyId, 'leaveRequest', expirationDate);

      // Delete expired records from `otRequest`
      await deleteExpiredRecords(companyId, 'otRequest', expirationDate);
    });

    // Wait for all deletion tasks to complete
    await Promise.all(deleteTasks);

    console.log('All expired records deleted successfully.');
  } catch (error) {
    console.error('Error processing expired records:', error);
  }

  return null;
});
