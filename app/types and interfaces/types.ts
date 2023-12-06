import { NavigationProp } from "@react-navigation/native";

export type Achievement = {
    color: string;
    description: string;
    icon: string;
    name: string;
    status: string;
    visibility: 0.5 | 1;
}

export type RouterProps = {
    navigation: NavigationProp<any, any>;
    route?: any;
}

export type Exercise = {
	label: string;
	value: string;
	unilateral: boolean;
	musclesWorked: string[];
	hidden: boolean;
	isometric: boolean;
	
}

export type Sets = {
	exercise: string[];
    dates : string[],
	reps: number[];
	restTimes: number[];
	sides: ("both" | "left" | "right")[];
	times: number[];
	weights: number[];
}

export type SingleSet = {
	exercise: string,
	reps: number;
	restTime: number;
	side: "both" | "left" | "right";
	time: number;
	weight: number;
    [key: string]: any,
}

export type User = {
    activityLevel: string;
    dateOfBirth: string;
    experience: number;
    gender: "Male" | "Female";
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

export type ActivityLevelOption =
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