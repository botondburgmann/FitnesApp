import { StyleSheet} from "react-native"

export const globalStyles = StyleSheet.create({
    container: {
        justifyContent: "center",
        backgroundColor: "#ff0000"
    },
    input: {
        marginHorizontal: 10,
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff"
    },
    button: {
        width: 250,
        paddingHorizontal: 5,
        marginHorizontal: 20,
        marginVertical: 10,
        alignSelf: "center",
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "#000",
    },
    buttonText: {
        textAlign: "center",
        fontSize: 18,
        color: "#fff",
        textTransform: "uppercase",
        fontWeight: "600",
        paddingVertical: 10,
    },
    gridContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    text:{
        alignSelf: "center",
        fontSize: 18,
        color: "#fff",
        textTransform: "uppercase",
        fontWeight: "600",
        paddingVertical: 10,
      }
})