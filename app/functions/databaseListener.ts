import { collection, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";

const listenToDatabaseChanges = (collectionName, callback) => {
  const collectionRef = collection(FIRESTORE_DB, collectionName);

  const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
    // Callback function to handle changes (e.g., set a state variable)
    callback(true);
  });

  return unsubscribe; // Return the unsubscribe function to stop listening when necessary
};

export default listenToDatabaseChanges;
