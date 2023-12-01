import { DocumentData, DocumentReference, QueryDocumentSnapshot, Unsubscribe, addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import {   Achievement } from "../types and interfaces/types";



export const updateAchievementStatus =async (userID:string | null, updatedAchievement: Achievement): Promise<void> => {
    try {
        const achievementsCollectionRef = collection(FIRESTORE_DB, "Achievements");
        const achievementsSnapshot = await getDocs(achievementsCollectionRef);
        for (const achievementDoc of achievementsSnapshot.docs) {
            const owners = achievementDoc.data().owners;
            for (let i = 0; i < owners.length; i++) {
                if (owners[i].userID === userID && owners[i].level < updatedAchievement.level && achievementDoc.data().name === updatedAchievement.name){
                    const updatedOwner = {
                        color: updatedAchievement.color,
                        description: updatedAchievement.description,
                        level: updatedAchievement.level,
                        status: updatedAchievement.status,
                        userID: userID,
                        visibility: updatedAchievement.visibility
                    };
                    owners[i] = updatedOwner;
                    alert(`New achievement unlocked: ${updatedAchievement.name}: ${updatedAchievement.status}`);
                    const updatedAchievementDoc = {
                        owners: owners
                    }
                    await updateDoc(achievementDoc.ref, updatedAchievementDoc);
                }            
            }
        }
    } catch (error: any) {
        alert(`Errror: Couldn't update achievement status: ${error}`)
    }
}


export async function initializeExercisesForUser(userDocRef: DocumentReference<DocumentData, DocumentData>) {
    try {
        const exercisesCollectionRef = collection(FIRESTORE_DB, "Exercises");
        const exercisesQuerySnapshot = await getDocs(exercisesCollectionRef);
        exercisesQuerySnapshot.forEach(async (exerciseDoc) => {
            const exerciseData = exerciseDoc.data();
            const userSubcollectionRef = collection(userDocRef, "exercises");
            await addDoc(userSubcollectionRef, exerciseData);
        })
    } catch (error) {
        
    }
}

export async function getUserDocumentRef(userID:string):Promise<DocumentReference<DocumentData, DocumentData> | undefined>  {
    const collectionRef = collection(FIRESTORE_DB, "Users");
    const q = query(collectionRef, where("userID", "==", userID));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        const userDocRef = doc(FIRESTORE_DB, "Users", snapshot.docs[0].id);
        return userDocRef;
    }
}


export async function getWorkoutDocs(userID:string, date: Date): Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | undefined>{    
    const collectionRef = collection(FIRESTORE_DB, "Workouts");

    const q = query(collectionRef, where("date", "==", date.toDateString()), where("userID", "==", userID) );
    const snapshot = await getDocs(q);
    if (!snapshot.empty){
        const workoutDocs = snapshot.docs[0]; 
               
        return workoutDocs;
    }        
}
export async function getUserDocs(userID:string): Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | undefined>{
    const collectionRef = collection(FIRESTORE_DB, "Users");
    const q = query(collectionRef, where("userID", "==", userID) );
    const snapshot = await getDocs(q);
    if (!snapshot.empty){
        const userDocs = snapshot.docs[0];
        return userDocs;
    }        
}

export function getUser (userID:string | null, callback: Function): Unsubscribe | undefined  {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const unsubscribeFromUsers = onSnapshot(usersQuery, usersSnapshot => {
            if (!usersSnapshot.empty) {
                const userDoc = usersSnapshot.docs[0];
                const userData = {
                    activityLevel:  userDoc.data().activityLevel,
                    dateOfBirth:  userDoc.data().dateOfBirth,
                    experience:  userDoc.data().experience,
                    gender:  userDoc.data().gender,
                    height:  userDoc.data().height,
                    level:  userDoc.data().level,
                    name:  userDoc.data().name,
                    userID: userDoc.data().userID,
                    weeklyExperience: userDoc.data().weeklyExperience,
                    weight:  userDoc.data().weight
                };
    
                callback(userData);
            }
        })
    
        return unsubscribeFromUsers;
    } catch (error: any) {
        alert(`Error: Couldn't fetch user: ${error}`)
    }
  };