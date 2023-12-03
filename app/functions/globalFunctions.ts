export function validateBirthday(birthDate:Date): void {
  const today = new Date();
  
  if (today.getFullYear() - birthDate.getFullYear() < 12) throw new Error("You need to be at least 12 years old to use this application");
  if (today.getFullYear() - birthDate.getFullYear() > 120) throw new Error(`Are you sure you're ${today.getFullYear() - birthDate.getFullYear()} years old?`);
  if (today.getFullYear() - birthDate.getFullYear() < 0) throw new Error("Unfortunately this time we cannot sign up time travellers. Sorry for the inconvenience");
}

export function validateHeight(height: number): void {
  if (Number.isNaN(height)) throw new Error("Weight must be set");
  if (height < 0) throw new Error("Weight must be a positive number");
}

export function convertLbsToKg(weight:number): number {
  return Math.round((weight*0.453592)*100)/100;
}

export function convertFtToCm(height:number): number {
  return Math.round((height*30.48)*100)/100;
}

export function validateWeight(weight: number): void {
  if (Number.isNaN(weight)) throw new Error("Weight must be set");
  if (weight < 0) throw new Error("Weight must be a positive number");
}


