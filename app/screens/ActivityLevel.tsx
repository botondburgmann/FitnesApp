import { View, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { setUpProfile } from '../functions/databaseQueries';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
  userID: string;
}

const ActivityLevel = ({navigation}: RouterProps) => {
  const route = useRoute();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(null);
  const [items, setItems] = useState<Array<Object>>([
    {label: 'Beginner', value: 'beginner'},
    {label: 'Intermediate', value: 'intermediate'},
    {label: 'Advanced', value: 'advanced'}
  ]);
  const {userID} = route.params as RouteParams;

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
      
      <Button onPress={() => navigation.navigate('height')} title="Go back"/>
      <Button onPress={() => setUpProfile('activityLevel', value, userID, navigation, 'home')} title="Complete"/>
    </View>
  )
}

export default ActivityLevel

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