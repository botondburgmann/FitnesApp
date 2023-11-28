import { Alert } from "react-native";
import { addSet, addWorkout, deleteSet, setUpProfile } from "./firebaseFunctions";
import { Exercise, ExerciseSelectOption, ExerciseSet, MyUser, SelectItem, SetChange, WeekRange } from "../types and interfaces/types";
import { NavigationProp } from "@react-navigation/native";

export const  handleNextButtonPress = (field:string, value: string | number | undefined | SelectItem, userID: string | null, navigation:NavigationProp<any, any>, nextPage: string, system?:string | undefined) => {    
  if (field === "gender") {
    if (value === undefined)
      alert("Error: Please select one of the options");
    else
      setUpProfile(field, value, userID, navigation, nextPage);
  }
  else if (field === "age" && value !== undefined){
    setUpProfile(field, value, userID, navigation, nextPage);
  }
  else if (field === "weight" && value !== undefined){
    if (system === undefined)
      alert("Error: Please select one of the options");
    else
      setUpProfile(field, value, userID, navigation, nextPage, system);
  }
  else if (field === "height" && value !== undefined){
    if (system === undefined)
      alert("Error: Please select one of the options");
    else
      setUpProfile(field, value, userID, navigation, nextPage, system);
  }
  else if (field === "activityLevel"){
    if (value === undefined)
      alert("Error: Please select one of the options");
    else
      setUpProfile(field, value, userID, navigation, nextPage);
  }
  


  
}

export const addXP = (isIsometric: boolean, sets: ExerciseSet): number => {
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
}

export const addXPForOneSet = (isIsometric: boolean, set: SetChange): number => {
    let currentExperience = 0
    if (!isIsometric && set.rep !== undefined) {
        if (set.weight === 0 && Number.isNaN(set.weight))
            currentExperience += set.rep;
        else
            currentExperience += set.rep * set.weight;
    }
    else {
        if (set.weights === 0 && Number.isNaN(set.weight))
            currentExperience += set.time;
        else
            currentExperience += set.time * set.weight;
    }       
          
    return currentExperience;
}


export const  removeXP = (repOrTime: number, weight: number): number => {
    let currentExperience = 0;
    if (weight === 0)
        currentExperience -= repOrTime;
    else 
        currentExperience -= repOrTime * weight;
        return currentExperience;
};

export const showDeleteConfirmation = (userID: string | null, exerciseName: string, exerciseID: number, setID: number, xpDelete: number, date: string, week: WeekRange): void => {
  Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [{
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => { deleteSet(userID, exerciseName, exerciseID,  setID, xpDelete, date, week)},
      }],
      { cancelable: false }
    );
  };

export const isSuperSet = (restTimes: number[], uniqueExerciseLength: number): boolean => {
    for (let i = 0; i < restTimes.length; i+=uniqueExerciseLength) 
        if (restTimes[i] > 0) 
            return false;
    if (uniqueExerciseLength === 1)
        return false;
    return true;
};

export const calculateNumberOfSets = (sides: string[], uniqueExerciseLength: number, restTimes: number[]): number => {
    let numberOfSet = 0;
    for (const side of sides) {
        if (side === "both")
            numberOfSet++;
        else 
            numberOfSet +=0.5;
    }
    return isSuperSet(restTimes, uniqueExerciseLength) ? numberOfSet/uniqueExerciseLength : numberOfSet;
};

export const isDropsSet =(restTimes: number[], repsOrTimes: number[], weights: number[], uniqueExerciseLength: number): boolean => {
  if (restTimes.length === 1 )
    return false;
  for (let i = 0; i < restTimes.length-1; i++) 
    if (!(uniqueExerciseLength === 1 && repsOrTimes.length > 1 && isDecreasing(weights) && restTimes[i] === 0))
      return false;
    return true;
};

export const isDecreasing = (array: number[]): boolean => {  
    for (let i = 1; i <= array.length; i++)
        if (array[i-1] <= array[i] )
            return false;
    return true;
};
export const handleAddButton = (time: number, setTime: Function, reps: number, setReps: Function,
                                 restTime: number, setRestTime: Function, side: string, setSide: Function, 
                                 weight: number, setWeight: Function, currentExercise: ExerciseSelectOption,
                                 sets: ExerciseSet, setIsEnabled: Function,
                                selectedExercises:ExerciseSelectOption[]): void => {
    if (currentExercise.isometric && (time === 0 || Number.isNaN(time)))
      alert("Error: time field cannot be empty for isometric exercises");
    if (!currentExercise.isometric && (reps === 0 || Number.isNaN(reps)))
      alert("Error: Reps field cannot be empty for non-isometric exercises");
    else {
        sets.exercise.push(currentExercise.value);
        Number.isNaN(reps) ? sets.reps.push(0) : sets.reps.push(reps) ;
        Number.isNaN(restTime) ? sets.restTimes.push(0) : sets.restTimes.push(restTime * 60) ;
        sets.sides.push(side);
        Number.isNaN(time) ? sets.times.push(0) : sets.times.push(time) ;
        Number.isNaN(weight) ? sets.weights.push(0) : sets.weights.push(weight) ;
        selectedExercises.push(currentExercise);
        setReps("");
        setRestTime("");
        setTime("");
        setWeight("");
        setIsEnabled(false);
        if (currentExercise.unilateral)
            setSide("left");
        else
            setSide("both");


    }
    
  };

export const calculateNumberOfSet = (focus:string, activityLevel: string): number => {
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
export const shuffleArray = (array: any[]): any[]=> {
    const shuffledArray = [...array];
  
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
  
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
  
    return shuffledArray;
};

export const chooseExercises = (exercises:Exercise[], activityLevel: string ): Exercise[] => {    
    const shuffledExercises = shuffleArray(exercises);
    const workout = [];
    switch (activityLevel) {
      case "beginner":
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length > 1 && workout.length < 3)
            workout.push(exercise);
        break;
      case "intermediate":
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length > 1 && workout.length < 3)
            workout.push(exercise);
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length === 1 && workout.length < 5)
            workout.push(exercise);
        break;
      case "advanced":
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length > 1 && workout.length < 3)
            workout.push(exercise);
        for (const exercise of shuffledExercises)
          if (exercise.musclesWorked.length === 1 && workout.length < 6)
            workout.push(exercise);
        break;
      default:
        throw new Error("invalid activityLevel");
      }      
      return workout;
};

  
export const sortUsers = (users: MyUser[]): MyUser[] => {
  const sortedUsers = [...users];
  const n = sortedUsers.length;

  for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
          if (sortedUsers[j].weeklyExperience < sortedUsers[j + 1].weeklyExperience) {
              [sortedUsers[j], sortedUsers[j + 1]] = [sortedUsers[j + 1], sortedUsers[j]];
          }
      }
  }

  return sortedUsers;
};

export const selectLoggedInUser = (users:MyUser[], userID: string | null) : MyUser => {
  let loggedInUser:MyUser = users[0];
  for (const user of users) {
    if (user.userID === userID) {
      loggedInUser = user;
    }
  }
  return loggedInUser;
};

export const selectSimilarUsers = (users: MyUser[], loggedInUser: MyUser): MyUser[] => {
  const similarUsers = [];
  const loggedInUserBMI = loggedInUser.weight / loggedInUser.height**2;
  for (const user of users) {
    let userBMI = user.weight / user.height**2;
    if (user.gender === loggedInUser.gender && userBMI >= loggedInUserBMI-5 && userBMI <= loggedInUserBMI+ 5) {
      similarUsers.push(user);
    }
  }
  return similarUsers;
};

export const dateStep = (currentDate: Date, step: number): Date => {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + step); // You can adjust the increment as needed
  return newDate
};

export const handleFinishWorkoutButton = (workout: ExerciseSet[], userID: string | null, date: string, totalXP: number, navigation: NavigationProp<any, any>, week: WeekRange ): void => {    
  try {
    if (week !== null) {      
      addWorkout(userID, date, workout, totalXP, week );
      navigation.navigate("Log");
    }
  } catch (error) {
    alert(`Error: Couldn't finish workout: ${error}`)
  }
}

export const handleFinishButton = (userID: string | null, date: string, week: WeekRange, selectedExercises: ExerciseSelectOption[], setSelectedExercises: Function, sets: ExerciseSet, setSets: Function, navigation: NavigationProp<any, any>): void => {
  if (sets.exercise.length === 0)
   alert("Error: Not enough data");
  else{
      let experience = 0;
      for (const exercise of selectedExercises) {
        if (exercise.isometric)
          experience = addXP(true, sets);
        else
          experience = addXP(false, sets);
      }
      if (week !== null) 
        addSet(userID, date, sets, experience, week);
    setSets({
      exercise : [],
      weights: [],
      reps: [],
      times: [],
      restTimes: [],
      sides: []
    });
    setSelectedExercises([]);
    navigation.navigate("Log")
  }
}