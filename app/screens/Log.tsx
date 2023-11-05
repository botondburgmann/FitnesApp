import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Datepicker from '../components/Datepicker'
import UserContext from '../contexts/UserContext';
import {  deleteSet, getWorkout } from '../functions/databaseQueries';
import DisplaySets from '../components/DisplaySets';
import { ExerciseSet } from '../types and interfaces/types';
import { RouterProps } from '../types and interfaces/interfaces';
import NavigationContext from '../contexts/NavigationContext';



const Log = ({navigation}: RouterProps) => {
  const [date, setDate] = useState(new Date());


  return (
    <View style={styles.container}>
      <Datepicker date={date} setDate={setDate} />
      <Text style={[styles.text, {marginTop: 20}]}>{date.toDateString()}</Text>

      <ScrollView contentContainerStyle={styles.log}>
        <NavigationContext.Provider value={navigation}>
          <DisplaySets date={date.toDateString()}/>
        </NavigationContext.Provider>
      </ScrollView>
    
      <View style={styles.buttonGroup}>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Add',{ date: date.toDateString()})}>
          <Text style={styles.text}>Add new Exercise</Text>
        </Pressable>
        
        <Pressable style={styles.button} onPress={() => navigation.navigate('Routines')}>
          <Text style={styles.text}>Ask for routine</Text>
        </Pressable>
      </View>     
    </View>
  )
}

export default Log

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ff0000'
  },
  text:{
    alignSelf: 'center',
    fontSize: 18,
    color: "#fff",
    textTransform: 'uppercase',
    fontWeight: "600",
    paddingVertical: 10,
  },
  button:{
    width: 100,
    paddingHorizontal: 5,
    marginHorizontal: 20,
    alignSelf: "center",
    backgroundColor: "#000",
  },

  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    marginVertical: 20
  },
  log:{
    justifyContent:'flex-end',
  },
});