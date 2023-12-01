import { NavigationProp } from "@react-navigation/native";

export type Achievement = {
    color: string;
    description: string;
    icon: string;
    level: number;
    name: string;
    status: string;
    visibility: number;
}

export type RouterProps = {
    navigation: NavigationProp<any, any>;
    route?: any;
}

export type BestExercise = {
    name: string;
    weights: number;
    reps: number;
    [key: string]: any;
};

export type Exercise = {
    hidden: boolean;
    isometric: boolean;
    name: string;
    musclesWorked: string[];
    unilateral: boolean;
    [key: string]: any;
};

export type User = {
    activityLevel: string;
    dateOfBirth: string;
    experience: number;
    gender: string;
    height: number;
    level: number;
    name: string;
    weeklyExperience:number;
    weight: number;
    userID: string;
};

export type SelectItem = {
    label: string
    value: string
};

export type ActivityLevels =
  |{label: 'Beginner', value: 'beginner'}
  |{label: 'Intermediate', value: 'intermediate'}
  |{label: 'Advanced', value: 'advanced'}

export type MyModalProps = {
    isVisible: boolean;
    onClose: () => void;
    title: string | undefined;
    information: string | undefined;
};

export type WeekRange = {
    start: Date;
    end: Date;
}