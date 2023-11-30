import { StyleSheet} from "react-native"

export const workoutsStyles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(128,128,128,0.5)', 
        justifyContent: "center",
    },
    label: {   
        alignSelf: 'center',
        color: "#fff",
        fontSize: 20,
        fontWeight: "800",
        lineHeight: 40,
        marginVertical: 10,
        textAlign: 'center',
        textShadowColor: "#000",
        textShadowOffset:{
            height: 2,
            width: 2
        },
        textShadowRadius: 10,
        textTransform: 'uppercase',
    },
    text:{
        alignSelf: "center",
        color: "#FFF",
        fontSize: 18,
        fontWeight: "800", 
        paddingVertical: 10,
        textShadowColor: "#000",
        textShadowOffset:{
            height: 2,
            width: 2
        },
        textShadowRadius: 10,
        textTransform: 'uppercase', 
    },
    button: {
        alignContent: "center",
        alignSelf: "center",
        backgroundColor: "#000",
        justifyContent: "center",
        marginHorizontal: 20,
        marginVertical: 10,
        paddingHorizontal: 5,
        width: 100,
    },
})