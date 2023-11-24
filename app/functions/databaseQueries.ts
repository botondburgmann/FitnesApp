import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { Unsubscribe, addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { NavigationProp } from "@react-navigation/native";
import { validateActivityLevel, validateAge, validateExerciseSet, validateExperience, validateGender, validateHeight, validateWeight } from "./validations";
import { SelectItem, MaxValueAndIndex, BestExercise, Exercise, ExerciseSet, ExerciseRecords, MyUser, Achievement } from "../types and interfaces/types";


// getters
export const getSetUpValue = async (userID: string): Promise<boolean> => {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const q = query(usersCollectionRef, where("userID", "==", userID));
        const snapshot = await getDocs(q);
        const doc = snapshot.docs[0];
        return doc.data().set;
    } 
    catch (error) {
        alert(`Error: Couldn't find set field: ${error.message}`);
    }
};

function getMax(array:number[]): MaxValueAndIndex{
    if (array !== undefined) {
        const max = {
            value : 0,
            index: 0
        };
        for (let i = 0; i < array.length; i++)
            if (array[i] > max.value) {
                max.value = array[i];
                max.index = i;
            }
        return max;
    }
}

export const getBestExercise = (userID: string, field:string, secondaryField:string, callback: Function ): Unsubscribe => {
    const bestExercise: BestExercise = {
        name: "",
        weights: 0,
        reps: 0
    };
    const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
    const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
    const unsubscribeFromWorkouts = onSnapshot(workoutsQuery, (snapshot) => {
        snapshot.docs.forEach((doc) => {
            const workoutData = doc.data().Workout;
      
            if (workoutData) {
                workoutData.forEach((exercise) => {
                    const maxField = getMax(exercise[field]);
                    const maxSecondaryField = getMax(exercise[secondaryField]);
      
                    if (maxField && maxSecondaryField) {
                        if (maxField.value > bestExercise[field]) {
                            bestExercise[field] = maxField.value;
                            bestExercise.name = exercise.exercise[maxField.index];
                            bestExercise[secondaryField] = exercise[secondaryField][maxField.index];
                        } else if (maxField.value === bestExercise[field] && maxSecondaryField.value > bestExercise[secondaryField]) {
                            bestExercise[secondaryField] = maxSecondaryField.value;
                            bestExercise.name = exercise.exercise[maxSecondaryField.index];
                            bestExercise[field] = exercise[field][maxSecondaryField.index];
                        }
                    }
                });
            }
        });
    });
    callback(bestExercise)
      

    return unsubscribeFromWorkouts;
};

export const getAllExercises = (userID: string, callback: Function): Unsubscribe[] => {
    try {
        const exercises: Exercise[] = [];
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

    } catch (error) {
        alert(`Error: Couldn't fetch exercises: ${error}`);
    }
};

export const getAvailableExercises = (userID: string, callback: Function): Unsubscribe => {
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
    } catch (error) {
        alert(`Error: Couldn't fetch exercises: ${error}`)
    }
};

export const getExercise = (userID: string, exerciseName: string, callback): Unsubscribe => {

    const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");    
    const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));

    const unsubscribeFromWorkouts = onSnapshot(workoutsQuery, workoutSnapshot => {
        if (!workoutSnapshot.empty) {
            const exerciseRecords: ExerciseRecords = {
                weights: [],
                reps: [],
                times: [],
                dates: [],
            }
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
            callback(exerciseRecords);    
        }
    })
    return unsubscribeFromWorkouts;
};

export const getExercisesByFocus = (userID: string, musclesWorked: string[], callback: Function): Unsubscribe => {
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
        
    } catch (error) {
        alert(`Error: couldn't fetch exercises for ${[...musclesWorked]}: ${error.message}`);
    }
};

export const getUser = (userID:string, callback: Function): Unsubscribe => {
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
};
export const getAllUsers = (callback): Unsubscribe => { 
    
    const usersCollectionRef = collection(FIRESTORE_DB, "Users");
    const unsubscribeFromUsers = onSnapshot(usersCollectionRef, usersSnapshot => {
        const users = [];
        usersSnapshot.docs.forEach(usersDoc => {
            users.push(usersDoc.data())
        })        
        callback(users);    
    })
    return unsubscribeFromUsers;
};

export const getWorkout = (userID: string, date: string, callback: Function): Unsubscribe => {
    try {
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
        const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID), where("date", "==", date));
        
        const unsubscribe = onSnapshot(workoutsQuery, workoutsSnapshot => {
            if (!workoutsSnapshot.empty) {
                const allExercises: ExerciseSet[] = [];
                workoutsSnapshot.docs.forEach(workout => {
                    for (let i = 0; i < workout.data().Workout.length; i++) {
                        let currentExercise: ExerciseSet = {
                            exercise :  workout.data().Workout[i].exercise,
                            weights: workout.data().Workout[i].weights,
                            reps: workout.data().Workout[i].reps,
                            times: workout.data().Workout[i].times,
                            restTimes: workout.data().Workout[i].restTimes,
                            sides: workout.data().Workout[i].sides
                        };
                        allExercises.push(currentExercise);
                        
                        
                    }


            
                })
                
                callback(allExercises);
            }
        })
        return unsubscribe;
    } catch (error) {
        alert(`Error: couldn't fetch workout for ${date}`);
    }
};

export const getAchievementsForUser = (userID: string, callback: Function): Unsubscribe => {
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
    } catch (error) {
        alert(`Error: couldn't fetch achievements for ${userID}: ${error}`);
    }
};

// setters
export const signUp = async (name:string, setLoading:Function, auth:Auth, email:string, password:string): Promise<void> => {
    setLoading(true);
    try {
        if (name === "")
            throw new Error("name must be set"); 
        const response = await createUserWithEmailAndPassword(auth, email,password);
        const userData = {
            userID: response.user.uid, 
            name: name, 
            gender: "", 
            age: 0, 
            weight: 0, 
            height: 0, 
            activityLevel: "", 
            set: false, 
            level: 1, 
            experience: 0
        };
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const userDocRef = await addDoc(usersCollectionRef, userData);
        
        
        const exercisesCollectionRef = collection(FIRESTORE_DB, "Exercises");
        const exercisesQuerySnapshot = await getDocs(exercisesCollectionRef);
        exercisesQuerySnapshot.forEach(async (exerciseDoc) => {
            const exerciseData = exerciseDoc.data();
            const userSubcollectionRef = collection(userDocRef, "exercises");
            await addDoc(userSubcollectionRef, exerciseData);
        })
        alert("Registered successfully!");
    }   
    catch (error:any) {
        alert(`Error: Registration failed: ${error.message}`);
    }   
    finally{
        setLoading(false);
    }
}

export const setUpProfile =async (field:string, value:number | string | Date | SelectItem, userID:string, navigation:NavigationProp<any, any>, nextPage:string, system?: string): Promise<void> => {
    try {
        if (field === "gender" && typeof(value) === "string")
            validateGender(value);

        else if (field === "age" && value instanceof Date){
            const today = new Date()      
            const age =  today.getFullYear()-value.getFullYear();      
            validateAge(age);
            value = age;
        }
        
        else if (field === "weight" && typeof(value) === "number") {
            validateWeight(value);
            if (system === "lbs")
                value = Math.round((value*0.453592)*100)/100;
        }
        
        else if (field === "height" && typeof(value) === "number") {
            validateHeight(value);
            if (system === "ft")
                value = Math.round((value*30.48)*100)/100;
        }
        else if (field === "activityLevel" && typeof value === "object" && "label" in value && "value" in value)
            validateActivityLevel(value as SelectItem);
          

        const usersCollection = collection(FIRESTORE_DB, "Users");
        const q = query(usersCollection, where("userID", "==", userID));
        const snapshot = await getDocs(q);
        snapshot.forEach(async (docSnapshot) => {
            const userDocRef = doc(FIRESTORE_DB, "Users", docSnapshot.id);

            if (field === "activityLevel" && typeof value === "object" && "label" in value && "value" in value) {
                const newData = { [field]: value.value,set: true }; 
                await updateDoc(userDocRef, newData);
            } else {
                const newData = { [field]: value}; 
                await updateDoc(userDocRef, newData);
            }
            navigation.navigate(nextPage);
        });  
    }   
    catch (error:any) {
        alert(`Error: Adding data has failed: ${error.message}`);
    }
}

export const addSet =async (userID:string, date: string, set: ExerciseSet, xpToAdd: number): Promise<void> => {
    try {
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
        const workoutsQuery = query(workoutsCollectionRef, where("date", "==", date), where("userID", "==", userID) );

        const workoutsSnapshot = await getDocs(workoutsQuery);
        if(!workoutsSnapshot.empty){
            const data = {
                exercise : set.exercise,
                weights: set.weights,
                reps: set.reps,
                times: set.times,
                restTimes: set.restTimes,
                sides: set.sides
            };
            validateExerciseSet(data);

            const updatedStrengthBuilderAchievement = updateStrengthBuilderAchievement(set);
            updateAchievementStatus(userID, updatedStrengthBuilderAchievement);

            const updatedEnduranceMasterAchievement = updateEnduranceMasterAchievement(set);
            updateAchievementStatus(userID, updatedEnduranceMasterAchievement);


            const newWorkout = [...workoutsSnapshot.docs[0].data().Workout, data]

            await updateDoc(doc(FIRESTORE_DB, "Workouts", workoutsSnapshot.docs[0].id), {
                Workout: newWorkout
            });
        
        } else {
            const data = {
                exercise : set.exercise,
                weights: set.weights,
                reps: set.reps,
                times: set.times,
                restTimes: set.restTimes,
                sides: set.sides
            };
            const workout = [];
            workout.push(data);
            validateExerciseSet(data);

            const updatedStrengthBuilderAchievement = updateStrengthBuilderAchievement(set);
            updateAchievementStatus(userID, updatedStrengthBuilderAchievement);

            const updatedEnduranceMasterAchievement = updateEnduranceMasterAchievement(set);
            updateAchievementStatus(userID, updatedEnduranceMasterAchievement);


            await addDoc(workoutsCollectionRef, {
                date: date,
                userID: userID,
                Workout: workout
            });
            const updatedConsistencyStreakAchievement = await updateConsistencyStreakAchievement(userID);
            updateAchievementStatus(userID, updatedConsistencyStreakAchievement);

            const updatedDedicatedAthleteAchievement = await updateDedicatedAthleteAchievement(userID);
            updateAchievementStatus(userID, updatedDedicatedAthleteAchievement);


        }         
        addExperience(userID, xpToAdd);
    } 
    catch (error) {
        alert(`Error: Couldn't add set: ${error.message}`)
    } 
}

const addExperience = async (userID: string, experience: number): Promise<void> => {
    try {        
        const usersCollectionRef = collection(FIRESTORE_DB,"Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const firstUsersSnapshot = await getDocs(usersQuery);
        const firstUserDoc = firstUsersSnapshot.docs[0];
        
        validateExperience(experience);
        
        const firstUpdatedData = {
            experience: firstUserDoc.data().experience+experience,
            weeklyExperience: firstUserDoc.data().weeklyExperience+experience,
        }

        await updateDoc(firstUserDoc.ref, firstUpdatedData);
        
        const secondUsersSnapshot = await getDocs(usersQuery);
        const secondUserDoc = secondUsersSnapshot.docs[0];
        const secondUserData = secondUserDoc.data() as MyUser;
        const secondUpdateData = {
            level: secondUserData.experience < 225 ? 1 : Math.floor(Math.log(secondUserData.experience / 100) / Math.log(1.5)),
        };
        
        await updateDoc(secondUserDoc.ref, secondUpdateData);
    } 
    catch (error) {
        alert(`Error: Couldn't update experience and level fields: ${error}`)
    }
};

export const toggleExerciseVisibilty =async (userID: string, exerciseName: string): Promise<void> => {
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
            console.log(`updating doc ${updateData.hidden}`);
            
            updateDoc(exercisesDoc.ref, updateData);
        })

    } catch (error) {
        alert(`Error: Couldn't change visibility for ${exerciseName}: ${error.message}`)
    }
};

export const deleteSet = async (userID:string, exerciseName: string, exerciseID: number, setID: number, xpToDelete: number ): Promise<void> => {
    try {  
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");    
        const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
        const workoutSnapshot = await getDocs(workoutsQuery);
              
        for (const docSnapshot of workoutSnapshot.docs) {
            const updatedData = { ...docSnapshot.data() };

            for (let i = 0; i < docSnapshot.data().Workout.length; i++) {   
                if (docSnapshot.data().Workout[i].exercise[setID] === exerciseName && i === exerciseID){
                    if ( updatedData.Workout[i].exercise.length === 1) {
                        updatedData.Workout.splice(i, 1)
                    }
                    else{
                        updatedData.Workout[i].exercise.splice(setID, 1);
                        updatedData.Workout[i].weights.splice(setID, 1);
                        updatedData.Workout[i].reps.splice(setID, 1);
                        updatedData.Workout[i].times.splice(setID, 1);
                        updatedData.Workout[i].sides.splice(setID, 1);
                        updatedData.Workout[i].restTimes.splice(setID, 1);   
                    }
                    await updateDoc(doc(FIRESTORE_DB, "Workouts", docSnapshot.id), {
                        Workout: updatedData.Workout
                    });
                }   
            }
  
        } 
      
    validateExperience(xpToDelete);
    addExperience(userID, xpToDelete);

    } 
    catch (error) {
        alert(`Error: Couldn't delete fields: ${error.message}`);
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
    catch (error) {
        alert(`Error: Couldn't create exercise: ${error.message}`);
    }
};

export const editSet = async (userID:string, exerciseName: string, exerciseID: number, setID: number, changes: object, xpToChange: number): Promise<void> => {
    try {  
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");    
        const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
        const workoutSnapshot = await getDocs(workoutsQuery);
              
        for (const workoutDoc of workoutSnapshot.docs) {
            const updatedData = { ...workoutDoc.data() };

            for (let i = 0; i < workoutDoc.data().Workout.length; i++) {   
                if(workoutDoc.data().Workout[i].exercise[setID] === exerciseName && i === exerciseID){
                
                    for (const change in changes) 
                        updatedData.Workout[i][change][setID] = changes[change];
                    
                    await updateDoc(doc(FIRESTORE_DB, "Workouts", workoutDoc.id), {
                        Workout: updatedData.Workout
                    });
                }
            }  
        }
        
        addExperience(userID, xpToChange);

    } catch (error) {
        alert(`Error: couldn't update set fields: ${error.message}`);
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
    catch (error) {
        alert(`Error: couldn't reset weekly experience:  ${error}`);
    }
};

export const editProfile = async (userID:string, changes: MyUser): Promise<void> => {
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
    catch (error) {
        alert(`Error: couldn't find fields: ${error.message}`);
    }
};

export const addWorkout =async (userID:string, date: string, workout: ExerciseSet[], xpToAdd: number): Promise<void> => {
    const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
    for (const set of workout) {
        const updatedStrengthBuilderAchievement = updateStrengthBuilderAchievement(set);
        updateAchievementStatus(userID, updatedStrengthBuilderAchievement);

        const updatedEnduranceMasterAchievement = updateEnduranceMasterAchievement(set);
        updateAchievementStatus(userID, updatedEnduranceMasterAchievement);
    }
    await addDoc(workoutsCollectionRef, {
        date: date,
        userID: userID,
        Workout: workout
    });    
    const updatedConsistencyStreakAchievement = await updateConsistencyStreakAchievement(userID);
    updateAchievementStatus(userID, updatedConsistencyStreakAchievement);

    const updatedDedicatedAthleteAchievement = await updateDedicatedAthleteAchievement(userID);
    updateAchievementStatus(userID, updatedDedicatedAthleteAchievement); 
    addExperience(userID, xpToAdd);
    
}

export const updateAchievementStatus =async (userID:string, updatedAchievement: Achievement): Promise<void> => {
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
}


const updateStrengthBuilderAchievement = (set: ExerciseSet): Achievement => {
    for (const weight of set.weights) {
      if (weight >= 60 && weight < 80) {
          const updatedAchievement: Achievement = {
              color: "#BBC2CC",
              description: "Lift 80 kg on an exercise to unlock next stage",
              icon: "dumbbell",
              level: 1,
              name: "Strength Builder",
              status: "Gym Novice",
              visibility: 1
          }
          return updatedAchievement;
      }
      else if (weight >= 80 && weight < 100) {
          const updatedAchievement: Achievement = {
              color: "#BBC2CC",
              description: "Lift 100 kg on an exercise to unlock next stage",
              icon: "dumbbell",
              level: 2,
              name: "Strength Builder",
              status: "Intermediate Lifter",
              visibility: 1
          }
          return updatedAchievement;
      }
      else if (weight >= 100) {
          const updatedAchievement: Achievement = {
              color: "#FFDD43",
              description: "Max level achieved: Lift 100 kg on an exercise",
              icon: "dumbbell",
              level: 3,
              name: "Strength Builder",
              status: "Gym Warrior",
              visibility: 1
          }
          return updatedAchievement;
      } 
  }
};
const updateEnduranceMasterAchievement = (set: ExerciseSet): Achievement => {
    for (const rep of set.reps) {
      if (rep >= 20 && rep < 50) {
          const updatedAchievement: Achievement = {
              color: "#BBC2CC",
              description: "Do 50 repetitions for an exercise to unlock next stage",
              icon: "running",
              level: 1,
              name: "Endurance Master",
              status: "Repetition Rookie",
              visibility: 1
          }
          return updatedAchievement;
      }
      else if (rep >= 50 && rep < 75) {
          const updatedAchievement: Achievement = {
              color: "#BBC2CC",
              description: "Do 75 repetitions for an exercise to unlock next stage",
              icon: "running",
              level: 2,
              name: "Endurance Master",
              status: "Endurance Enthusiast",
              visibility: 1
          }
          return updatedAchievement;
      }
      else if (rep >= 75 && rep < 100) {
          const updatedAchievement: Achievement = {
              color: "#BBC2CC",
              description: "Do 100 repetitions for an exercise to unlock next stage",
              icon: "running",
              level: 3,
              name: "Strength Builder",
              status: "Repetition Pro",
              visibility: 1
          }
          return updatedAchievement;
      }
      else if (rep >= 100) {
          const updatedAchievement: Achievement = {
              color: "#FFDD43",
              description: "Max level achieved: Do 100 repetitions for an exercise to unlock next stage",
              icon: "running",
              level: 4,
              name: "Endurance Master",
              status: "Endurance Champion",
              visibility: 1
          }
          return updatedAchievement;
      }
  }
};

const updateConsistencyStreakAchievement = async (userID: string): Promise<Achievement> => {
    const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
    const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
    const workoutsSnapshot = await getDocs(workoutsQuery);
    const dates: string[] = []
    for (const workoutDoc of workoutsSnapshot.docs) {
        dates.push(workoutDoc.data().date);
    }
    if (dates.length === 10) {
        const updatedAchievement: Achievement = {
            color: "#BBC2CC",
            description: "Work out for 30 days, unlock next stage",
            icon: "calendar",
            level: 1,
            name: "Consistency Streak",
            status: "Workout Explorer",
            visibility: 1
        }
        return updatedAchievement;
    }
    else if (dates.length === 30) {
        const updatedAchievement: Achievement = {
            color: "#BBC2CC",
            description: "Work out for 60 days, unlock next stage",
            icon: "calendar",
            level: 2,
            name: "Consistency Streak",
            status: "Fitness Journeyman",
            visibility: 1
        }
        return updatedAchievement;
    }
    else if (dates.length === 60) {
        const updatedAchievement: Achievement = {
            color: "#BBC2CC",
            description: "Work out for 90 days, unlock next stage",
            icon: "calendar",
            level: 3,
            name: "Consistency Streak",
            status: "Consistency Warrior",
            visibility: 1
        }
        return updatedAchievement;
    }
    else if (dates.length === 90) {
        const updatedAchievement: Achievement = {
            color: "#BBC2CC",
            description: "Work out for 120 days, unlock next stage",
            icon: "calendar",
            level: 4,
            name: "Consistency Streak",
            status: "Workout Explorer",
            visibility: 1
        }
        return updatedAchievement;
    }
    else if (dates.length === 120) {
        const updatedAchievement: Achievement = {
            color: "#FFDD43",
            description: "Max level unlocked: Work out for 120 days",
            icon: "calendar",
            level: 5,
            name: "Consistency Streak",
            status: "Fitness Legend",
            visibility: 1
        }
        return updatedAchievement;
    }

};
const updateDedicatedAthleteAchievement = async (userID: string): Promise<Achievement> => {
    const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
    const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
    const workoutsSnapshot = await getDocs(workoutsQuery);
    const dates: string[] = []
    for (const workoutDoc of workoutsSnapshot.docs) {
        dates.push(workoutDoc.data().date);
    }
    const sortedDates = sortDates(dates);
    const daysBetweenFirstAndlastDates = calculateDaysBetweenDates(sortedDates);
    if (daysBetweenFirstAndlastDates >= 30 && daysBetweenFirstAndlastDates < 90 && sortedDates.length >= 4 && sortedDates.length <= 30) {
        const updatedAchievement: Achievement = {
            color: "#BBC2CC",
            description: "Work out for 3 months, consistently to unlock next stage",
            icon: "throphy",
            level: 1,
            name: "Dedicated Athlete",
            status: "Workout Apprentice",
            visibility: 1
        }
        return updatedAchievement;
    }
    else if (daysBetweenFirstAndlastDates >= 90 && daysBetweenFirstAndlastDates < 182 && sortedDates.length >= 13 && sortedDates.length <= 90) {
        const updatedAchievement: Achievement = {
            color: "#BBC2CC",
            description: "Work out for 6 months, consistently to unlock next stage",
            icon: "throphy",
            level: 2,
            name: "Dedicated Athlete",
            status: "Gym Devotee",
            visibility: 1
        }
        return updatedAchievement;
    }
    else if (daysBetweenFirstAndlastDates >= 182 && daysBetweenFirstAndlastDates < 273 && sortedDates.length >= 26 && sortedDates.length <= 182) {
        const updatedAchievement: Achievement = {
            color: "#BBC2CC",
            description: "Work out for 9 months, consistently to unlock next stage",
            icon: "throphy",
            level: 3,
            name: "Dedicated Athlete",
            status: "Fitness Enthusiast",
            visibility: 1
        }
        return updatedAchievement;
    }
    else if (daysBetweenFirstAndlastDates >= 273 && daysBetweenFirstAndlastDates < 365 && sortedDates.length >= 39 && sortedDates.length <= 273) {
        const updatedAchievement: Achievement = {
            color: "#BBC2CC",
            description: "Work out for a year, consistently to unlock next stage",
            icon: "throphy",
            level: 4,
            name: "Dedicated Athlete",
            status: "Workout Maestro",
            visibility: 1
        }
        return updatedAchievement;
    }
    else if (daysBetweenFirstAndlastDates >= 365 && sortedDates.length >= 52 && sortedDates.length <= 365) {
        const updatedAchievement: Achievement = {
            color: "#FFDD43",
            description: "Max level unlocked: Work out for a year, consistently",
            icon: "throphy",
            level: 5,
            name: "Dedicated Athlete",
            status: "Gym God",
            visibility: 1
        }
        return updatedAchievement;
    }

};

export const updateClimbingTheRanksAchievement = (loggedInUser: MyUser, users: MyUser[]): void => {
    if (users.slice(3,10).includes(loggedInUser)){
        const updatedAchievement: Achievement = {
            color: "#BBC2CC",
            description: "Reach in the top 3 place in the leaderboard to unlock next stage",
            icon: "arrow-up",
            level: 1,
            name: "Dedicated Athlete",
            status: "Top 10 Challenger",
            visibility: 1
        }
        updateAchievementStatus(loggedInUser.userID, updatedAchievement);
    }
    else if (users.slice(1,3).includes(loggedInUser)){
        const updatedAchievement: Achievement = {
            color: "#BBC2CC",
            description: "Reach in the top 1 place in the leaderboard to unlock next stage",
            icon: "arrow-up",
            level: 2,
            name: "Dedicated Athlete",
            status: "Top 3 Contender",
            visibility: 1
        }
        updateAchievementStatus(loggedInUser.userID, updatedAchievement);
    }
    if (users[0] === loggedInUser){
        const updatedAchievement: Achievement = {
            color: "#FFDD43",
            description: "Max level achieved: Reach top 1 place in the leaderboard",
            icon: "arrow-up",
            level: 3,
            name: "Dedicated Athlete",
            status: "Leaderboard Dominator",
            visibility: 1
        }
        updateAchievementStatus(loggedInUser.userID, updatedAchievement);
    }
}

const sortDates = (dates: string[]): string[] => {
    const dateObjects = dates.map(dateString => new Date(dateString));
    dateObjects.sort((a, b) => a.getTime() - b.getTime());
    const sortedDates = dateObjects.map(dateObject => dateObject.toString());
    return sortedDates;
};

const calculateDaysBetweenDates = (dates:string[]): number => {
    if (dates.length >= 2) {
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
      
        const firstDateObject = new Date(firstDate);
        const lastDateObject = new Date(lastDate);
      
        const timeDifferenceInMilliseconds = lastDateObject.getTime() - firstDateObject.getTime();
      
        const timeDifferenceInDays = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
      
        return timeDifferenceInDays;
      } else {
        throw new Error("Not enough dates to calculate the difference.");
      }
}






