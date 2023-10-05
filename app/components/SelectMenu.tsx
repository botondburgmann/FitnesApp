import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';

const SelectMenu = (props) => {

    const setSelectedValue = props.setSelectedValue;    
    const data = props.data
    const {resetArrays = () => {}} = props;

    const [isFocus, setIsFocus] = useState(false);

  return (
    <View>
        <Dropdown 
            search
            placeholder={!isFocus ? 'Exercise' : '...'}
            data={data}
            labelField="label"
            valueField="value"
            onChange={item => {
              setIsFocus(false);
              setSelectedValue(item.value);
              if (resetArrays)
                resetArrays();
            }}
        />
      
    </View>
  )
}

export default SelectMenu

const styles = StyleSheet.create({})