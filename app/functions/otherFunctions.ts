import { Alert } from "react-native";
import { deleteSet } from "./databaseQueries";
import { Exercise, ExerciseSelectOption, ExerciseSet } from "../types and interfaces/types";

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

export const addXPForOneSet = (isIsometric: boolean, set): number => {
    let currentExperience = 0
    if (!isIsometric) {
        if (set.weights === 0 && Number.isNaN(set.weights))
            currentExperience += set.reps;
        else
            currentExperience += set.reps * set.weights;
    }
    else {
        if (set.weights === 0 && Number.isNaN(set.weights))
            currentExperience += set.times;
        else
            currentExperience += set.times * set.weights;
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

export const showDeleteConfirmation = (userID: string, exerciseName: string, exerciseID: number, setID: number, xpDelete: number): void => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [{
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => { deleteSet(userID, exerciseName, exerciseID,  setID, xpDelete)},
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

export const isDropsSet =(restTimes: number[], reps: number[], weights: number[], uniqueExerciseLength: number): boolean => {
    for (let i = 0; i < restTimes.length-1; i++) 
        if (restTimes[i] > 0) 
            return false;
    if (!(uniqueExerciseLength === 1 && reps.length > 1 && isDecreasing(weights)))
        return false;
    return true;
};

export const isDecreasing = (array: number[]): boolean => {
    for (let i = 1; i <= array.length; i++)
        if (array[i-1] < array[i] )
            return false;
    return true;
};
export const handleAddButton = (time: number, setTime: Function, reps: number, setReps: Function,
                                 restTime: number, setRestTime: Function, side: string, setSide: Function, 
                                 weight: number, setWeight: Function, currentExercise: ExerciseSelectOption,
                                setCurrentExercise: Function, sets: ExerciseSet, setIsEnabled: Function,
                                selectedExercises:ExerciseSelectOption[]): void => {
    if (currentExercise.isometric && (time === 0 || Number.isNaN(time)))
      throw new Error("time field cannot be empty for isometric exercises");
    if (!currentExercise.isometric && (reps === 0 || Number.isNaN(reps)))
      throw new Error("reps field cannot be empty for non-isometric exercises");
    else {
        sets.exercise.push(currentExercise.value);
        Number.isNaN(reps) ? sets.reps.push(0) : sets.reps.push(reps) ;
        Number.isNaN(restTime) ? sets.restTimes.push(0) : sets.restTimes.push(restTime) ;
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

  