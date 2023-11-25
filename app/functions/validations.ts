import { ExerciseSet, SelectItem } from "../types and interfaces/types";


export const validateGender = (gender:string) => {
    if (gender === undefined)
        throw new Error("gender must be set");

    if (!(gender.toLowerCase() === 'male' || gender.toLowerCase() === 'female'))
        throw new Error("gender must be set to either male or female");
}

export const validateAge = (age: number) => {
    if (age === undefined)
        throw new Error("age must be set");
    else if (typeof(age) !== 'number')
        throw new Error("age must be a number");
    else if (age < 0)
        throw new Error("unfortunately this time we cannot sign up time travellers. Sorry for the inconvenience");
    else if (age >= 0 && age < 12)
        throw new Error("you need to be at least 12 years old to sign up");
    else if (age > 120 )
        throw new Error("aren't you a bit too old (or dead) to work out?");
}

export const validateWeight = (weight: number) => {
    if (Number.isNaN(weight))
        throw new Error("weight must be set");
    else if (typeof(weight) !== "number" || weight < 0)
        throw new Error("weight must be a positive number");
}
export const validateHeight = (height: number) => {
    if (Number.isNaN(height))
        throw new Error("height must be set");
    else if (typeof(height) !== "number" || height < 0)
        throw new Error("height must be a positive number");
}

export const validateActivityLevel = (activityLevel: SelectItem) => {
    if (!(activityLevel.value === "beginner" || activityLevel.value === "intermediate" || activityLevel.value === "advanced") )
        throw new Error("please select one of the options");
}

export const validateExerciseSet = (set: ExerciseSet) => {
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
                    throw new Error("rest time must be a positive number"); 
        }

    }
  

    


}


export const validateExperience = (experience: number) => {    
    if (experience === undefined)
        throw new Error("experience must be a set");    
    if (typeof(experience) !== "number" || Number.isNaN(experience))
        throw new Error("experience must be a number");
    
}