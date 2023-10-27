import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { NavigationProp } from "@react-navigation/native";

interface Exercise{
    name: string;
    musclesWorked: string[];
    availableTo: string[];
    unilateral: boolean;
}

interface BestExercise {
    name: string;
    weight: number;
    reps: number;
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
        !(value === 'beginner' || value === 'intermediate' || value === 'advanced') )
            throw new Error(`Please select one of the options`);

    const usersCollection = collection(FIRESTORE_DB, 'Users');
        const q = query(usersCollection, where("userID", '==',userID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
            const userDocRef = doc(FIRESTORE_DB, 'Users', docSnapshot.id);

            if (field === 'activityLevel') {
                const newData = { [field]: value,set: true }; 
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
export const getSetUpValue = async (userID: string) => {
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
  
  export const getName =async (userID:string): Promise<string> => {
      try {
          const usersCollectionRef = collection(FIRESTORE_DB, 'Users');
          const q = query(usersCollectionRef, where('userID', '==', userID));
          const querySnapshot = await getDocs(q);
          const userDocSnapshot = querySnapshot.docs[0];
          const name = userDocSnapshot.data().name;
          return name;
        } catch (error) {
          alert("Couldn't find set field : " + error.message);
        }
  }
  
  export const getLevel =async (userID:string) => {
      try {
          const usersCollectionRef = collection(FIRESTORE_DB, 'Users');
          const q = query(usersCollectionRef, where('userID', '==', userID));
          const querySnapshot = await getDocs(q);
          const userDocSnapshot = querySnapshot.docs[0];
          const level = userDocSnapshot.data().level;
          return level;
        } catch (error) {
          alert("Couldn't find set field : " + error.message);
        }
  }
  export const getExperienceNeeded   =async (userID:string) => {
      try {
          const usersCollectionRef = collection(FIRESTORE_DB, 'Users');
          const q = query(usersCollectionRef, where('userID', '==', userID));
          const querySnapshot = await getDocs(q);
          const userDocSnapshot = querySnapshot.docs[0];
          const experience = userDocSnapshot.data().experience;
          const level = userDocSnapshot.data().level
          return Math.round(100*1.5**(level+1)-experience)
      } catch (error) {
          alert("Couldn't find experience field : " + error.message);
        }
  }
  
  export const getExerciseWithMostWeight = async (userID: string): Promise<BestExercise> => {
      try {
          const exerciseWithMostWeight: BestExercise = {
              name: "",
              weight: 0,
              reps: 0,
          }
    
      const workoutsCollectionRef = collection(FIRESTORE_DB, 'Workouts');
      const q = query(workoutsCollectionRef, where('userID', '==', userID));
      const querySnapshot = await getDocs(q);
    
      for (const docSnapshot of querySnapshot.docs) {
          const workoutCollectionRef = collection(docSnapshot.ref, 'Workout');
          const workoutQuerySnapshot = await getDocs(workoutCollectionRef);
    
          for (const workoutDocSnapshot of workoutQuerySnapshot.docs) {
              const sets = workoutDocSnapshot.data().sets;
              const exercises = workoutDocSnapshot.data().exercise;
            
              for (let i = 0; i < sets.length; i++) {
                  if (sets[i].weight === undefined) {
                      if (sets[i].weightLeft > exerciseWithMostWeight.weight || sets[i].weightRight > exerciseWithMostWeight.weight ) {
                          sets[i].weightLeft > sets[i].weightRight ? exerciseWithMostWeight.weight = sets[i].weightLeft : exerciseWithMostWeight.weight = sets[i].weightRight
                          sets[i].weightLeft > sets[i].weightRight ? exerciseWithMostWeight.reps = sets[i].repsLeft : exerciseWithMostWeight.reps = sets[i].repsRight
                          exerciseWithMostWeight.name = exercises[i];
                      }  
                      else if (sets[i].weightLeft === exerciseWithMostWeight.weight || sets[i].weightRight === exerciseWithMostWeight.weight ) 
                          if (sets[i].repsLeft > exerciseWithMostWeight.reps || sets[i].repsRight > exerciseWithMostWeight.reps ) {
                              sets[i].weightLeft > sets[i].weightRight ? exerciseWithMostWeight.weight = sets[i].weightLeft : exerciseWithMostWeight.weight = sets[i].weightRight
                              sets[i].weightLeft > sets[i].weightRight ? exerciseWithMostWeight.reps = sets[i].repsLeft : exerciseWithMostWeight.reps = sets[i].repsRight
                              exerciseWithMostWeight.name = exercises[i];
                          }   
                  }
                  else{
                      if (sets[i].weight > exerciseWithMostWeight.weight) {
                          exerciseWithMostWeight.weight = sets[i].weight;
                          exerciseWithMostWeight.reps = sets[i].reps;
                          exerciseWithMostWeight.name = exercises[i];
                      }  
                      else if (sets[i].weight === exerciseWithMostWeight.weight) 
                          if (sets[i].reps > exerciseWithMostWeight.reps) {
                              exerciseWithMostWeight.weight = sets[i].weight;
                              exerciseWithMostWeight.reps = sets[i].reps;
                              exerciseWithMostWeight.name = exercises[i];
                          }                                       
                  }
              }
          }
        }
              
        return exerciseWithMostWeight;
      } catch (error) {
        alert("Couldn't find fields: " + error.message);
        return ;
      }
    };
  
  
  export const getExerciseWithMostReps = async (userID: string): Promise<BestExercise> => {
      try {
          const exerciseWithMostReps: BestExercise = {
              name: "",
              weight: 0,
              reps: 0,
          }
    
      const workoutsCollectionRef = collection(FIRESTORE_DB, 'Workouts');
      const q = query(workoutsCollectionRef, where('userID', '==', userID));
      const querySnapshot = await getDocs(q);
    
      for (const docSnapshot of querySnapshot.docs) {
          const workoutCollectionRef = collection(docSnapshot.ref, 'Workout');
          const workoutQuerySnapshot = await getDocs(workoutCollectionRef);
    
          for (const workoutDocSnapshot of workoutQuerySnapshot.docs) {
              const sets = workoutDocSnapshot.data().sets;
              const exercises = workoutDocSnapshot.data().exercise;
            
              for (let i = 0; i < sets.length; i++) {
                  if (sets[i].reps === undefined) {
                      if (sets[i].repsLeft > exerciseWithMostReps.weight || sets[i].repsRight > exerciseWithMostReps.reps ) {
                          sets[i].repsLeft > sets[i].repsRight ? exerciseWithMostReps.weight = sets[i].repsLeft : exerciseWithMostReps.weight = sets[i].repsRight
                          sets[i].repsLeft > sets[i].repsRight ? exerciseWithMostReps.reps = sets[i].repsLeft : exerciseWithMostReps.reps = sets[i].repsRight
                          exerciseWithMostReps.name = exercises[i];
                      }  
                      else if (sets[i].repsLeft === exerciseWithMostReps.weight || sets[i].repsRight === exerciseWithMostReps.weight ) 
                          if (sets[i].repsLeft > exerciseWithMostReps.reps || sets[i].repsRight > exerciseWithMostReps.reps ) {
                              sets[i].repsLeft > sets[i].repsRight ? exerciseWithMostReps.weight = sets[i].repsLeft : exerciseWithMostReps.weight = sets[i].repsRight
                              sets[i].repsLeft > sets[i].repsRight ? exerciseWithMostReps.reps = sets[i].repsLeft : exerciseWithMostReps.reps = sets[i].repsRight
                              exerciseWithMostReps.name = exercises[i];
                          }   
                  }
                  else{
                      
                      if (sets[i].reps > exerciseWithMostReps.reps) {
                          exerciseWithMostReps.weight = sets[i].weight;
                          exerciseWithMostReps.reps = sets[i].reps;
                          exerciseWithMostReps.name = exercises[i];
                      }  
                      else if (sets[i].reps === exerciseWithMostReps.reps) 
                          if (sets[i].weight > exerciseWithMostReps.weight) {
                              exerciseWithMostReps.weight = sets[i].weight;
                              exerciseWithMostReps.reps = sets[i].reps;
                              exerciseWithMostReps.name = exercises[i];
                          }                                       
                  }  
                                                         
              }
          }
      }
              
      return exerciseWithMostReps;
      } catch (error) {
        alert("Couldn't find fields: " + error.message);
        return ;
      }
    };
 export const getExercises =async (userID: string):Promise<Exercise[]> => {    
    try {  
        const exercises = []
        const usersCollectionRef = collection(FIRESTORE_DB, 'Users' )
        const q = query(usersCollectionRef,where("userID", '==', userID))
        const querySnapshot = await getDocs(q);
 
        for (const docSnapshot of querySnapshot.docs) {
            const exercisesCollectionRef = collection(docSnapshot.ref, 'exercises');
            const exercisesQuerySnapshot = await getDocs(exercisesCollectionRef);        

            for (const exerciseDocSnapshot of exercisesQuerySnapshot.docs)
                exercises.push(exerciseDocSnapshot.data())
        }    

   return exercises; 
   } catch (error) {
     alert("Couldn't find fields: " + error.message);
     return ;
   }
}

export const toggleExerciseVisibilty =async (userID: string, exerciseName: string) => {
    try {  
        const usersCollectionRef = collection(FIRESTORE_DB, 'Users' )
        const q = query(usersCollectionRef,where("userID", '==', userID))
        const querySnapshot = await getDocs(q);
 
        for (const docSnapshot of querySnapshot.docs) {
            const exercisesCollectionRef = collection(docSnapshot.ref, 'exercises');
            const q = query(exercisesCollectionRef,where("name", '==', exerciseName))
            const exercisesQuerySnapshot = await getDocs(q);      

            for (const exerciseDocSnapshot of exercisesQuerySnapshot.docs){


                if (exerciseDocSnapshot.data().hidden === true) {
                   const updateData = {
                    hidden: false 
                  };
                  await updateDoc(exerciseDocSnapshot.ref, updateData);
                   
                }else{
                    const updateData = {
                        hidden: true 
                      };
                      await updateDoc(exerciseDocSnapshot.ref, updateData);
                    
                }
                return exerciseDocSnapshot.data().hidden

            }

                
        }    
   } catch (error) {
     alert("Couldn't find fields: " + error.message);
     return ;
   }
}

export const getWorkout = async (userID: string, date: string) => {
    try {  
         const workout = {
            ids: [],
            sets: [],
            exercises: [],
            typeOfSets: [],
            timeStamps: []

        }
    const workoutsCollectionRef = collection(FIRESTORE_DB, 'Workouts');    
    const q = query(workoutsCollectionRef, where('userID', '==', userID), where('date', '==', date));
    const querySnapshot = await getDocs(q);
  
    for (const docSnapshot of querySnapshot.docs) {
        const workoutCollectionRef = collection(docSnapshot.ref, 'Workout');
        const workoutQuerySnapshot = await getDocs(workoutCollectionRef);        

        for (const workoutDocSnapshot of workoutQuerySnapshot.docs) {    
            workout.ids.push(workoutDocSnapshot.id);        
            workout.exercises.push(workoutDocSnapshot.data().exercise);
            workout.sets.push(workoutDocSnapshot.data().sets);
            workout.typeOfSets.push(workoutDocSnapshot.data().typeOfSet);
            workout.timeStamps.push(workoutDocSnapshot.data().createdAt);
          

        }
    
    }    
    return workout; 
    } catch (error) {
      alert("Couldn't find fields: " + error.message);
      return ;
    }
  };

export const addExercise =async (userID:string, date: string, exercises:(string | Array<string>), sets: Array<Object>, typeOfSet:string) => {
    const workoutsCollection = collection(FIRESTORE_DB, 'Workouts');
    const q = query(workoutsCollection, where("date", '==', date), where("userID", '==', userID) );

    try {
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty){
            const newDocRef = await addDoc(workoutsCollection, {
                date: date,
                userID: userID
            });
            
            const setsRef = collection(newDocRef, 'Workout');

            await addDoc(setsRef, {
                exercise: exercises,
                sets: sets,
                typeOfSet: typeOfSet,
                createdAt: serverTimestamp()
              });
        } else {
            querySnapshot.forEach(async (doc) => {
                const setsRef = collection(doc.ref, 'Workout');
                
                await addDoc(setsRef, {
                    exercise: exercises,
                    sets: sets,
                    typeOfSet: typeOfSet,
                    createdAt: serverTimestamp()
                });
            }); 
        }

    } catch (error) {
        alert(error)
    }
    
}

export const getGender =async (userID:string) => {
    let data = "";
    const exercisesCollection = collection(FIRESTORE_DB, 'Users');
    const q = query(exercisesCollection, where("userID", '==', userID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnapshot) => {
        data = docSnapshot.data().gender;   
    })
    
    return data;
}


export const addExperience = async (userID: string, experience) => {
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

export const deleteExercise =async (userID:string, exerciseID: string, xpToDelete: number ) => {
    try {  
       const workoutsCollectionRef = collection(FIRESTORE_DB, 'Workouts');    
       const q = query(workoutsCollectionRef, where('userID', '==', userID));
       const querySnapshot = await getDocs(q);
              
       for (const docSnapshot of querySnapshot.docs) {
        const workoutCollectionRef = collection(docSnapshot.ref, 'Workout');
        const nestedDocumentRef  = doc(workoutCollectionRef, exerciseID);
        const nestedDocumentSnapshot = await getDoc(nestedDocumentRef);

         if (nestedDocumentSnapshot.exists()) {
            await deleteDoc(nestedDocumentRef);   
            addExperience(userID,xpToDelete);
        }
        
        
    
       
   }    
   
   } catch (error) {
     alert("Couldn't find fields: " + error.message);
     return ;
   }
}

export const getExercisesByFocus =async (userID: string, musclesWorked: string[]):Promise<Exercise[]> => {    
    const data = [];
    const exercisesCollection = collection(FIRESTORE_DB, 'Exercises');
    const q = query(exercisesCollection, where('musclesWorked', 'array-contains-any', musclesWorked));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnapshot) => {
        data.push(docSnapshot.data());   
    })
    
    return data;
}