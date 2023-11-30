import { DocumentData, DocumentReference, QueryDocumentSnapshot, Unsubscribe, addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import {validateExerciseSet, validateExperience } from "./validations";
import { MaxValueAndIndex, BestExercise, Exercise, ExerciseLog, ExerciseRecords, MyUser, Achievement, SetChange, WeekRange } from "../types and interfaces/types";


// getters
export const getSetUpValue = async (userID: string): Promise<boolean | undefined> => {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const usersSnapshot = await getDocs(usersQuery);
        const userDoc = usersSnapshot.docs[0];
        return userDoc.data().set;
    } 
    catch (error: any) {
        alert(`Error: Couldn't find set field: ${error.message}`);
    }
};

export const getBestExercise = (userID: string | null, field:string, secondaryField:string, callback: Function ): Unsubscribe | undefined=> {
    try {
        const bestExercise: BestExercise = {
            name: "",
            weights: 0,
            reps: 0
        };
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
        const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
        const unsubscribeFromWorkouts = onSnapshot(workoutsQuery, (snapshot) => {
            if (!snapshot.empty) {
                snapshot.docs.forEach((doc) => {
                    const workoutData = doc.data().Workout;
        
                    if (workoutData) {
                        workoutData.forEach((exercise: Exercise) => {
                            const maxField = getMaxValueAndIndexOfArray(exercise[field]);
                            const maxSecondaryField = getMaxValueAndIndexOfArray(exercise[secondaryField]);
                                if (maxField !== undefined && maxField.value > bestExercise[field]) {
                                    bestExercise[field] = maxField.value;
                                    bestExercise.name = exercise.exercise[maxField.index];
                                    bestExercise[secondaryField] = exercise[secondaryField][maxField.index];
                                } else if (maxField !== undefined && maxSecondaryField !== undefined && maxField.value === bestExercise[field] && maxSecondaryField.value > bestExercise[secondaryField]) {
                                    bestExercise[secondaryField] = maxSecondaryField.value;
                                    bestExercise.name = exercise.exercise[maxSecondaryField.index];
                                    bestExercise[field] = exercise[field][maxSecondaryField.index];
                                }
                            
                        });
                    }
                });
                callback(bestExercise)
            }
        });
    
        return unsubscribeFromWorkouts;
    } catch (error: any) {
        alert(`Error: Couldn't fetch best exercises for ${field}: ${error}`)
    }
};

export const getAllExercises = (userID: string | null, callback: Function): Unsubscribe[] | undefined => {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const unsubscribeFunctions = [];
        const unsubscribeFromUsers = onSnapshot(usersQuery, usersSnapshot => {
            if (!usersSnapshot.empty) {
                const userDocRef = usersSnapshot.docs[0].ref;
                const exercisesCollectionRef = collection(userDocRef, "exercises");

                const unsubscribeFromExercises = onSnapshot(exercisesCollectionRef, exercisesSnapshot => {
                    const updatedExercises = exercisesSnapshot.docs.map(exerciseDoc => ({
                        hidden: exerciseDoc.data().hidden,
                        isometric: exerciseDoc.data().isometric,
                        name: exerciseDoc.data().name,
                        musclesWorked: exerciseDoc.data().musclesWorked,
                        unilateral: exerciseDoc.data().unilateral
                    }));
                
                    callback(updatedExercises);
                });
                

                
                unsubscribeFunctions.push(unsubscribeFromExercises);
                
            } else {
                throw new Error("User doesn't exist");
            }
        });

        unsubscribeFunctions.push(unsubscribeFromUsers);
        return unsubscribeFunctions;

    } catch (error: any) {
        alert(`Error: Couldn't fetch exercises: ${error}`);
    }
};

export const getAvailableExercises = (userID: string | null, callback: Function): Unsubscribe | undefined => {
    try {
        const exercises: Exercise[] = [];
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        
        const unsubscribeFromUsers = onSnapshot(usersQuery, usersSnapshot => {
            if (!usersSnapshot.empty) {
                const userDocRef = usersSnapshot.docs[0].ref;
                const exercisesCollectionRef = collection(userDocRef, "exercises");
                const exercisesQuery = query(exercisesCollectionRef, where("hidden", "==", false));
                const unsubscribeFromExercises = onSnapshot(exercisesQuery, exercisesSnapshot => {
                    exercisesSnapshot.docs.forEach(exerciseDoc => {
                        exercises.push({
                            hidden: exerciseDoc.data().hidden,
                            isometric: exerciseDoc.data().isometric,
                            name: exerciseDoc.data().name,
                            musclesWorked: exerciseDoc.data().musclesWorked,
                            unilateral: exerciseDoc.data().unilateral
                        })
                    }) 
                    callback(exercises);                   
                })
                unsubscribeFromExercises;
            }
            else 
                throw new Error("user doesn't exist");
        })
        return unsubscribeFromUsers;
    } catch (error: any) {
        alert(`Error: Couldn't fetch exercises: ${error}`)
    }
};

export const getExercise = (userID: string | null, exerciseName: string, callback: Function): Unsubscribe | undefined=> {
    try {
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");    
        const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
    
        const unsubscribeFromWorkouts = onSnapshot(workoutsQuery, workoutSnapshot => {
            const exerciseRecords: ExerciseRecords = {
                weights: [],
                reps: [],
                times: [],
                dates: [],
            }
            if (!workoutSnapshot.empty) {
                workoutSnapshot.docs.forEach(workoutDoc => {
                    for (let i = 0; i < workoutDoc.data().Workout.length; i++) {
                        let set = workoutDoc.data().Workout[i];                    
                        for (let j = set.exercise.length-1; j >= 0 ; j--)
                            if (set.exercise[j] === exerciseName) {                            
                                exerciseRecords.weights.push(set.weights[j])
                                exerciseRecords.reps.push(set.reps[j])
                                exerciseRecords.times.push(set.times[j])
                                exerciseRecords.dates.push(workoutDoc.data().date)
                            }
                    }
                })
                            
            }
            callback(exerciseRecords);    
        })
        return unsubscribeFromWorkouts;
    } catch (error: any) {
        alert(`Error: Couldn't fetch data for ${exerciseName}: ${error} `)
    }
};

export const getExercisesByFocus = (userID: string | null, musclesWorked: string[], callback: Function): Unsubscribe | undefined => {
    try {
        const exercises: Exercise[] = [];
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        
        const unsubscribeFromUsers = onSnapshot(usersQuery, usersSnapshot => {
            if (!usersSnapshot.empty) {
                const userDocRef = usersSnapshot.docs[0].ref;
                const exercisesCollectionRef = collection(userDocRef, "exercises");
                const exercisesQuery = query(exercisesCollectionRef, where("hidden", "==", false), where("musclesWorked", "array-contains-any", musclesWorked));
                const unsubscribeFromExercises = onSnapshot(exercisesQuery, exercisesSnapshot => {
                    exercisesSnapshot.docs.forEach(exerciseDoc => {
                        exercises.push({
                            hidden: exerciseDoc.data().hidden,
                            isometric: exerciseDoc.data().isometric,
                            name: exerciseDoc.data().name,
                            musclesWorked: exerciseDoc.data().musclesWorked,
                            unilateral: exerciseDoc.data().unilateral
                        })
                    }) 
                    callback(exercises);                   
                })
                unsubscribeFromExercises;
            }
            else 
                throw new Error("user doesn't exist");
        })
        return unsubscribeFromUsers;
        
    } catch (error: any) {
        alert(`Error: couldn't fetch exercises for ${[...musclesWorked]}: ${error.message}`);
    }
};

export const getUser = (userID:string | null, callback: Function): Unsubscribe | undefined => {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const unsubscribeFromUsers = onSnapshot(usersQuery, usersSnapshot => {
            if (!usersSnapshot.empty) {
                const userDoc = usersSnapshot.docs[0];
                const userData = {
                    activityLevel:  userDoc.data().activityLevel,
                    age:  userDoc.data().age,
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
export const getAllUsers = (callback: Function): Unsubscribe | undefined => { 
    try {    
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const unsubscribeFromUsers = onSnapshot(usersCollectionRef, usersSnapshot => {
            const users: DocumentData[] = [];
            usersSnapshot.docs.forEach(usersDoc => {
                users.push(usersDoc.data())
            })        
            callback(users);    
        })
        return unsubscribeFromUsers;
    } catch (error: any) {
        alert(`Error: Couldn't fetch users: ${error}`)
    }
};



export const getAchievementsForUser = (userID: string, callback: Function): Unsubscribe  | undefined => {
    try {
        const achievements: Achievement[] = [];

        const achievementsCollectionRef = collection(FIRESTORE_DB, "Achievements");
        const unsubscribeFromAchievements = onSnapshot(achievementsCollectionRef, achievementsSnapshot => {
            if (!achievementsSnapshot.empty) {
                achievementsSnapshot.docs.forEach(achievementDoc => {
                    for (const owner of achievementDoc.data().owners) {
                        if (owner.userID === userID) {
                            const achievement = {
                                color: owner.color,
                                description: owner.description,
                                icon: achievementDoc.data().icon,
                                level: owner.level,
                                name: achievementDoc.data().name,
                                status: owner.status,
                                visibility: owner.visibility
                            };
                            achievements.push(achievement);
                        }
                        
                    }
                }) 
                callback(achievements)
            }
        })
        return unsubscribeFromAchievements;
    } catch (error: any) {
        alert(`Error: couldn't fetch achievements for ${userID}: ${error}`);
    }
};

// setters

export const addSet =async (userID:string | null, date: string, set: ExerciseLog, xpToAdd: number, week: WeekRange): Promise<void> => {
    
}

export const toggleExerciseVisibilty =async (userID: string | null, exerciseName: string): Promise<void> => {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const usersSnapshot = await getDocs(usersQuery);
        const userDoc = usersSnapshot.docs[0];

        const exercisesCollectionRef = collection(userDoc.ref, "exercises");
        const exercisesQuery = query(exercisesCollectionRef, where("name", "==", exerciseName));
        const exercisesSnapshot = await getDocs(exercisesQuery);
        exercisesSnapshot.docs.forEach((exercisesDoc) => {
            const updateData = {
                hidden: !exercisesDoc.data().hidden
            };
            
            updateDoc(exercisesDoc.ref, updateData);
        })

    } catch (error: any) {
        alert(`Error: Couldn't change visibility for ${exerciseName}: ${error.message}`)
    }
};


export const createNewExercise = async (userID: string, name: string, isUnilateral: boolean, isIsometric: boolean): Promise<void> => {
    try {  
        const usersCollectionRef = collection(FIRESTORE_DB, "Users" )
        const usersQuery = query(usersCollectionRef,where("userID", "==", userID))
        const usersSnapshot = await getDocs(usersQuery);
        const usersDoc = usersSnapshot.docs[0];
        const exercisesCollectionRef = collection(usersDoc.ref, "exercises");
        await addDoc(exercisesCollectionRef, {
            hidden: false,
            isometric: isIsometric,
            name: name,
            unilateral: isUnilateral
        });   
    } 
    catch (error: any) {
        alert(`Error: Couldn't create exercise: ${error.message}`);
    }
};


export const resetWeeklyExperience = async (userID:string): Promise<void> => {
    try {
        const usersCollection = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollection, where("userID", "==", userID));
        const usersSnapshot = await getDocs(usersQuery);
        const usersDoc = usersSnapshot.docs[0];
        const updateData = {
            weeklyExperience: 0
        };
        updateDoc(usersDoc.ref, updateData);
    }
    catch (error: any) {
        alert(`Error: couldn't reset weekly experience:  ${error}`);
    }
};

export const editProfile = async (userID:string | null, changes: MyUser): Promise<void> => {
    try {  
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");    
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const usersSnapshot = await getDocs(usersQuery);
        const usersDoc = usersSnapshot.docs[0];
        const updateData = {
            name : changes.name,
            age: changes.age,
            gender: changes.gender,
            weight: changes.weight,
            height: changes.height,
            activityLevel: changes.activityLevel
        };
        updateDoc(usersDoc.ref, updateData);

    } 
    catch (error: any) {
        alert(`Error: couldn't find fields: ${error.message}`);
    }
};



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



const getMaxValueAndIndexOfArray = (array:number[]): MaxValueAndIndex | undefined => {
    try {
        const max = {
            value : 0,
            index: 0
        };
        if (array !== undefined) {
            for (let i = 0; i < array.length; i++)
                if (array[i] > max.value) {
                    max.value = array[i];
                    max.index = i;
                }
        }
        return max;
    } catch (error) {
        alert(`Error: Couldn't find max of ${array}: ${error}`)
    }
}






export const updateClimbingTheRanksAchievement = (loggedInUser: MyUser, users: MyUser[]): void => {
    try {
        if (users.slice(3,10).includes(loggedInUser) && loggedInUser.weeklyExperience > 0){
            const updatedAchievement: Achievement = {
                color: "#BBC2CC",
                description: "Reach the top 3 place in the leaderboard to unlock next stage",
                icon: "arrow-up",
                level: 1,
                name: "Climbing The Ranks",
                status: "Top 10 Challenger",
                visibility: 1
            }
            updateAchievementStatus(loggedInUser.userID, updatedAchievement);
        }
        else if (users.slice(1,3).includes(loggedInUser) && loggedInUser.weeklyExperience > 0){
            const updatedAchievement: Achievement = {
                color: "#BBC2CC",
                description: "Reach the top 1 place in the leaderboard to unlock next stage",
                icon: "arrow-up",
                level: 2,
                name: "Climbing The Ranks",
                status: "Top 3 Contender",
                visibility: 1
            }
            updateAchievementStatus(loggedInUser.userID, updatedAchievement);
        }
        if (users[0] === loggedInUser && loggedInUser.weeklyExperience > 0){
            
            const updatedAchievement: Achievement = {
                color: "#FFDD43",
                description: "Max level achieved: Reach top 1 place in the leaderboard",
                icon: "arrow-up",
                level: 3,
                name: "Climbing The Ranks",
                status: "Leaderboard Dominator",
                visibility: 1
            }
            updateAchievementStatus(loggedInUser.userID, updatedAchievement);
        }
    } catch (error: any) {
        alert(`Error: Couldn't update achievement: ${error}`)
    }
};


const initializeAchievements = async (userID: string | null): Promise<void> => {
    try {
        const achievementsCollectionRef = collection(FIRESTORE_DB, "Achievements");
        const achievementsSnapshot = await getDocs(achievementsCollectionRef);
        let newOwner;
        for (const achievementDoc of achievementsSnapshot.docs) {
            switch (achievementDoc.data().name) {
                case "Consistency Streak":
                    newOwner = {
                        color: "#808080",
                        description: "Workout for 10 days to unlock this achievement",
                        level: 0,
                        status: "locked",
                        userID: userID,
                        visibility: 0.5
                    }
                    break;
                case "Endurance Master":
                    newOwner = {
                        color: "#808080",
                        description: "Do 20 repetitions for an exercise to unlock this achievement",
                        level: 0,
                        status: "locked",
                        userID: userID,
                        visibility: 0.5
                    }
                    break;
                case "Dedicated Athlete":
                    newOwner = {
                        color: "#808080",
                        description: "Workout for a month consistently to unlock this achievement",
                        level: 0,
                        status: "locked",
                        userID: userID,
                        visibility: 0.5
                    }
                    break;
                case "Climbing The Ranks":
                    newOwner = {
                        color: "#808080",
                        description: "Get in the top 10 users to unlock this achievement",
                        level: 0,
                        status: "locked",
                        userID: userID,
                        visibility: 0.5
                    }
                    break;
                case "Strength Builder":
                    newOwner = {
                        color: "#808080",
                        description: "Lift 60 kg on an exercise to unlock this achievement",
                        level: 0,
                        status: "locked",
                        userID: userID,
                        visibility: 0.5
                    }
                    break
                default:
                    break;
                }
                const updatedOwners = [...achievementDoc.data().owners, newOwner];
                
                const updatedData = {
                    owners: updatedOwners
                }
                await updateDoc(achievementDoc.ref, updatedData);
            }
    } catch (error: any) {
        alert(`Couldn't initialize achievements: ${error}`)
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
    const q = query(collectionRef, where("date", "==", date), where("userID", "==", userID) );
    const snapshot = await getDocs(q);
    if (!snapshot.empty){
        const workoutDocs = snapshot.docs[0];
        return workoutDocs;
    }        
}