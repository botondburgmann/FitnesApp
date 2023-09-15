import React, { useState } from "react";
import { Text, View, Button } from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Gender = ({navigation}: RouterProps) => {
    const [current, setCurrent] = useState("test");


    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <RadioButtonGroup
                containerStyle={{ marginBottom: 10 }}
                selected={current}
                onSelected={(value) => setCurrent(value)}
                radioBackground="green"
            >
                <RadioButtonItem value="male" label="Male" />
                <RadioButtonItem value="femaale" label="Female"/>
      </RadioButtonGroup>
        <Button onPress={() => navigation.navigate('age')} title="Next"/>
    </View>
  )
}

export default Gender