import { StyleSheet } from "react-native";

const commonStyle = StyleSheet.create({
    list: {
        flex: 1,
        padding: "2%",
        justifyContent: "center"
    },
    parentDevProp: {
        flexDirection: "column",
        gap: "5%"
    },
    labelProp: {
        fontSize: 20,
        fontWeight: "bold"
    },
    valueProp: {
        fontSize: 20,
        textAlign: "center"
    },
    titleForm: {
        fontSize: 30,
        fontWeight: "bold"
    },
    adEdParent: {
        flex: 1,
        padding: "10%",
        gap: "5%",
        alignItems: "center"
    }
});

export const form = StyleSheet.create({
    parent: {
        flex: 1,
        padding: 16,
        gap: 12,
        justifyContent: "center"
    },
    txIn: {
        borderWidth: 1,
        padding: 10
    },
    butt: {
        flex: 1,
        backgroundColor: "#1e88e5",
        padding: 12,
        alignItems: "center"
    },
    txButt: {
        color: "white",
        fontWeight: "600"
    }
});

export const index = StyleSheet.create({
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
    list: commonStyle.list,
    parentDevProp: commonStyle.parentDevProp,
    labelProp: commonStyle.labelProp,
    valueProp: commonStyle.valueProp
});

export const edit = StyleSheet.create({
    parent: commonStyle.adEdParent,
    titleForm: commonStyle.titleForm
});

export const add = StyleSheet.create({
    parent: commonStyle.adEdParent,
    titleForm: commonStyle.titleForm
});

export const macFilter = StyleSheet.create({
    parent: {
        flex: 1,
        justifyContent: "center",
        padding: "10%",
        gap: "8%",
        backgroundColor: "rgba(255, 255, 255, 0.23)"
    },
    list: commonStyle.list,
    parentDevProp: commonStyle.parentDevProp,
    labelProp: commonStyle.labelProp,
    valueProp: commonStyle.valueProp
});

export const accesRouter = StyleSheet.create({
    parent: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "2%",
        padding: "4%"
    },
    tabInput: {
        flex: 1,
        padding: "3%",
        backgroundColor: "rgba(170, 170, 170, 0.29)",
        borderRadius: 100
    },
    parentFooter: {
        padding: "4%",
        justifyContent: "center"
    },
    parentMac: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        margin: "3%",
        gap: "4%"
    },
    butt: {
        backgroundColor: "rgba(13, 158, 177, 0.74)",
        padding: "3%",
        borderRadius: 100
    }
});
