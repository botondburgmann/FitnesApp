import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import UserContext from '../../contexts/UserContext';
import Datepicker from '../../components/Datepicker';
import Radiobutton from '../../components/Radiobutton';
import SelectMenu from '../../components/SelectMenu';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { ActivityLevelOption, RouterProps, SelectItem } from '../../types and interfaces/types';
import { updateDoc } from 'firebase/firestore';
import { convertFtToCm, convertLbsToKg, validateBirthday, validateHeight, validateWeight } from '../../functions/globalFunctions';
import { getUserDocument } from '../../functions/firebaseFunctions';

const EditProfile = ({ route, navigation }: RouterProps) => {
    const userID = useContext(UserContext);
    const { user } = route?.params;
    const [name, setName] = useState<string>(user.name);
    const [weight, setWeight] = useState<number>(user.weight);
    const [height, setHeight] = useState<number>(user.height);
    const [date, setDate] = useState(new Date(user.dateOfBirth));
    const [gender, setGender] = useState<"Male" | "Female">(user.gender);
    const options = ["Male", "Female"];
    const [systemValueWeight, setSystemValueWeight] = useState<SelectItem>({label: 'Metric (kg)', value: 'kg'});
    const [systemItemsWeight] = useState<SelectItem[]>([
      {label: 'Metric (kg)', value: 'kg'},
      {label: 'Imperial (lbs)', value: 'lbs'}
    ]);
    const [systemValueHeight, setSystemValueHeight] = useState<SelectItem>({label: 'Metric (cm)', value: 'm'});
    const [systemItemsHeight] = useState<SelectItem[]>([
      {label: 'Metric (cm)', value: 'm'},
      {label: 'Imperial (ft)', value: 'ft'}
    ]);
    const [activityValue, setActivityValue] = user.activityLevel === "beginner" 
                                            ? useState<ActivityLevelOption>({label: 'Beginner', value: 'beginner'})
                                            : user.activityLevel === "intermediate"
                                            ? useState<ActivityLevelOption>({label: 'Intermediate', value: 'intermediate'})
                                            : useState<ActivityLevelOption>({label: 'Advanced', value: 'advanced'})
    const [activityItems] = useState([
      {label: 'Beginner', value: 'beginner'},
      {label: 'Intermediate', value: 'intermediate'},
      {label: 'Advanced', value: 'advanced'}
    ]);




    async function saveChanges(): Promise<void> {
        try {
            if (name === "") 
                throw new Error("Name field cannot be empty!");            
            if (userID === null)
                throw new Error("User is not verified");
            validateBirthday(date);
            validateHeight(height);
            validateWeight(weight);
            
            if (systemValueWeight.value === "lbs")
                setWeight(weight => convertLbsToKg(weight));
            if (systemValueWeight.value === "ft")
                setHeight(height => convertFtToCm(height));
                
            const changes = {
                name : name,
                dateOfBirth: date.toDateString(),
                gender: gender,
                weight: weight,
                height: height,
                activityLevel: activityValue.value,
                experience: user.experience,
                level: user.level,
                weeklyExperience: user.weeklyExperience,
                userID: userID
            }
            const usersDoc = await getUserDocument(userID);
            if (usersDoc === undefined)
                throw new Error("User doesn't exist");
            updateDoc(usersDoc.ref, changes);    
            navigation.navigate("Account")
        } catch (error: any) {
            alert(`Error: couldn't save changes: ${error.message}`);
        }
        
    }

    return (
        <ImageBackground source={backgroundImage} style={globalStyles.image}>
            <ScrollView contentContainerStyle={[globalStyles.container, {flex: 1, backgroundColor: "rgba(128,128,128,0.7)"}]}>
                <View style={styles.gridContainer}>
                    <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", marginHorizontal: 10, fontSize: 16}]}>Name</Text>
                    <TextInput
                        style={[globalStyles.input,{flex: 1}]}
                        value={name}
                        placeholder="name"
                        autoCapitalize='none'
                        onChangeText={(text) => setName(text)}
                    />
                </View> 
                <View style={styles.dateGridContainer}>
                    <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", marginHorizontal: 10, fontSize: 16}]}>Birthday:</Text>
                    <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", marginHorizontal: 10, fontSize: 16}]}>{date.toDateString()}</Text>
                    <Datepicker date={date} setDate={setDate} />
                </View>
                <View style={styles.gridContainer}>
                    <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", marginHorizontal: 10, fontSize: 16}]}>Gender</Text>
                    <Radiobutton selectedValue={gender} setselectedValue={setGender} options={options} />
                </View>
                <View style={styles.gridContainer}>
                    <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", marginHorizontal: 10, fontSize: 16}]}>Weight</Text>
                    <TextInput
                        keyboardType='numeric'
                        value={weight.toString()}
                        style={globalStyles.input}
                        placeholder={systemValueWeight.value === "lbs" ? "Weight (lbs)" : "Weight (kg)" }
                        autoCapitalize='none'
                        onChangeText={(text) => setWeight(parseFloat(text))}
                    />
                    <View style={styles.systemSelectMenuContainer}>
                        <SelectMenu data={systemItemsWeight} setSelectedValue={setSystemValueWeight} title={systemValueWeight.label} />
                    </View>
                </View>
                <View style={styles.gridContainer}>
                    <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", marginHorizontal: 10, fontSize: 16}]}>Height</Text>
                    <TextInput
                        keyboardType='numeric'
                        value={height.toString()}
                        style={globalStyles.input}
                        placeholder={systemValueHeight.value === "ft" ? "height (ft)" : "height (cm)" }
                        autoCapitalize='none'
                        onChangeText={(text) => setHeight(parseFloat(text))}
                    />
                    <View style={styles.systemSelectMenuContainer}>
                        <SelectMenu data={systemItemsHeight} setSelectedValue={setSystemValueHeight} title={systemValueHeight.label} />
                    </View>
                </View>
                <View style={styles.activitySelectMenuContainer}>
                    <SelectMenu data={activityItems} setSelectedValue={setActivityValue} title={activityValue.label} />
                </View>
                <Pressable style={[globalStyles.button, {marginTop: 20,width: 150, height: 50,}]} onPress={() => saveChanges()}>
                    <Text style={globalStyles.buttonText}>Modify</Text>
                </Pressable>
            </ScrollView>
        </ImageBackground>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    text:{
        alignSelf: 'center',
        fontSize: 16,
        color: "#fff",
        textTransform: 'uppercase',
        fontWeight: "600",
        marginHorizontal: 10
    },
    gridContainer:{
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 5
    },
    dateGridContainer : {
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'flex-start',
        alignItems: 'baseline',
    },
    activitySelectMenuContainer: {
        backgroundColor: "#fff",
        padding: 5,
        marginHorizontal: 10
      },
    systemSelectMenuContainer: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 5
      },
  });