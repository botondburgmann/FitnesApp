import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';

const SelectMenu = (props) => {

    const setSelectedValue = props.setSelectedValue;    
    const data = props.data
    const title = props.title
    const shouldIncludeSearch = data.length > 10;


    const [isFocus, setIsFocus] = useState(false);

  return (
    <View>
        <Dropdown 
            search={shouldIncludeSearch}
            placeholder={!isFocus ? title : '...'}
            data={data}
            labelField="label"
            valueField="value"
            onChange={item => {
              setIsFocus(false);
              setSelectedValue(item.value);

            }}
        />
      
    </View>
  )
}

export default SelectMenu

const styles = StyleSheet.create({})