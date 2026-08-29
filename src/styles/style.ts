import { StyleSheet } from "react-native";

export const commons = StyleSheet.create({
    screen: { flex: 1 },
    rootScreen: { flex: 1, backgroundColor: "white" },
    list: { padding: "10%" },
    scroll: { flex: 1, minHeight: 0 },
    listFooter: { height: 80 },
    parentDevProp: { flexDirection: "column", gap: "5%" },
    labelProp: { fontSize: 20, fontWeight: "bold" },
    valueProp: { fontSize: 20, textAlign: "center" },
    titleForm: { fontSize: 30, fontWeight: "bold" },
    addEditParent: {
        flex: 1,
        padding: "10%",
        gap: "5%",
        alignItems: "center"
    },
    label: { fontSize: 16, fontWeight: "600" },
    error: { color: "red" }
});
