import {ExerciseSelectOption, ExerciseLog, MyUser, WeekRange } from "../types and interfaces/types";
import { NavigationProp } from "@react-navigation/native";

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
