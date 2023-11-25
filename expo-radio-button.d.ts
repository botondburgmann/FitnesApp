declare module 'expo-radio-button' {
    import { StyleProp, ViewStyle } from 'react-native';

    interface RadioButtonItemProps {
        value: any; // Replace 'any' with the correct type
        label: string;
        // Add other props as needed
    }

    interface RadioButtonGroupProps {
        radioStyle?: StyleProp<ViewStyle>;
        containerStyle?: StyleProp<ViewStyle>;
        labelStyle?: StyleProp<ViewStyle>;
        selected?: string;
        onSelected?: (value: string) => void;
        radioBackground?: string;
        children?: React.ReactNode; // Add this line
    }

    const RadioButtonItem: React.ComponentType<RadioButtonItemProps>;
    const RadioButtonGroup: React.ComponentType<RadioButtonGroupProps>;

    export { RadioButtonItem, RadioButtonGroup };
}
