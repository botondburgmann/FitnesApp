import {ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Datepicker from '../../components/Datepicker'
import DisplaySets from './components/DisplaySets';
import { RouterProps } from '../../types and interfaces/types';
import NavigationContext from '../../contexts/NavigationContext';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { AntDesign } from '@expo/vector-icons';
import { dateStep } from '../../functions/otherFunctions';


const Log = ({navigation}: RouterProps) => {
  const [date, setDate] = useState(new Date());


  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {flex: 1 }]}>
        <View style={{ backgroundColor: 'rgba(255,0,0,0.7)'  }}>
          <View style={[globalStyles.gridContainer, {alignItems:'flex-end'}]}>
            <Pressable onPress={() => setDate(dateStep(date, -1))}>
              <AntDesign name="caretleft" size={24} color="#FFF" />
            </Pressable>
            <Datepicker date={date} setDate={setDate} />
            <Pressable onPress={() => setDate(dateStep(date, +1))}>
              <AntDesign name="caretright" size={24} color="#FFF" />
            </Pressable>
          </View>
          
          <Text style={[styles.text, {marginTop: 20}]}>{date.toDateString()}</Text>
        </View>
          
        <ScrollView contentContainerStyle={styles.log}>
          <NavigationContext.Provider value={navigation}>
            <DisplaySets date={date}/>
          </NavigationContext.Provider>
        </ScrollView>
            
        <View style={styles.buttonGroup}>
          { date <= new Date() 
            ? <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => navigation.navigate('Add',{ date: date})}>
                <Text style={globalStyles.buttonText}>Add new Exercise</Text>
              </Pressable>
            : <></>
          }
          { date.toDateString() === new Date().toDateString()
            ? <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => navigation.navigate('Routines')}>
                <Text style={globalStyles.buttonText}>Ask for routine</Text>
              </Pressable>
            : <></>
          }
        </View>
    </View>
  </ImageBackground> 
  )
}

export default Log

const styles = StyleSheet.create({
  text:{
    alignSelf: 'center',
    fontSize: 18,
    color: "#fff",
    textTransform: 'uppercase',
    fontWeight: "600",
    paddingVertical: 10,
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