import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';

const SelectMenu = (props) => {

    const {selectedExercise, setSelectedExercise} = props.selectedExercise;    
    const data = props.data
    const resetArrays = props.resetArrays;

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const [showSelect, setShowSelect] = useState(false);

  return (
    <View>
        <Dropdown 
            search
            placeholder={!isFocus ? 'Exercise' : '...'}
            data={data}
            labelField="label"
            valueField="value"
            onChange={item => {
              setValue(item.value);
              setIsFocus(false);
              setSelectedExercise(item.value);
              resetArrays();
            }}
        />
      
    </View>
  )
}

export default SelectMenu

const styles = StyleSheet.create({})