import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const firestore = admin.firestore();

export const resetFieldOnMonday = functions.pubsub
  .schedule("every monday 00:00")
  .timeZone("UTC")
  .onRun(async (_) => {
    try {
      const collectionRef = firestore.collection("Users");
      const documents = await collectionRef.get();

      const batch = firestore.batch();

      documents.forEach((doc) => {
        const docRef = collectionRef.doc(doc.id);
        batch.update(docRef, {weeklyExperience: 0});
      });

      await batch.commit();

      console.log("Field reset to 0 on Monday.");

      return null;
    } catch (error) {
      console.error("Error resetting field:", error);
      return null;
    }
  });
