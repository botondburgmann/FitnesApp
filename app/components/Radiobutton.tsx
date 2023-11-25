import React from "react";
import {  View, StyleSheet } from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

const Radiobutton = (props: { selectedValue: string | undefined; setselectedValue: Function | undefined; options: string[] | undefined; }) => {
    const selectedValue: string | undefined = props.selectedValue;
    const setselectedValue: Function | undefined = props.setselectedValue;
    const options: string[] | undefined= props.options;

    const radioButtonItems: RadioButtonItem = [];
    if (options !== undefined)
        for (let i = 0; i < options.length; i++)
            radioButtonItems.push(<RadioButtonItem  key={i} value={options[i]} label={options[i]} />);

    return (
        <View>
            <RadioButtonGroup
                radioStyle={styles.radioItem}
                containerStyle={styles.radioContainer}
                labelStyle={styles.radioLabel}
                selected={selectedValue}
                onSelected={(value: any) => {setselectedValue !== undefined && setselectedValue(value)}}
                radioBackground="white"
            >
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
        fontWeight: '600', 
        textShadowOffset:{
            height: 2,
            width: 2
        },
        textShadowColor: "#000",
        textShadowRadius: 10
    }
 });