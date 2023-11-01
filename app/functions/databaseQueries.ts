import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { DocumentData, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { NavigationProp } from "@react-navigation/native";
import { useState, useEffect } from "react";

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
    experience: number;
    gender: string;
    height: number;
    level: number;
    name: string;
    weight: number;
  }
export const signUp =async (name:string, setLoading:React.Dispatch<React.SetStateAction<boolean>>, auth:Auth, email:string, password:string) => {
    setLoading(true);
    try {
        if (name === '')
            throw new Error('Name must be set'); 
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
        }
        const userDocRef = await addDoc(collection(FIRESTORE_DB, 'Users'), userData);
        
        
        const exercisesCollectionRef = collection(FIRESTORE_DB, 'Exercises');
        const exercisesQuerySnapshot = await getDocs(exercisesCollectionRef);
        exercisesQuerySnapshot.forEach(async (exerciseDoc) => {
            const exerciseData = exerciseDoc.data()
            const userSubcollectionRef = collection(userDocRef, 'exercises');
            await addDoc(userSubcollectionRef, exerciseData);
        })
        

        alert('Registered successfully!');
    }   catch (error:any) {
        alert('Registration failed: ' + error.message);
    }   finally{
        setLoading(false);
    }
}

export const setUpProfile =async (field:string, value:any, userID:string, navigation:NavigationProp<any, any>, nextPage:string, system?: string) => {
    try {
        if(field === 'gender')
            if(value === undefined)
                throw new Error(`Gender must be set`);
            
            else if(!(value.toLowerCase() === 'male' || value.toLowerCase() === 'female'))
                throw new Error(`Gender must be set to either male or female`);
            
        if (field === 'age'){
            const today = new Date()      
            const age =  today.getFullYear()-value.getFullYear();      
            
            if(typeof(age) !== 'number')
                throw new Error("Age must be a number");

            if (age < 0)
                throw new Error("Error: Unfortunately this time we cannot sign up time travellers. Sorry for the inconvenience");

            else if (age >= 0 && age < 12)
                throw new Error("Error: You need to be at least 12 years old to sign up");
            else if (age > 120 )
                throw new Error("Error: Aren't you a bit too old (or dead) to work out?");
            value = age;
        }

        if (field === 'weight' || field === 'height') {
            if(Number.isNaN(value))
                throw new Error(`${field} must be set`);
            else if(typeof(value) !== 'number')
                throw new Error(`${field} must be a number`);
            else if(value < 0)
                throw new Error(`${field} can't be a negative number`);
            
        }
        if (field === 'weight' && system === "lbs")
            value = Math.round((value*0.453592)*100)/100;
        if (field === 'height' && system === "ft")
            value = Math.round((value*30.48)*100)/100;
        
        if (field === 'activityLevel' && 
        !(value.value === 'beginner' || value.value === 'intermediate' || value.value === 'advanced') ){
            
            throw new Error(`Please select one of the options`);
        }

    const usersCollection = collection(FIRESTORE_DB, 'Users');
        const q = query(usersCollection, where("userID", '==',userID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
            const userDocRef = doc(FIRESTORE_DB, 'Users', docSnapshot.id);

            if (field === 'activityLevel') {
                const newData = { [field]: value.value,set: true }; 
                await updateDoc(userDocRef, newData);
            } else {
                const newData = { [field]: value}; 
                await updateDoc(userDocRef, newData);
            }
            navigation.navigate(nextPage);
        });  
    }   catch (error:any) {
        alert('Adding data has failed: ' + error.message);
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
            addExperience(userID, xpToAdd);
        } 
    } catch (error) {
        alert(error)
    }
    
}

export const addExperience = async (userID: string, experience: number) => {
    try {
      const usersCollectionRef = collection(FIRESTORE_DB, 'Users');
      const q = query(usersCollectionRef, where('userID', '==', userID));
      const querySnapshot = await getDocs(q);
      const userDocSnapshot = querySnapshot.docs[0];
      const userDocRef = doc(usersCollectionRef, userDocSnapshot.id);

      let currentExperience = userDocSnapshot.data().experience;
      currentExperience += experience;
      let level: number;
      if (currentExperience < 225){
        level = 1;
    }
    else{
        level = Math.floor(Math.log(currentExperience/100)/Math.log(1.5))
    }
    
      await updateDoc(userDocRef, {
        experience: currentExperience,
        level: level
      });
    } catch (error) {
      alert("Couldn't find set field : " + error.message);
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
        addExperience(userID, xpToDelete);
        
    
       
   }    
   
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