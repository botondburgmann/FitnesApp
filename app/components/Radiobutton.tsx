import React, { useState } from "react";
import {  View, Button, Pressable, Text, StyleSheet } from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { NavigationProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { setUpProfile } from "../functions/databaseQueries";

const Radiobutton = (props) => {
    const selectedValue = props.selectedValue;
    const setselectedValue = props.setselectedValue;
    const options = props.options;

    const radioButtonItems = [];
    for (let i = 0; i < options.length; i++) {
        radioButtonItems.push(
          <RadioButtonItem value={options[i]} label={options[i]} />
        );
      }
  return (
    <View>
        <RadioButtonGroup
            radioStyle={styles.radioItem}
            containerStyle={styles.radioContainer}
            labelStyle={styles.radioLabel}
            selected={selectedValue}
            onSelected={(value) => setselectedValue(value)}
            radioBackground="white">

            {radioButtonItems}
        </RadioButtonGroup>
    </View>
  )
}

export default Radiobutton

const styles = StyleSheet.create({
    radioItem: {
        marginVertical: 10,
        marginRight: 5,

    },
    radioContainer:{
        marginBottom: 50
    },
    radioLabel: {
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '600' 
    }
 });