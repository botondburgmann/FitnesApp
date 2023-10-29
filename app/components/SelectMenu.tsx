import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';

const SelectMenu = (props) => {

  const setSelectedValue = props.setSelectedValue;    
  const data = props.data
  const title = props.title
  const shouldIncludeSearch = data.length > 10;

  const [isFocus, setIsFocus] = useState(false);

  
  return (
    <View style={styles.container}>
      <Dropdown 
        search={shouldIncludeSearch}
        placeholder={title}
        data={data}
        labelField="label"
        valueField="value"
        onChange={item => {
          setIsFocus(false);
          setSelectedValue(item);
        }}
      />
    </View>
  )
}

export default SelectMenu

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10
  },
 
text:{
  fontSize: 20,
  color: "#fff",
},

label: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textTransform: 'uppercase',
    marginTop: -80,
    marginBottom: 50,
    textAlign: 'center',
    lineHeight: 40
  },
});