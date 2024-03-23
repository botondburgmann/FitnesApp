import { DocumentData, DocumentReference, QueryDocumentSnapshot, Unsubscribe, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";


export async function getUserDocumentRef(userID:string):Promise<DocumentReference<DocumentData, DocumentData> | undefined>  {
    try {
        const collectionRef = collection(FIRESTORE_DB, "Users");
        const q = query(collectionRef, where("userID", "==", userID));
        const snapshot = await getDocs(q);
    
        if (snapshot.empty) 
            throw new Error("User doesn't exist");
        
        const userDocRef = doc(FIRESTORE_DB, "Users", snapshot.docs[0].id);
        return userDocRef;
    }   catch (error: any) {
        alert(`Error: Couldn't fetch document reference: ${error.message}`)
    }
}

export async function getUserDocument(userID:string): Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | undefined>{
    try {
        const collectionRef = collection(FIRESTORE_DB, "Users");
        const q = query(collectionRef, where("userID", "==", userID) );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) 
            throw new Error("User doesn't exist");
        
        const userDocs = snapshot.docs[0];
        return userDocs;
    }   catch (error: any) {
        alert(`Error: Couldn't fetch document for user: ${error.mssage}`)    
    }
            
}

export async function getWorkoutDocs(userID:string, date: Date): Promise<QueryDocumentSnapshot<DocumentData, DocumentData> | undefined>{    
    try {        
        const collectionRef = collection(FIRESTORE_DB, "Workouts");
        const q = query(collectionRef, where("date", "==", date.toDateString()), where("userID", "==", userID) );
        const snapshot = await getDocs(q);

        if (snapshot.empty) return;
        
        const workoutDocs = snapshot.docs[0];        
        return workoutDocs;
    } catch (error: any) {
        alert(`Error: Couldn't fetch document for workout: ${error.message}`)
    }
}


export function getUser (userID:string | null, callback: Function): Unsubscribe | undefined  {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const unsubscribeFromUsers = onSnapshot(usersQuery, usersSnapshot => {
            if (usersSnapshot.empty) throw new Error("User doesn't exist");
        
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
        })
    
        return unsubscribeFromUsers;
    } catch (error: any) {
        alert(`Error: Couldn't fetch user: ${error}`)
    }
}

export async function updateAchievement(userID:string, achievementName: string, level: number) {
    try {
        const achievementsCollectionRef = collection(FIRESTORE_DB, "Achievements");
        const q = query(achievementsCollectionRef, where("name", "==", achievementName));
        const achievementsSnapshot = await getDocs(q);
        const achievementDoc = achievementsSnapshot.docs[0];
        
        const statuses = achievementDoc.data().statuses
        for (let i = 0; i < statuses.length; i++) {
            if (statuses[i].userIDs.includes(userID) && i >= level) return;  

            if (statuses[i].userIDs.includes(userID) && i < level) {
                const removedUserIds: string[] = statuses[i].userIDs.filter((currentUserID: string) => currentUserID !== userID );

                const updatedUserIDs = [...statuses[level].userIDs,userID];

                const updatedStatuses:{name: string, userIDs: string[]}[] = statuses.map((item:{name: string, userIDs: string[]}, index: number) =>
                    index === i ? 
                        {name: item.name, userIDs: removedUserIds}     
                    : index === level ? 
                        {name: item.name, userIDs: updatedUserIDs} 
                        : item
                );   
                
                alert(`New achievement unlocked: ${achievementName}: ${statuses[level].name}`);
                const updatedAchievementDoc = {
                    statuses: updatedStatuses
                };
                updateDoc(achievementDoc.ref, updatedAchievementDoc);
            }

        }

    }   catch (error: any) {
        alert(`Error: Couldn't update achievement: ${error.message}`);
        
    }
    
}