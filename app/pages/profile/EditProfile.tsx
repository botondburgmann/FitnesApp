import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../contexts/UserContext';
import Datepicker from '../../components/Datepicker';
import Radiobutton from '../../components/Radiobutton';
import SelectMenu from '../../components/SelectMenu';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { ActivityLevels, MyUser, RouterProps, SelectItem } from '../../types and interfaces/types';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

const EditProfile = ({ route, navigation }: RouterProps) => {
    const userID = useContext(UserContext);
    const { user } = route?.params;
    const [name, setName] = useState<string>(user.name);
    const [age, setAge] = useState<number>(user.age);
    const [weight, setWeight] = useState<number>(user.weight);
    const [height, setHeight] = useState<number>(user.height);
    const [birthDate, setBirthDate] = useState(new Date());
    const [gender, setGender] = useState<string>(user.gender);
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
    const [activityValue, setActivityValue] = useState<ActivityLevels>(user.activityLevel);
    const [activityItems] = useState([
      {label: 'Beginner', value: 'beginner'},
      {label: 'Intermediate', value: 'intermediate'},
      {label: 'Advanced', value: 'advanced'}
    ]);

    async function editProfile  (userID:string | null, changes: MyUser): Promise<void> {
        try {  
            const usersCollectionRef = collection(FIRESTORE_DB, "Users");    
            const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
            const usersSnapshot = await getDocs(usersQuery);
            const usersDoc = usersSnapshot.docs[0];
            const updateData = {
                name : changes.name,
                age: changes.age,
                gender: changes.gender,
                weight: changes.weight,
                height: changes.height,
                activityLevel: changes.activityLevel
            };
            updateDoc(usersDoc.ref, updateData);
    
        } 
        catch (error: any) {
            alert(`Error: couldn't find fields: ${error.message}`);
        }
    };
    useEffect(() => {
        const today = new Date();
        

        if (birthDate.toDateString() === today.toDateString()) {
            setAge(user.age)
        }
        else{
            setAge(today.getFullYear()-birthDate.getFullYear())
        }
    }, [birthDate])
    


    function saveChanges(): void {
        if (name === "") 
            alert("Name field cannot be empty!");
        else if (Number.isNaN(weight)) 
            alert("Weight field cannot be empty!");
        else if (Number.isNaN(height)) 
            alert("Height field cannot be empty!");
        else if (age < 0)
            alert("Unfortunately this time we cannot sign up time travellers. Sorry for the inconvenience");
        else if (age >= 0 && age < 12)
            alert("You need to be at least 12 years old to sign up");
        else if (age > 120 )
            alert("Aren't you a bit too old (or dead) to work out?");
        else if(typeof(weight) !== 'number')
            alert("Weight must be a number");
        else if(weight < 0)
            alert("Weight can't be a negative number");
            else if(typeof(height) !== 'number')
            alert("Height must be a number");
        else if(height < 0)
            alert("Height can't be a negative number");
        else{
            if (systemValueWeight.value === "lbs")
                setWeight(weight => Math.round((weight*0.453592)*100)/100);
            if (systemValueWeight.value === "ft")
                setHeight(height => Math.round((height*30.48)*100)/100);
            
            const changes = {
                name : name,
                age: age,
                gender: gender,
                weight: weight,
                height: height,
                activityLevel: activityValue.value,
                experience: user.experience,
                level: user.level,
                weeklyExperience: user.weeklyExperience,
                userID: user.userID
            }            
            editProfile(userID,changes)
            navigation.navigate("Account")
        }
    }

    return (
        <ImageBackground source={backgroundImage} style={globalStyles.image}>
        <ScrollView contentContainerStyle={[globalStyles.container, {flex: 1, backgroundColor: "rgba(255,0,0,0.7)"}]}>
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
                    <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", marginHorizontal: 10, fontSize: 16}]}>{birthDate.toDateString()}</Text>
                    <Datepicker date={birthDate} setDate={setBirthDate} />
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
                        <SelectMenu data={systemItemsWeight} setSelectedValue={setSystemValueWeight} title={"System"} />
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
                        <SelectMenu data={systemItemsHeight} setSelectedValue={setSystemValueHeight} title={"System"} />
                    </View>
                </View>
                <View style={styles.activitySelectMenuContainer}>
                    <SelectMenu data={activityItems} setSelectedValue={setActivityValue} title={"Activity level"} />
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