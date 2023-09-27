import React, { useState } from "react";
import {  View, Button } from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { NavigationProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { setUpProfile } from "../functions/databaseQueries";

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
    userID: string;
  }
  


const Gender = ( {navigation}: RouterProps) => {
    const route = useRoute();
    const [gender, setGender] = useState<string>();
    const {userID} = route.params as RouteParams;

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <RadioButtonGroup
                containerStyle={{ marginBottom: 10 }}
                selected={gender}
                onSelected={(value) => setGender(value)}
                radioBackground="green">

                <RadioButtonItem value="male" label="Male" />
                <RadioButtonItem value="female" label="Female"/>
            </RadioButtonGroup>

        <Button onPress={() => setUpProfile('gender', gender, userID, navigation, 'age')} title="Next"/>
    </View>
  )
}

export default Gender