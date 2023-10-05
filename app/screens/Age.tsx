import { View, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { setUpProfile } from '../functions/databaseQueries';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
  userID: string;
}

const Age = ({navigation}: RouterProps) => {
  const route = useRoute();

  const {userID} = route.params as RouteParams;
  
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);

  const onChange = (selectedDate) => {
    const currentDate: Date = selectedDate || birthDate; 
    setShow(false);
    setBirthDate(currentDate);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button onPress={() => setShow(true)} title="Show date picker!" />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={birthDate}
          mode='date'
          onChange={(event, selectedDate) => onChange(selectedDate)}
        />
      )}
      <Button onPress={() => navigation.navigate('gender')} title="Go back" />
      <Button onPress={() => setUpProfile('age', birthDate, userID, navigation, 'weight')} title="Next" />
    </View>
  );
};


export default Age

const styles = StyleSheet.create({
    container: {
      marginHorizontal: 20,
      flex: 1,
      justifyContent: 'center'
    },
    input: {
      marginVertical: 4,
      height: 50,
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      backgroundColor: '#fff'
    }
  });