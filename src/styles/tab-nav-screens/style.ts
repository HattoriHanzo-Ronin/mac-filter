import { StyleSheet } from "react-native";
import { commons } from "@/src/styles/style";

export const index = StyleSheet.create({
    screen: commons.screen,
    parent: {
        flex: 1,
        padding: "10%",
        gap: "5%"
    },
    wifiFormat: {
        fontSize: 20,
        fontWeight: "bold"
    },
    parentButt: {
        flexDirection: "row",
        width: "100%",
        gap: "2%"
    },
    connectionOptions: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16
    },
    connectionOption: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "black"
    },
    scroll: commons.scroll,
    listFooter: commons.listFooter,
    list: commons.list,
    listContent: { paddingBottom: "2%" },
    parentDevProp: commons.parentDevProp,
    labelProp: commons.labelProp,
    valueProp: commons.valueProp
});

export const edit = StyleSheet.create({
    screen: commons.screen,
    parent: commons.addEditParent,
    titleForm: commons.titleForm
});

export const add = StyleSheet.create({
    screen: commons.screen,
    parent: commons.addEditParent,
    titleForm: commons.titleForm
});
