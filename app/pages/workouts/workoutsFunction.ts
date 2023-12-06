import { collection, query, where, getDocs, updateDoc, Unsubscribe, onSnapshot, addDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import { Sets, SingleSet, User, WeekRange } from "../../types and interfaces/types";
import { getWorkoutDocs, updateAchievement } from "../../functions/firebaseFunctions";
import { NavigationProp } from "@react-navigation/native";


export function addXP(isIsometric:boolean, set: SingleSet): number {
    if (!isIsometric && set.weight === 0) return set.reps;
    if (!isIsometric && set.weight !== 0) return set.reps * set.weight;
    if (isIsometric && set.weight === 0) return set.time;
    return set.time * set.weight;

}

export function removeXP (repOrTime: number, weight: number): number {
    if (weight === 0) return -repOrTime;
    return -(repOrTime * weight);
}
export async function addTotalExperienceToFirebase  (experience: number, date: Date, userID: string, week: WeekRange ): Promise<void>  {
    try {        
        const usersCollectionRef = collection(FIRESTORE_DB,"Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const firstUsersSnapshot = await getDocs(usersQuery);
        const firstUserDoc = firstUsersSnapshot.docs[0];
                
        if (week.start <= date && date <= week.end) {            
            const firstUpdatedData = {
                experience: firstUserDoc.data().experience+experience,
                weeklyExperience: firstUserDoc.data().weeklyExperience+experience,
            }
            await updateDoc(firstUserDoc.ref, firstUpdatedData);
        }
        else{
            const firstUpdatedData = {
                experience: firstUserDoc.data().experience+experience,
            }
            await updateDoc(firstUserDoc.ref, firstUpdatedData);
        }
        
        const secondUsersSnapshot = await getDocs(usersQuery);
        const secondUserDoc = secondUsersSnapshot.docs[0];
        const secondUserData = secondUserDoc.data() as User;
        const secondUpdateData = {
            level: secondUserData.experience < 225 ? 1 : Math.floor(Math.log(secondUserData.experience / 100) / Math.log(1.5)),
        };
        
        updateDoc(secondUserDoc.ref, secondUpdateData);
    } 
    catch (error: any) {
        alert(`Error: Couldn't update experience and level fields: ${error.message}`)
    }
}

export function getWorkout (userID: string | null, date: Date | null, callback: Function): Unsubscribe | undefined {
    try {
        if (date === null){
            alert("Date is not set")
            return;
        }
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
        const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID), where("date", "==", date.toDateString()));
        
        const unsubscribeFromWorkouts = onSnapshot(workoutsQuery, workoutsSnapshot => {
            if (!workoutsSnapshot.empty) {
                const allExercises: Sets[] = [];
                workoutsSnapshot.docs.forEach(workout => {
                    for (let i = 0; i < workout.data().Workout.length; i++) {
                        let currentExercise: Sets = {
                            dates:  workout.data().date,
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
        return unsubscribeFromWorkouts;
    } catch (error: any) {
        alert(`Error: couldn't fetch workout: ${error}`);
    }
}

 
export function updateStrengthBuilderAchievement (set: Sets, userID: string):void {        
    for (const weight of set.weights) {
        if (weight >= 60 && weight < 80)                
            updateAchievement(userID, "Strength Builder", 1);
        else if (weight >= 80 && weight < 100)
            updateAchievement(userID, "Strength Builder", 2);
        else if (weight >= 100)
            updateAchievement(userID, "Strength Builder", 3);
    }
}
export function updateEnduranceMasterAchievement (set: Sets, userID: string):void {  
    for (const rep of set.reps) {
        if (rep >= 20 && rep < 50)
            updateAchievement(userID, "Endurance Master", 1);
        else if (rep >= 50 && rep < 75)
            updateAchievement(userID, "Endurance Master", 2);
        else if (rep >= 75 && rep < 100)
            updateAchievement(userID, "Endurance Master", 3);
        else if (rep >= 100)
            updateAchievement(userID, "Endurance Master", 4);
    }

}

export async function updateConsistencyStreakAchievement (userID: string):Promise<void>{
    const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
    const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
    const workoutsSnapshot = await getDocs(workoutsQuery);
    const dates: string[] = []
    for (const workoutDoc of workoutsSnapshot.docs) {
        dates.push(workoutDoc.data().date);
    }
    if (dates.length === 10)
        updateAchievement(userID, "Consistency Streak", 1);
    else if (dates.length === 30)
        updateAchievement(userID, "Consistency Streak", 2);
    else if (dates.length === 60)
        updateAchievement(userID, "Consistency Streak", 3);
    else if (dates.length === 90)
        updateAchievement(userID, "Consistency Streak", 4);
    else if (dates.length === 120)
        updateAchievement(userID, "Consistency Streak", 5);
}
export async function updateDedicatedAthleteAchievement (userID: string):Promise<void> {
      try {
            const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
            const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
            const workoutsSnapshot = await getDocs(workoutsQuery);
            const dates: string[] = []
            for (const workoutDoc of workoutsSnapshot.docs)
                dates.push(workoutDoc.data().date);

            const sortedDates = sortDates(dates);
            const daysBetweenFirstAndlastDates = calculateDaysBetweenDates(sortedDates);

            if (daysBetweenFirstAndlastDates !== undefined && sortedDates !== undefined && 
            daysBetweenFirstAndlastDates >= 30 && daysBetweenFirstAndlastDates < 90 && sortedDates.length >= 4 && sortedDates.length <= 30)
                updateAchievement(userID, "Dedicated Athlete", 1);

            else if (daysBetweenFirstAndlastDates !== undefined && sortedDates !== undefined && 
            daysBetweenFirstAndlastDates >= 90 && daysBetweenFirstAndlastDates < 182 && sortedDates.length >= 13 && sortedDates.length <= 90)
                updateAchievement(userID, "Dedicated Athlete", 2);

            else if (daysBetweenFirstAndlastDates !== undefined && sortedDates !== undefined && 
            daysBetweenFirstAndlastDates >= 182 && daysBetweenFirstAndlastDates < 273 && sortedDates.length >= 26 && sortedDates.length <= 182)
                updateAchievement(userID, "Dedicated Athlete", 3);

            else if (daysBetweenFirstAndlastDates !== undefined && sortedDates !== undefined &&
            daysBetweenFirstAndlastDates >= 273 && daysBetweenFirstAndlastDates < 365 && sortedDates.length >= 39 && sortedDates.length <= 273)
                updateAchievement(userID, "Dedicated Athlete", 4);

            else if (daysBetweenFirstAndlastDates !== undefined && sortedDates !== undefined && 
            daysBetweenFirstAndlastDates >= 365 && sortedDates.length >= 52 && sortedDates.length <= 365)
                updateAchievement(userID, "Dedicated Athlete", 5);

      } catch (error: any) {
          alert(`Error: Couldn't update achievement: ${error}`)
      }
}

function sortDates (dates: string[]): string[] | undefined{
    try {
        const dateObjects = dates.map(dateString => new Date(dateString));
        dateObjects.sort((a, b) => a.getTime() - b.getTime());
        const sortedDates = dateObjects.map(dateObject => dateObject.toString());
        return sortedDates;
    } catch (error: any) {
        alert(`Error: Couldn't sort dates`);
    }
};
function calculateDaysBetweenDates (dates:string[] | undefined): number | undefined {
try {
    let timeDifferenceInDays = 0;
    if (dates !== undefined && dates.length >= 2) {
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        
        const firstDateObject = new Date(firstDate);
        const lastDateObject = new Date(lastDate);
        
        const timeDifferenceInMilliseconds = lastDateObject.getTime() - firstDateObject.getTime();
        
        timeDifferenceInDays = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
        
    } 
    return timeDifferenceInDays;
} catch (error: any) {
    alert(`Error: Couldn't calculate days between two dates: ${error}`)
}
}

export async function finishExercise (sets: Sets, userID: string | null, date: Date | null, week: WeekRange | null,  totalXP: number, navigation?: NavigationProp<any, any>,): Promise<void> {
    try {
        if (userID === null) throw new Error("User is not authorized");   
        if (date === null) throw new Error("Date is not set");
        if (week === null) throw new Error("Week is not set");
            
        await addSetsToFirebase(totalXP, userID, date, week, sets );
        if (navigation) {
            navigation.navigate("Log")
        }
    } catch (error:any) {
        throw new Error(`Error: Couldn't add sets to database: ${error}`);
    }
}

async function addSetsToFirebase (experience: number, userID: string, date: Date, week: WeekRange, sets: Sets): Promise<void>{
    try {   
      const workoutsSnapshot = await getWorkoutDocs(userID,date);      
      if (workoutsSnapshot === undefined){
        const workout = [];
        workout.push(sets);
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
        await addDoc(workoutsCollectionRef, {
          date: date.toDateString(),
          userID: userID,
          Workout: workout
        });
      }
      else{
        const newWorkout = [...workoutsSnapshot.data().Workout, sets]
        await updateDoc(doc(FIRESTORE_DB, "Workouts", workoutsSnapshot.id), {
            Workout: newWorkout
        });
      }

      updateStrengthBuilderAchievement(sets, userID);
      updateEnduranceMasterAchievement(sets, userID);
      updateConsistencyStreakAchievement(userID);
      updateDedicatedAthleteAchievement(userID);
             
      addTotalExperienceToFirebase(experience, date, userID, week);
  } 
  catch (error: any) {
      alert(`Error: Couldn't add set: ${error.message}`)
  } 
}

export function isSuperSet (exercise: Sets, uniqueExercises: string[]): boolean {
    for (let i = 0; i < exercise.restTimes.length; i+= uniqueExercises.length) 
        if (exercise.restTimes[i] > 0) 
            return false;
    if (uniqueExercises.length === 1)
        return false;
    return true;
}



export function isDropSet (exercise:Sets, uniqueExercises: string[] ): boolean {
    if (exercise.restTimes.length === 1 )
        return false;
    for (let i = 0; i < exercise.restTimes.length-1; i++) 
        if (!(uniqueExercises.length === 1 &&  isDecreasing(exercise.weights) && exercise.restTimes[i] === 0))
            return false;
    return true;
}

function isDecreasing (array: number[]): boolean{  
    for (let i = 1; i <= array.length; i++)
        if (array[i-1] <= array[i] )
            return false;
    return true;
}



export function validateData(isIsometric:boolean, reps: number, time: number, restTime: number): void {
    if (!isIsometric && reps === 0) 
        throw new Error("Repetition number is required for non-isometric exercises");
    if (reps < 0) 
        throw new Error("Repetition number must be a positive number");
    if (isIsometric && time === 0 ) 
        throw new Error("Time is required for non-isometric exercises");
    if (time < 0) 
        throw new Error("Time must be a positive number");
    if (restTime < 0) 
        throw new Error("Rest time must be a positive number");
}