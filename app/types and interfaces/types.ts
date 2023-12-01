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