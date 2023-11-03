import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { NavigationProp } from "@react-navigation/native";
import { validateActivityLevel, validateAge, validateExerciseSet, validateExperience, validateGender, validateHeight, validateWeight } from "./validations";
import { SelectItem, MaxValueAndIndex, BestExercise, Exercise, ExerciseSet, ExerciseRecords, Account } from "../types and interfaces/types";
import { useRef } from "react";




export const signUp =async (name:string, setLoading:Function, auth:Auth, email:string, password:string): Promise<void> => {
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

export const getBestExercise =  async (userID: string, field:string, secondaryField:string ): Promise<BestExercise> => {
    try {
        const bestExercise = useRef({
            name: "",
            weights: 0,
            reps: 0
        });
        const workoutCollectionRef = collection(FIRESTORE_DB, "Workouts");
        const workoutQuery = query(workoutCollectionRef, where("userID", "==", userID));
        onSnapshot(workoutQuery, snapshot => {
            const doc = snapshot.docs[0];
            for (const exercise of doc.data().Workout) {
                if (getMax(exercise[field]).value > bestExercise.current[field]) {
                    bestExercise.current[field] = getMax(exercise[field]).value;
                    bestExercise.current.name = exercise.exercise[getMax(exercise.weights).index];
                    bestExercise.current[secondaryField] = exercise.reps[getMax(exercise[field]).index];
                }
                else if (getMax(exercise[field]).value === bestExercise.current[field]) {
                    if (getMax(exercise[secondaryField]).value > bestExercise.current[secondaryField]) {
                        bestExercise.current[secondaryField] = getMax(exercise[secondaryField]).value;
                        bestExercise.current.name = exercise.exercise[getMax(exercise[secondaryField]).index];
                        bestExercise.current[field] = exercise.weights[getMax(exercise[secondaryField]).index];
                    }   
                } 
            };                
     
        })
        return bestExercise.current;
    } catch (error) {
        alert(`Error: Couldn't find best exercise for ${field}: ${error.message}`);
    }
    
};
  
export const getExercises = async (userID: string): Promise<Exercise[]> => {
    try {
        const exercises = useRef([]);
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        onSnapshot(usersQuery, userSnapshot => {
            const userDoc = userSnapshot.docs[0];
            const exercisesCollectionRef = collection(userDoc.ref, "exercises");
            onSnapshot(exercisesCollectionRef, (exercisesSnapshot)=> {
                exercisesSnapshot.docs.forEach((exercisesDoc) => {
                    exercises.current.push(exercisesDoc.data());
                })
            });
        });
        return exercises.current;
    } catch (error) {
        alert(`Error: Couldn't retrieve exercises: ${error.message}`);
    }
}
    

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
            updateDoc(exercisesDoc.ref, updateData);
        })

    } catch (error) {
        alert(`Error: Couldn't change visibility for ${exerciseName}: ${error.message}`)
    }
}

export const addSet =async (userID:string, date: string, set: ExerciseSet, xpToAdd: number): Promise<void> => {
    try {
        const workoutsCollection = collection(FIRESTORE_DB, "Workouts");
        const workoutsQuery = query(workoutsCollection, where("date", "==", date), where("userID", "==", userID) );

        const workoutsSnapshot = await getDocs(workoutsQuery);
        if(workoutsSnapshot.empty){
            const data = {
                exercise : set.exercise,
                weights: set.weights,
                reps: set.reps,
                times: set.times,
                restTimes: set.restTimes,
                sides: set.sides
            };
            validateExerciseSet(data);

            await addDoc(workoutsCollection, {
                date: date,
                userID: userID,
                Workout: data
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
            validateExerciseSet(data);

            for (const docSnapshot of workoutsSnapshot.docs) {
                const updatedData = [...docSnapshot.data().Workout ];
                updatedData.push(data)
                await updateDoc(doc(FIRESTORE_DB, 'Workouts', docSnapshot.id), {
                    Workout: updatedData
                });     
            }
        } 
        addExperience(userID, xpToAdd);
    } 
    catch (error) {
        alert(`Error: Couldn't add set: ${error.message}`)
    } 
}

export const addExperience = async (userID: string, experience: number): Promise<void> => {
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
        const secondUserData = secondUserDoc.data() as Account;
        const secondUpdateData = {
            level: secondUserData.experience < 225 ? 1 : Math.floor(Math.log(secondUserData.experience / 100) / Math.log(1.5)),
        };
        
        await updateDoc(secondUserDoc.ref, secondUpdateData);
    } 
    catch (error) {
        alert(`Error: Couldn't update experience and level fields: ${error}`)
    }
  };


export const getExercise = async (userID: string, exerciseName: string): Promise<ExerciseRecords> => {
    try {  
        const exerciseRecords = useRef({
            weights: [],
            reps: [],
            times: [],
            restTimes: [],
            dates: [],
        });

     
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");    
        const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));

        onSnapshot(workoutsQuery, workoutSnapshot => {
            workoutSnapshot.docs.forEach(workoutDoc => {
                for (let i = 0; i < workoutDoc.data().Workout.length; i++) {
                    let set = workoutDoc.data().Workout[i];
                    for (let j = 0; j < set.exercise.length; j++)
                        if (set.exercise[j] === exerciseName) {
                            exerciseRecords.current.weights.push(set.weights[i])
                            exerciseRecords.current.reps.push(set.reps[i])
                            exerciseRecords.current.times.push(set.times[i])
                            exerciseRecords.current.restTimes.push(set.restTimes[i])
                            exerciseRecords.current.dates.push(workoutDoc.data().date)
                        }
                }
            })

        })
    
        return exerciseRecords.current; 
    } 
    catch (error) {
        alert(`Error: Couldn't find fields for ${exerciseName}: ${error.message}`);
    }
};


export const deleteSet = async (userID:string, exerciseName: string, exerciseID: number, setID: number, xpToDelete: number ): Promise<void> => {
    try {  
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");    
        const workoutQuery = query(workoutsCollectionRef, where("userID", "==", userID));
        const workoutSnapshot = await getDocs(workoutQuery);
              
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
}

export const getExercisesByFocus = async (userID: string, musclesWorked: string[]): Promise<Exercise[]> => {
    try {
        const exercises = useRef([]);
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        onSnapshot(usersQuery, usersSnapshot => {
            const userDoc = usersSnapshot.docs[0];
            const exercisesCollectionRef = collection(userDoc.ref, "exercises");
            const exercisesQuery = query(exercisesCollectionRef, where("hidden", "==", false), where("musclesWorked", "array-contains-any", musclesWorked));
            onSnapshot(exercisesQuery, exercisesSnapshot => {
                exercisesSnapshot.docs.forEach(exercisesDoc => {
                    exercises.current.push(exercisesDoc.data());
                })
            })
        })

        return exercises.current;
    } catch (error) {
        alert(`Error: Couldn't retrieve exercises: ${error.message}`);
    }
}

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
}

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
}

export const getUser = async (userID: string): Promise<Account> => {
    try {
        const profile = useRef({
            activityLevel: "",
            age: 0,
            experience: 0,
            gender: "",
            height: 0,
            level: 0,
            name: "",
            weeklyExperience: 0,
            weight: 0
        });
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        onSnapshot(usersQuery, usersSnapshot => {
            const usersDoc = usersSnapshot.docs[0];
            profile.current.activityLevel = usersDoc.data().activityLevel;
            profile.current.age = usersDoc.data().age;
            profile.current.experience = usersDoc.data().experience;
            profile.current.gender = usersDoc.data().gender;
            profile.current.height = usersDoc.data().height;
            profile.current.level = usersDoc.data().level;
            profile.current.name = usersDoc.data().name;
            profile.current.weeklyExperience = usersDoc.data().weeklyExperience;
            profile.current.weight = usersDoc.data().weight;
        })
        return profile.current    
    } 
    catch (error) {
        alert(`Error: couldn't retrieve exercises: ${error.message}`);
    }
}


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
}

export const editProfile = async (userID:string, changes: Account): Promise<void> => {
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
}