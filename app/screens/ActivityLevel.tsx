import { View, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import { setUpProfile } from '../functions/databaseQueries';
import SelectMenu from '../components/SelectMenu';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
  userID: string;
}

const ActivityLevel = ({navigation}: RouterProps) => {
  const route = useRoute();
  const [value, setValue] = useState<string>(null);
  const [items, setItems] = useState<Array<Object>>([
    {label: 'Beginner', value: 'beginner'},
    {label: 'Intermediate', value: 'intermediate'},
    {label: 'Advanced', value: 'advanced'}
  ]);
  const {userID} = route.params as RouteParams;

  return (
    <View style={{flex: 1, justifyContent: 'center' }}>
      <SelectMenu data={items} setSelectedValue={setValue}
 />
      
      <Button onPress={() => navigation.navigate('height')} title="Go back"/>
      <Button onPress={() => setUpProfile('activityLevel', value, userID, navigation, 'insideLayout')} title="Complete"/>
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