import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';

const SelectMenu = (props) => {

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const [showSelect, setShowSelect] = useState(false);
    const [open, setOpen] = useState(false);

    function handleNewExerciseButtonPress(): void {
        setShowSelect(true)
    }
  return (
    <View>
      <Pressable onPress={handleNewExerciseButtonPress}>
        <Text >Add new exercise</Text>
      </Pressable>
      {showSelect && (
        <Dropdown 
            search
          data={props.data}
          labelField="label"
          valueField="value"
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
            props.changeSelectedExercise(item.value);
          }}
        />
      )}
    </View>
  )
}

export default SelectMenu

const styles = StyleSheet.create({})