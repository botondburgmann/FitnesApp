import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { DocumentData, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { NavigationProp } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { validateActivityLevel, validateAge, validateGender, validateHeight, validateWeight } from "./validations";

interface ExerciseSelectOption{
    label: string;
    value: string;
    unilateral: boolean
    isometric: boolean
  }

interface MaxValueAndIndex {
    value: number;
    index: number;
}

interface Exercise{
    hidden: boolean;
    isometric: boolean;
    name: string;
    musclesWorked: string[];
    unilateral: boolean;
}

interface BestExercise {
    name: string;
    weights: number;
    reps: number;
}

  interface User {
    activityLevel: string;
    age: number;
    weeklyExperience:number;
    experience: number;
    gender: string;
    height: number;
    level: number;
    name: string;
    weight: number;
  }
  interface Profile {
    activityLevel: string;
    age: number;
    gender: string;
    height: number;
    name: string;
    weight: number;
  }

interface Table {
    tableHead: string[],
    tableData: any[]
}

interface SelectItem {
    label: string;
    value: string;
  }
export const signUp =async (name:string, setLoading:Function, auth:Auth, email:string, password:string): Promise<void> => {
    setLoading(true);
    try {
        if (name === "")
            throw new Error("Name must be set"); 
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
        alert(`Registration failed: ${error.message}`);
    }   
    finally{
        setLoading(false);
    }
}

export const setUpProfile =async (field:string, value:number | string | Date | SelectItem, userID:string, navigation:NavigationProp<any, any>, nextPage:string, system?: string) => {
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
        alert(`Adding data has failed: ${error.message}`);
    }
}
export const getSetUpValue = async (userID: string):Promise<boolean> => {
    try {
      const usersCollectionRef = collection(FIRESTORE_DB, 'Users');
      const q = query(usersCollectionRef, where('userID', '==', userID));
      const querySnapshot = await getDocs(q);
      const userDocSnapshot = querySnapshot.docs[0];
      const setUpValue = userDocSnapshot.data().set;
      return setUpValue;
    } catch (error) {
      alert("Couldn't find set field : " + error.message);
    }
  };
  

function getMax(array:number[]): MaxValueAndIndex{
    const currentMax = {
        value : 0,
        index: 0
    };
    for (let i = 0; i < array.length; i++)
        if (array[i] > currentMax.value) {
            currentMax.value = array[i];
            currentMax.index = i;
        }
    return currentMax;
}

export const getBestExercise =  (userID: string, field:string, secondaryField:string ): BestExercise => {
    const [bestExercise, setBestExercise] = useState({
        name: "",
        weights: 0,
        reps: 0
    });
    useEffect(() => {
        const fetchData =async () => {
            try {
                const workoutCollectionRef = collection(FIRESTORE_DB, "Workouts");
                const workoutQuery = query(workoutCollectionRef, where("userID", "==", userID));
                onSnapshot(workoutQuery, (snapshot) => {
                    let currentBest = {
                        name: "",
                        weights: 0,
                        reps: 0
                    };
                    snapshot.docs.forEach((doc) => {
                        for (const exercise of doc.data().Workout) {
                            if (getMax(exercise[field]).value > currentBest[field]) {
                                currentBest[field] = getMax(exercise[field]).value;
                                currentBest.name = exercise.exercise[getMax(exercise.weights).index];
                                currentBest[secondaryField] = exercise.reps[getMax(exercise[field]).index];
                            }
                            else if (getMax(exercise[field]).value === currentBest[field]) {
                                if (getMax(exercise[secondaryField]).value > currentBest[secondaryField]) {
                                    currentBest[secondaryField] = getMax(exercise[secondaryField]).value;
                                    currentBest.name = exercise.exercise[getMax(exercise[secondaryField]).index];
                                    currentBest[field] = exercise.weights[getMax(exercise[secondaryField]).index];
                                }   
                            } 
                        };
                    });  
                    setBestExercise(currentBest);
                });
            } catch (error) {
                alert(`Couldn't get exercise with most weight: ${error.message}`);
            }   
        }
        fetchData()
    }, [userID,field,secondaryField])
    return bestExercise;
    
};
  
export const getExercises = (userID: string): Exercise[] => {
    const [exercises, setExercises] = useState([])

    useEffect(() => {
        const fetchData =async () => {
            try {
                setExercises([]);
                const usersCollectionRef = collection(FIRESTORE_DB, "Users");
                const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
            
                onSnapshot(usersQuery, (snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        const exercisesCollectionRef = collection(doc.ref, "exercises");
                        onSnapshot(exercisesCollectionRef, (snapshot)=> {
                            let data = [];
                            snapshot.docs.forEach((doc) => {
                                data.push(doc.data());
                            })
                            setExercises(data);
                        });
                    });
                });
            } catch (error) {
                alert("Couldn't retrieve exercises: " + error.message);
            }
        };
        
        fetchData()
        
    }, [userID])
    return exercises;
}
    

export const toggleExerciseVisibilty =async (userID: string, exerciseName: string) => {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));

        getDocs(usersQuery)
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    const exercisesCollectionRef = collection(doc.ref, "exercises");
                    const exercisesQuery = query(exercisesCollectionRef, where("name", "==", exerciseName));
                    getDocs(exercisesQuery)
                        .then((snapshot) => {
                            snapshot.docs.forEach((doc) => {
                                const updateData = {
                                    hidden: !doc.data().hidden
                                };
                                updateDoc(doc.ref, updateData);
                            })
                        })
                });
            });
    } catch (error) {
        alert(`Couldn't change visibility for ${exerciseName}: ${error.message}`)
    }
}

export const addSet =async (userID:string, date: string, exercises: ExerciseSelectOption[], sets: object[], xpToAdd) => {
    const workoutsCollection = collection(FIRESTORE_DB, 'Workouts');
    const q = query(workoutsCollection, where("date", '==', date), where("userID", '==', userID) );

    const exerciseNames = [];
    for (const exercise of exercises)
        exerciseNames.push(exercise.label);

    
    try {

        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty){
            const data = {
                exercise : exerciseNames,
                weights: [],
                reps: [],
                times: [],
                restTimes: [],
                sides: []
        
            }
            for (const set of sets) 
                for (const key in set) 
                    Number.isNaN(set[key]) ? data[key].push(0) : data[key].push(set[key])
                const Workout = []
                Workout.push(data)
                
                await addDoc(workoutsCollection, {
                    date: date,
                    userID: userID,
                    Workout: Workout
                });
        
        } else {
            const data = {
                exercise : exerciseNames,
                weights: [],
                reps: [],
                times: [],
                restTimes: [],
                sides: []
        
            }
            for (const set of sets) 
                for (const key in set) 
                    Number.isNaN(set[key]) ? data[key].push(0) : data[key].push(set[key]) 
            for (const docSnapshot of querySnapshot.docs) {
                const updatedData = [...docSnapshot.data().Workout ];

                updatedData.push(data)
                 await updateDoc(doc(FIRESTORE_DB, 'Workouts', docSnapshot.id), {
                    Workout: updatedData
                });     
            }
        } 
        addExperience(userID, xpToAdd);
    } catch (error) {
        alert(error)
    }
    
}

export const addExperience = async (userID: string, experience: number) => {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB,"Users");
        const q = query(usersCollectionRef, where("userID", "==", userID));
        const snapshot = await getDocs(q);
        snapshot.docs.forEach(async doc => {
            const updatedData = {
                experience: doc.data().experience+experience,
                weeklyExperience: doc.data().weeklyExperience+experience,
            }
            await updateDoc(doc.ref, updatedData);
        })
        const snapshotTwo = await getDocs(q);
        snapshotTwo.docs.forEach(async doc => {
            const updatedData = {
                level: doc.data().experience < 225 ? 1 : Math.floor(Math.log(doc.data().experience/100)/Math.log(1.5))
    
            }
            await updateDoc(doc.ref, updatedData);
        })
    } catch (error) {
        alert(`Error updating experience fields: ${error}`)
    }

  };

  

export const getExercise = async (userID: string, exerciseName = '') => {
    try {  

         const exercise = {
            weights: [],
            reps: [],
            times: [],
            restTimes: [],
            dates: [],

        }
        if (exercise === undefined) {
            return exercise
        }
        const workoutsCollectionRef = collection(FIRESTORE_DB, 'Workouts');    
        const q = query(workoutsCollectionRef, where('userID', '==', userID));
        const querySnapshot = await getDocs(q);
        
        for (const docSnapshot of querySnapshot.docs) {
        
        const workoutCollectionRef = collection(docSnapshot.ref, 'Workout');
        const q = query(workoutCollectionRef, where('exercise', 'array-contains', exerciseName));

        const workoutQuerySnapshot = await getDocs(q);        
        
        for (const workoutDocSnapshot of workoutQuerySnapshot.docs) {  
            if (workoutDocSnapshot.data().typeOfSet === "super") {
                for (let i = 0; i < workoutDocSnapshot.data().sets.length; i++) {
                    if (workoutDocSnapshot.data().exercise[i] === exerciseName) {                        
                        exercise.dates.push(docSnapshot.data().date);
                        exercise.weights.push(`${workoutDocSnapshot.data().sets[i].weight} kg`)
                        exercise.reps.push(workoutDocSnapshot.data().sets[i].reps)
                        exercise.times.push(`${workoutDocSnapshot.data().sets[i].time} secs`)
                        exercise.restTimes.push(`${workoutDocSnapshot.data().sets[i].restTime/60} mins`)
                    }
                } 
            } 
            else{
                for (let i = 0; i < workoutDocSnapshot.data().sets.length; i++) {
                    if(workoutDocSnapshot.data().sets[i].weight === undefined){
                        exercise.dates.push(docSnapshot.data().date);
                        exercise.weights.push(`${workoutDocSnapshot.data().sets[i].weightLeft} kg/\n${workoutDocSnapshot.data().sets[i].weightRight} kg`)
                        exercise.reps.push(`${workoutDocSnapshot.data().sets[i].repsLeft}/${workoutDocSnapshot.data().sets[i].repsRight}`)
                        exercise.times.push(`${workoutDocSnapshot.data().sets[i].timeLeft} secs/ \n${workoutDocSnapshot.data().sets[i].timeRight} secs`)
                        exercise.restTimes.push(`${workoutDocSnapshot.data().sets[i].restTimeLeft/60} mins/\n${workoutDocSnapshot.data().sets[i].restTimeRight/60} mins`)   
                    }
                    else{
                        exercise.dates.push(docSnapshot.data().date);
                        exercise.weights.push(`${workoutDocSnapshot.data().sets[i].weight} kg`)
                        exercise.reps.push(workoutDocSnapshot.data().sets[i].reps)
                        exercise.times.push(`${workoutDocSnapshot.data().sets[i].time} secs`)
                        exercise.restTimes.push(`${workoutDocSnapshot.data().sets[i].restTime/60} mins`)
                        
                    }
                } 
                
            }        
        }
    }    
    
    return exercise; 
    } catch (error) {
      alert("Couldn't find fields: " + error.message);
      return ;
    }
  };


export const deleteSet = async (userID:string, exerciseName: string, exerciseID: number, setID: number, xpToDelete: number ) => {
    try {  
       const workoutsCollectionRef = collection(FIRESTORE_DB, 'Workouts');    
       const q = query(workoutsCollectionRef, where('userID', '==', userID));
       const querySnapshot = await getDocs(q);
              
       for (const docSnapshot of querySnapshot.docs) {
        const updatedData = { ...docSnapshot.data() };

        for (let i = 0; i < docSnapshot.data().Workout.length; i++) {   
            if(docSnapshot.data().Workout[i].exercise[setID] === exerciseName && i === exerciseID){
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
                 await updateDoc(doc(FIRESTORE_DB, 'Workouts', docSnapshot.id), {
                    Workout: updatedData.Workout
                  });
            }

                
        }
        
        
        
        
    }    
    
    addExperience(userID, xpToDelete);
    } catch (error) {
     alert("Couldn't find fields: " + error.message);
     return ;
   }
}

export const getExercisesByFocus = (userID: string, musclesWorked: string[]): Exercise[] => {
    const [exercises, setExercises] = useState([])
    useEffect(() => {
        const fetchData =async () => {
            try {
                setExercises([]);
                const usersCollectionRef = collection(FIRESTORE_DB, "Users");
                const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
            
                onSnapshot(usersQuery, (snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        const exercisesCollectionRef = collection(doc.ref, "exercises");
                        
                        const exercisesQuery = query(exercisesCollectionRef, where("hidden", "==", false), where("musclesWorked", "array-contains-any", musclesWorked));
                        onSnapshot(exercisesQuery, (snapshot)=> {
                            let data = [];
                            snapshot.docs.forEach((doc) => {
                                data.push(doc.data());
                            })
                            setExercises(data);
                        });
                    });
                });
            } catch (error) {
                alert("Couldn't retrieve exercises: " + error.message);
            }
        };
        
        fetchData()
        
    }, [userID])
    return exercises;
}

export const createNewExercise = async (userID: string, name: string, isUnilateral: boolean, isIsometric: boolean) => {
    try {  
        const usersCollectionRef = collection(FIRESTORE_DB, 'Users' )
        const q = query(usersCollectionRef,where("userID", '==', userID))
        const querySnapshot = await getDocs(q);
 
        for (const docSnapshot of querySnapshot.docs) {
            const exercisesCollectionRef = collection(docSnapshot.ref, 'exercises');
            await addDoc(exercisesCollectionRef, {
                hidden: false,
                isometric: isIsometric,
                name: name,
                unilateral: isUnilateral
              });
        }    

   } catch (error) {
     alert("Couldn't create exercise: " + error.message);
     return ;
   }
}

export const editSet = async (userID:string, exerciseName: string, exerciseID: number, setID: number, changes: object, xpToChange: number ) => {
    try {  
       const workoutsCollectionRef = collection(FIRESTORE_DB, 'Workouts');    
       const q = query(workoutsCollectionRef, where('userID', '==', userID));
       const querySnapshot = await getDocs(q);
              
       for (const docSnapshot of querySnapshot.docs) {
        const updatedData = { ...docSnapshot.data() };

        for (let i = 0; i < docSnapshot.data().Workout.length; i++) {   
            if(docSnapshot.data().Workout[i].exercise[setID] === exerciseName && i === exerciseID){
                
                for (const change in changes) {
                    updatedData.Workout[i][change][setID] = changes[change];
                }
                 await updateDoc(doc(FIRESTORE_DB, 'Workouts', docSnapshot.id), {
                    Workout: updatedData.Workout
                  });
            }

                
        }
        addExperience(userID, xpToChange);

       
   }    
   
   } catch (error) {
     alert("Couldn't find fields: " + error.message);
     return ;
   }
}

export const getUser = (userID: string):User => {
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const fetchData =async () => {
            try {
                setUser({
                    activityLevel: "",
                    age: 0,
                    weeklyExperience: 0,
                    experience: 0,
                    gender: "",
                    height: 0,
                    level: 0,
                    name: "",
                    weight: 0
                });
                const usersCollectionRef = collection(FIRESTORE_DB, "Users");
                const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
            
                onSnapshot(usersQuery, (snapshot) => {
                    let data;
                    snapshot.docs.forEach((doc) => {
                        const userData = {
                            activityLevel: doc.data().activityLevel,
                            age: doc.data().age,
                            weeklyExperience : doc.data().weeklyExperience,
                            experience: doc.data().experience,
                            gender: doc.data().gender,
                            height: doc.data().height,
                            level: doc.data().level,
                            name: doc.data().name,
                            weight: doc.data().weight
                        };
                        data = userData;
                    });
                    setUser(data);
                });
            } catch (error) {
                alert("Couldn't retrieve exercises: " + error.message);
            }
        };
        
        fetchData()
        
    }, [userID])
    return user;
}

export const getTable = async (userID: string): Promise<Table> => {
    const [userToCompareTo, setUserToCompareTo] = useState({
        gender: "",
        height: 0,
        weight: 0,
        level: 0,
        weeklyExperience: 0,
        name: ""
    })

    const [table, setTable] = useState({
        tableHead: ["Position", "Name", "Level", "XP this week"],
        tableData: []
    })

    useEffect(() => {
        const fetchData =async () => {
            try {
                setUserToCompareTo({
                    weeklyExperience: 0,
                    gender: "",
                    height: 0,
                    level: 0,
                    name: "",
                    weight: 0
                });
                const usersCollectionRef = collection(FIRESTORE_DB, "Users");
                const currentUserQuery = query(usersCollectionRef, where("userID", "==", userID));
            
                onSnapshot(currentUserQuery, (snapshot) => {
                    let data;
                    snapshot.docs.forEach((doc) => {
                        data = {
                            weeklyExperience : doc.data().weeklyExperience,
                            gender: doc.data().gender,
                            height: doc.data().height,
                            level: doc.data().level,
                            name: doc.data().name,
                            weight: doc.data().weight
                        };
                    });
                    setUserToCompareTo(data);
                });

                const relatedUsersQuery = query(usersCollectionRef, where("gender", "==", userToCompareTo.gender));

                onSnapshot(relatedUsersQuery, async (snapshot) => {
                    let row = [];
                    snapshot.docs.forEach((doc, index) => {
                        if (doc.data().weight/((doc.data().height/100)**2) >= userToCompareTo.weight/((userToCompareTo.height/100)**2)-5 && 
                            doc.data().weight/((doc.data().height/100)**2) <= userToCompareTo.weight/((userToCompareTo.height/100)**2)+5) {
                            row.push([index,doc.data().name, doc.data().level, doc.data().weeklyExperience])
                        }
                    })
                    await setTable(prev => ({
                        ...prev,
                        tableData: row
                    }))
                })
            } catch (error) {
                alert("Couldn't retrieve exercises: " + error.message);
            }
        };
        
        fetchData()
        
    }, [userID])
    return table;
}


export const resetWeeklyExperience = async (userID:string) => {
    const usersCollection = collection(FIRESTORE_DB, "Users");
    const q = query(usersCollection, where("userID", "==", userID));
    getDocs(q)
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                const updateData = {
                    weeklyExperience: 0
                };
                updateDoc(doc.ref, updateData);
            })            
        })
        .catch(error => {
            alert("Couldn't reset weekly experience " + error);
        })
}

export const editProfile = (userID:string, changes: Profile ) => {
    try {  
        const usersCollectionRef = collection(FIRESTORE_DB, 'Users');    
        const q = query(usersCollectionRef, where('userID', '==', userID));
        
        getDocs(q)
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    const updateData = {
                        name : changes.name,
                        age: changes.age,
                        gender: changes.gender,
                        weight: changes.weight,
                        height: changes.height,
                        activityLevel: changes.activityLevel
                    };
                    updateDoc(doc.ref, updateData);
                })
            })

   } catch (error) {
     alert("Couldn't find fields: " + error.message);
     return ;
   }
}