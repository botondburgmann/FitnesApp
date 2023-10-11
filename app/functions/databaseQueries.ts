import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { NavigationProp } from "@react-navigation/native";

interface Exercise {
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
        await addDoc(collection(FIRESTORE_DB, 'users'), {userID: response.user.uid, name: name, gender: "", age: 0, weight: 0, height: 0, activityLevel: "", set: false, level: 1, experience: 0});
        
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
            
            /* if(!(value.toLowerCase() === 'male' || value.toLowerCase() === 'female'))
                throw new Error(`Gender must be set to either male or female`); */
            
            // If the field is age then calculate it from date of birth
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
            
            if(typeof(value) !== 'number')
                throw new Error(`${field} must be a number`);
            if(value < 0)
                throw new Error(`${field} can't be a negative number`);
            
        }
        if (field === 'weight' && system === "lbs")
            value = Math.round((value*0.453592)*100)/100;
        if (field === 'height' && system === "ft")
            value = Math.round((value*30.48)*100)/100;
        
        if (field === 'activityLevel'){
            if(!(value === 'beginner' || value === 'intermediate' || value === 'advanced') )
                throw new Error(`Please select one of the options`);

        }

    const usersCollection = collection(FIRESTORE_DB, 'users');
        const q = query(usersCollection, where("userID", '==',userID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
            const userDocRef = doc(FIRESTORE_DB, 'users', docSnapshot.id);

            // After the last step set the set field to true
            if (field === 'activityLevel') {
                const newData = { [field]: value,set: true }; 
                await updateDoc(userDocRef, newData);
            } else {
                const newData = { [field]: value}; 
                await updateDoc(userDocRef, newData);
            }
            // Navigate to the next page        
            navigation.navigate(nextPage);
        });  
    }   catch (error:any) {
        alert('Adding data has failed: ' + error.message);
    }
}

export const getExercises =async (userID: string) => {    
    const data = [];
    const exercisesCollection = collection(FIRESTORE_DB, 'Exercises');
    const q = query(exercisesCollection, where("availableTo", 'array-contains-any', ['all', userID]));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnapshot) => {
        data.push(docSnapshot.data());   
    })
    
    return data;
}

export const addExercise =async (userID:string, date: Date, exercises:(string | Array<string>), sets: Array<Object>, typeOfSet:string) => {
    const workoutsCollection = collection(FIRESTORE_DB, 'Workouts');
    const q = query(workoutsCollection, where("date", '==', date.toDateString()), where("userID", '==', userID) );

    try {
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty){
            const newDocRef = await addDoc(workoutsCollection, {
                date: date.toDateString(),
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
    const exercisesCollection = collection(FIRESTORE_DB, 'users');
    const q = query(exercisesCollection, where("userID", '==', userID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnapshot) => {
        data = docSnapshot.data().gender;   
    })
    
    return data;
}

export const getSetUpValue = async (userID: string) => {
    try {
      const usersCollectionRef = collection(FIRESTORE_DB, 'users');
      const q = query(usersCollectionRef, where('userID', '==', userID));
      const querySnapshot = await getDocs(q);
      const userDocSnapshot = querySnapshot.docs[0];
      const setUpValue = userDocSnapshot.data().set;
      return setUpValue;
    } catch (error) {
      alert("Couldn't find set field : " + error.message);
    }
  };
export const addExperience = async (userID: string, experience) => {
    try {
      const usersCollectionRef = collection(FIRESTORE_DB, 'users');
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

export const getName =async (userID:string) => {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
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
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const q = query(usersCollectionRef, where('userID', '==', userID));
        const querySnapshot = await getDocs(q);
        const userDocSnapshot = querySnapshot.docs[0];
        const level = userDocSnapshot.data().level;
        return level;
      } catch (error) {
        alert("Couldn't find set field : " + error.message);
      }
}
export const getExperience   =async (userID:string) => {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const q = query(usersCollectionRef, where('userID', '==', userID));
        const querySnapshot = await getDocs(q);
        const userDocSnapshot = querySnapshot.docs[0];
        const experience = userDocSnapshot.data().experience;
        return experience;
      } catch (error) {
        alert("Couldn't find experience field : " + error.message);
      }
}

export const getExerciseWithMostWeight = async (userID: string): Promise<Exercise> => {
    try {
        const exerciseWithMostWeight: Exercise = {
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
            
      return exerciseWithMostWeight;
    } catch (error) {
      alert("Couldn't find fields: " + error.message);
      return ;
    }
  };


export const getExerciseWithMostReps = async (userID: string): Promise<Exercise> => {
    try {
        const exerciseWithMostReps: Exercise = {
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
            
    return exerciseWithMostReps;
    } catch (error) {
      alert("Couldn't find fields: " + error.message);
      return ;
    }
  };
  