interface SelectItem {
    label: string;
    value: string;
  }

export const validateGender = (gender:string) => {
    if (gender === undefined)
        throw new Error("Gender must be set");

    if (!(gender.toLowerCase() === 'male' || gender.toLowerCase() === 'female'))
        throw new Error("Gender must be set to either male or female");
}

export const validateAge = (age: number) => {
    if (age === undefined)
        throw new Error("Age must be set");
    else if (typeof(age) !== 'number')
        throw new Error("Age must be a number");
    else if (age < 0)
        throw new Error("Unfortunately this time we cannot sign up time travellers. Sorry for the inconvenience");
    else if (age >= 0 && age < 12)
        throw new Error("Error: You need to be at least 12 years old to sign up");
    else if (age > 120 )
        throw new Error("Error: Aren't you a bit too old (or dead) to work out?");
}

export const validateWeight = (weight: number) => {
    if (weight === undefined)
        throw new Error("Weight must be set");
    else if (typeof(weight) !== 'number')
        throw new Error("Weight must be a number");
    else if (weight < 0)
        throw new Error("Weight can't be a negative number");
}
export const validateHeight = (height: number) => {
    if (height === undefined)
        throw new Error("Height must be set");
    else if (typeof(height) !== 'number')
        throw new Error("Height must be a number");
    else if (height < 0)
        throw new Error("Height can't be a negative number");
}

export const validateActivityLevel = (activityLevel: SelectItem) => {
    if (!(activityLevel.value === 'beginner' || activityLevel.value === 'intermediate' || activityLevel.value === 'advanced') )
        throw new Error("Please select one of the options");
}


