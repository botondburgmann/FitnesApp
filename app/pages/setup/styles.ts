import { StyleSheet} from "react-native"

export const setUpStyles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(128,128,128,0.5)",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    label: {
        alignSelf: "center",
        color: "#fff",
        fontSize: 20,
        fontWeight: "800",
        lineHeight: 40,
        marginBottom: 50,
        marginTop: 10,
        textAlign: "center",
        textShadowColor: "#000",
        textShadowOffset:{
            height: 2,
            width: 2
        },
        textShadowRadius: 10,
        textTransform: "uppercase",
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 100,
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
    inputGroup:{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    selectMenuContainer: {
        backgroundColor: "#FFF",
        flex: 0.7,
        paddingVertical: 10,
    },
    icon : {
        alignSelf: "center",
        marginBottom: 50,
        marginTop: -20
      },
})