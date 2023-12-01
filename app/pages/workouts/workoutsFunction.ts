import { collection, query, where, getDocs, updateDoc, Unsubscribe, onSnapshot, addDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import { Achievement, Sets, User, WeekRange } from "../../types and interfaces/types";
import { getWorkoutDocs, updateAchievementStatus } from "../../functions/firebaseFunctions";
import { NavigationProp } from "@react-navigation/native";
import { SingleSet } from "../exercises/types";

export function addXP (isIsometric: boolean, sets: Sets): number | undefined {
    try {
        let currentExperience = 0;
        if (isIsometric) 
            for (let i = 0; i < sets.times.length; i++) {
                if (sets.weights[i] === 0 || Number.isNaN(sets.weights[i]))
                    currentExperience += sets.times[i];
                else
                    currentExperience += sets.times[i] * sets.weights[i];
            }
        else
            for (let i = 0; i < sets.reps.length; i++) {
                if (sets.weights[i] === 0 || Number.isNaN(sets.weights[i]))
                    currentExperience += sets.reps[i];
                else
                    currentExperience += sets.reps[i] * sets.weights[i];
            }
        return currentExperience;
    }   catch (error: any) {
        alert(`Error: Couldn't add experience point: ${error}`);
    }
};

export function removeXP (repOrTime: number, weight: number): number {
    let currentExperience = 0;    
    if (weight === 0)
        currentExperience -= repOrTime;
    else 
        currentExperience -= repOrTime * weight;
    
    return currentExperience;
};
export async function addTotalExperienceToFirebase  (experience: number, date: Date, userID: string, week: WeekRange ): Promise<void>  {
    try {        
        const usersCollectionRef = collection(FIRESTORE_DB,"Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const firstUsersSnapshot = await getDocs(usersQuery);
        const firstUserDoc = firstUsersSnapshot.docs[0];
                
        if (week !== null && week.start <= date && date <= week.end) {            
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
        
        await updateDoc(secondUserDoc.ref, secondUpdateData);
    } 
    catch (error) {
        alert(`Error: Couldn't update experience and level fields: ${error}`)
    }
};

export function convertFieldsToNumeric(set: SingleSet): SingleSet {
    const numericData = {
        exercise: set.exercise,
        reps: set.reps,
        restTime: set.restTime,
        side: set.side,
        time: set.time,
        weight: set.weight,
    }
    if (Number.isNaN(set.weight))
      numericData.weight = 0
    if (Number.isNaN(set.reps))
      numericData.reps = 0    
    if (Number.isNaN(set.time))
      numericData.time = 0     
    if (Number.isNaN(set.restTime))
      numericData.restTime = 0;
    return numericData
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
};

 
export async function updateStrengthBuilderAchievement (set: Sets, userID: string): Promise<Achievement | undefined> {
    try {        
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
          if (weight >= 80 && weight < 100) {
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
            if (weight >= 100) {
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

          const achievementsCollectionRef = collection(FIRESTORE_DB, "Achievements");
          const achievementsQuery = query(achievementsCollectionRef, where("name", "==", "Strength Builder"))
          const achievementsSnapshot = await getDocs(achievementsQuery);
          if (!achievementsSnapshot.empty) {
            const achievementDoc = achievementsSnapshot.docs[0];
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
                    return achievement
                }
                
            }
          }
      }
    } catch (error: any) {
        alert(`Couldn't update achievement: ${error}`)
    }
};
export  async function updateEnduranceMasterAchievement (set: Sets, userID: string): Promise<Achievement | undefined> {
    try {
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
            if (rep >= 50 && rep < 75) {
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
            if (rep >= 75 && rep < 100) {
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
            if (rep >= 100) {
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
            const achievementsCollectionRef = collection(FIRESTORE_DB, "Achievements");
            const achievementsQuery = query(achievementsCollectionRef, where("name", "==", "Endurance Master"))
            const achievementsSnapshot = await getDocs(achievementsQuery);
            if (!achievementsSnapshot.empty) {
              const achievementDoc = achievementsSnapshot.docs[0];
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
                      return achievement
                  }
                  
              }
            }
      }
    } catch (error: any) {
        alert(`Error: Couldn't update achievement: ${error}`)    
    }
};

export async function updateConsistencyStreakAchievement (userID: string | null): Promise<Achievement | undefined>{
    try {
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
        if (dates.length === 30) {
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
        if (dates.length === 60) {
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
        if (dates.length === 90) {
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
        if (dates.length === 120) {
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
        const achievementsCollectionRef = collection(FIRESTORE_DB, "Achievements");
        const achievementsQuery = query(achievementsCollectionRef, where("name", "==", "Consistency Streak"))
        const achievementsSnapshot = await getDocs(achievementsQuery);
        if (!achievementsSnapshot.empty) {
            const achievementDoc = achievementsSnapshot.docs[0];
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
                    return achievement
                }
                
            }
        }
    } catch (error: any) {
        alert(`Error: Couldn't update achievement: ${error}`)
    }

};
export async function updateDedicatedAthleteAchievement (userID: string | null): Promise<Achievement | undefined> {
      try {
          const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
          const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
          const workoutsSnapshot = await getDocs(workoutsQuery);
          const dates: string[] = []
          for (const workoutDoc of workoutsSnapshot.docs) {
              dates.push(workoutDoc.data().date);
          }
          const sortedDates = sortDates(dates);
          const daysBetweenFirstAndlastDates = calculateDaysBetweenDates(sortedDates);
          if (daysBetweenFirstAndlastDates !== undefined && sortedDates !== undefined && daysBetweenFirstAndlastDates >= 30 && daysBetweenFirstAndlastDates < 90 && sortedDates.length >= 4 && sortedDates.length <= 30) {
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
            if (daysBetweenFirstAndlastDates !== undefined && sortedDates !== undefined && daysBetweenFirstAndlastDates >= 90 && daysBetweenFirstAndlastDates < 182 && sortedDates.length >= 13 && sortedDates.length <= 90) {
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
            if (daysBetweenFirstAndlastDates !== undefined && sortedDates !== undefined && daysBetweenFirstAndlastDates >= 182 && daysBetweenFirstAndlastDates < 273 && sortedDates.length >= 26 && sortedDates.length <= 182) {
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
            if (daysBetweenFirstAndlastDates !== undefined && sortedDates !== undefined && daysBetweenFirstAndlastDates >= 273 && daysBetweenFirstAndlastDates < 365 && sortedDates.length >= 39 && sortedDates.length <= 273) {
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
            if (daysBetweenFirstAndlastDates !== undefined && sortedDates !== undefined && daysBetweenFirstAndlastDates >= 365 && sortedDates.length >= 52 && sortedDates.length <= 365) {
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
            const achievementsCollectionRef = collection(FIRESTORE_DB, "Achievements");
            const achievementsQuery = query(achievementsCollectionRef, where("name", "==", "Dedicated Athlete"))
            const achievementsSnapshot = await getDocs(achievementsQuery);
            if (!achievementsSnapshot.empty) {
              const achievementDoc = achievementsSnapshot.docs[0];
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
                      return achievement
                  }
                  
              }
            }
      
      } catch (error: any) {
          alert(`Error: Couldn't update achievement: ${error}`)
      }
};

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
};

export async function finishExercise (sets: Sets, userID: string | null, date: Date | null, week: WeekRange | null, 
                                navigation: NavigationProp<any, any>, setSets?: Function) {
    try {

        if (userID === null){
            alert("User is not set");
            return;
        }
        if (week === null){
            alert("Week is not set");
            return
        }
        if (date === null){
            alert("Date is not set");
            return;
        }
        if (sets.exercise.length === 0){
            alert("Not enough sets");
            return;
        }
        const experience = calculateExperience(sets);        
        await addSetToFirebase(experience, userID, date, week, sets );
        setSets && setSets({
        exercise : [],
        weights: [],
        reps: [],
        times: [],
        restTimes: [],
        sides: []
        });
        navigation.navigate("Log")
    } catch (error:any) {
        throw new Error(`Error: Couldn't add sets to database: ${error}`);
    }
};

function calculateExperience(sets: Sets): number {
let experience = 0;
for (let i = 0; i < sets.exercise.length; i++) {
    let result = addXP(sets.reps[i] === 0, sets);
    if (result !== undefined)
        experience += result;
}

return experience;
};
  

async function addSetToFirebase (experience: number, userID: string, date: Date, week: WeekRange, sets: any): Promise<void>{
    try {   
      const workoutsSnapshot = await getWorkoutDocs(userID,date);      
      const data = {
          exercise : sets.exercise,
          weights: sets.weights,
          reps: sets.reps,
          times: sets.times,
          restTimes: sets.restTimes,
          sides: sets.sides
      };
      if (workoutsSnapshot === undefined){
        const workout = [];
        workout.push(data);
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");
        await addDoc(workoutsCollectionRef, {
          date: date.toDateString(),
          userID: userID,
          Workout: workout
        });
      }
      else{
        const newWorkout = [...workoutsSnapshot.data().Workout, data]
        await updateDoc(doc(FIRESTORE_DB, "Workouts", workoutsSnapshot.id), {
            Workout: newWorkout
        });
      }

      const updatedStrengthBuilderAchievement = await updateStrengthBuilderAchievement(sets, userID);
      if (updatedStrengthBuilderAchievement === undefined){
        alert("Strength builder achievement is undefined");
        return;
      }
      updateAchievementStatus(userID, updatedStrengthBuilderAchievement);

      const updatedEnduranceMasterAchievement = await updateEnduranceMasterAchievement(sets, userID);
      if (updatedEnduranceMasterAchievement === undefined){
        alert("Endurance master achievement is undefined");
        return;
      }
      updateAchievementStatus(userID, updatedEnduranceMasterAchievement);

      const updatedConsistencyStreakAchievement = await updateConsistencyStreakAchievement(userID);
      if (updatedConsistencyStreakAchievement === undefined){
        alert("Consistency streak achievement is undefined");
        return;
      }
      updateAchievementStatus(userID, updatedConsistencyStreakAchievement);

      const updatedDedicatedAthleteAchievement = await updateDedicatedAthleteAchievement(userID);
      if (updatedDedicatedAthleteAchievement === undefined){
        alert("Dedicated athlete achievement is undefined");
        return;
      }
      updateAchievementStatus(userID, updatedDedicatedAthleteAchievement);

             
      addTotalExperienceToFirebase(experience, date, userID, week);
  } 
  catch (error: any) {
      alert(`Error: Couldn't add set: ${error.message}`)
  } 
};

export function calculateNumberOfSet (focus:string, activityLevel: string): number {
    let numberOfSet = 0;
    switch (activityLevel) {
      case "beginner":
        numberOfSet = focus === "strength" ?  1 : Math.floor(Math.random() * (3 - 2 + 1) + 2);
        break;
      case "intermediate":
        numberOfSet =  focus === "strength" ? 2 : Math.floor(Math.random() * (3 - 2 + 1) + 2);
        break;
      case "advanced":
        numberOfSet = focus === "strength" ?  numberOfSet = Math.floor(Math.random() * (3 - 2 + 1) + 2): Math.floor(Math.random() * (4 - 3 + 1) + 3);
      default:
        throw new Error("invalid activity level");
    }
    return numberOfSet;
};

export function isSuperSet (exercise: Sets, uniqueExercises: string[]): boolean {
    for (let i = 0; i < exercise.restTimes.length; i+= uniqueExercises.length) 
        if (exercise.restTimes[i] > 0) 
            return false;
    if (uniqueExercises.length === 1)
        return false;
    return true;
};



export function isDropsSet (exercise:Sets, uniqueExercises: string[] ): boolean {
    if (exercise.restTimes.length === 1 )
        return false;
    for (let i = 0; i < exercise.restTimes.length-1; i++) 
        if (!(uniqueExercises.length === 1 &&  isDecreasing(exercise.weights) && exercise.restTimes[i] === 0))
            return false;
    return true;
};

function isDecreasing (array: number[]): boolean{  
    for (let i = 1; i <= array.length; i++)
        if (array[i-1] <= array[i] )
            return false;
    return true;
};