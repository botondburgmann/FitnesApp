import { ExerciseLog, SelectItem } from "../types and interfaces/types";


export const validateExerciseSet = (set: ExerciseLog) => {
    for (const key in set){
        if (set[key] === undefined)
            throw new Error(`${key} must be set`); 
        else if (key === "exercise"){
            for (const currentExercise of set.exercise)
                if (typeof(currentExercise) !== "string")
                    throw new Error("exercises must be a string"); 
        }
        else if (key === "sides"){
            for (const side of set.sides)
                if (!(side.toLowerCase() === "both" || side.toLowerCase() === "left" || side.toLowerCase() === "right" ))
                    throw new Error("sides must be a either both, left or right"); 
        }
        else if (key === "weights"){
            for (const weight of set.weights)
                if (typeof(weight) !== "number" || Number.isNaN(weight))
                    throw new Error("weight must be a number"); 
        }
        else if (key === "reps"){
            for (const rep of set.reps)
                if (typeof(rep) !== "number" || rep < 0)
                    throw new Error("reps must be a positive number"); 
        }
        else if (key === "times"){
            for (const time of set.times)
                if (typeof(time) !== "number" || time < 0)
                    throw new Error("time must be a positive number"); 
        }
        else if (key === "restTimes"){
            for (const restTime of set.restTimes)
                if (typeof(restTime) !== "number" || restTime < 0)
                    alert("rest time must be a positive number"); 
        }

    }
  

    


}


export const validateExperience = (experience: number) => {    
    if (experience === undefined)
        throw new Error("experience must be a set");    
    if (typeof(experience) !== "number" || Number.isNaN(experience))
        throw new Error("experience must be a number");
    
}