import { StyleSheet } from "react-native";
import { commons } from "@/src/styles/style";

export const rootLayout = StyleSheet.create({
    screen: commons.rootScreen
});


export const login = StyleSheet.create({
    background: {
        flex: 1
    },
    safeArea: {
        flex: 1,
        justifyContent: "center"
    },
    form: {
        paddingHorizontal: 30,
        gap: 18
    },
    inputContainer: {
        minHeight: 54,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderRadius: 7
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16
    }
});

export const loginLight = StyleSheet.create({
    background: {
        backgroundColor: "#f7f4ef"
    },
    backgroundImage: {
        opacity: 0.2
    },
    label: {
        color: "#27205f"
    },
    inputContainer: {
        borderColor: "#d7d2e5",
        backgroundColor: "rgba(250, 249, 255, 0.92)"
    },
    input: {
        color: "#181433"
    },
    button: {
        backgroundColor: "#378f73"
    }
});

export const loginDark = StyleSheet.create({
    background: {
        backgroundColor: "#050607"
    },
    backgroundImage: {
        opacity: 0.34
    },
    label: {
        color: "#b9bdc2"
    },
    inputContainer: {
        borderColor: "#2d343a",
        backgroundColor: "rgba(25, 30, 34, 0.94)"
    },
    input: {
        color: "#f5f7f8"
    },
    button: {
        backgroundColor: "#247d68"
    }
});

export const loginPalette = {
    light: { icon: "#4f43bd", placeholder: "#746f8f" },
    dark: { icon: "#d2d6da", placeholder: "#8f969c" }
};

export const userMenu = StyleSheet.create({
    dialogBackdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "rgba(0, 0, 0, 0.35)"
    },
    dialog: {
        width: "100%",
        maxWidth: 420,
        gap: 16,
        padding: 20,
        borderRadius: 10,
        backgroundColor: "white",
        elevation: 6,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6
    },
    dialogActions: {
        flexDirection: "row",
        gap: 12
    },
    dialogButton: {
        flex: 1,
        minHeight: 44,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 6
    },
    cancelButton: {
        backgroundColor: "#e5e7eb"
    },
    acceptButton: {
        backgroundColor: "#2f8f75"
    },
    cancelButtonText: {
        color: "#111827",
        fontWeight: "600"
    },
    acceptButtonText: {
        color: "white",
        fontWeight: "600"
    },
    textInput: {
        minHeight: 42,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#6b7280",
        fontSize: 16
    },
    passwordInput: {
        minHeight: 42,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#6b7280"
    },
    passwordTextInput: {
        flex: 1,
        paddingHorizontal: 4,
        fontSize: 16
    },
    header: {
        maxWidth: 220,
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    username: {
        flexShrink: 1,
        fontSize: 16,
        fontWeight: "600"
    },
    backdrop: {
        flex: 1,
        alignItems: "flex-end",
        paddingTop: 54,
        paddingRight: 12,
        backgroundColor: "rgba(0, 0, 0, 0.15)"
    },
    menu: {
        minWidth: 230,
        overflow: "hidden",
        borderRadius: 8,
        backgroundColor: "white",
        elevation: 6,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6
    },
    option: {
        paddingHorizontal: 18,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#d1d5db"
    },
    optionText: {
        fontSize: 16,
        color: "#111827"
    },
    logoutText: {
        fontSize: 16,
        color: "#dc2626"
    }
});


export const macFilter = StyleSheet.create({
    screen: { ...commons.screen, flex: 1 },
    parent: { flex: 1, paddingHorizontal: 18, paddingTop: "10%", gap: 14 },
    segmentedControl: { flexDirection: "row", minHeight: 48, marginBottom: "10%", overflow: "hidden", borderWidth: 1, borderRadius: 9 },
    segment: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 8 },
    segmentText: { fontSize: 16, fontWeight: "500" },
    controlSpacing: { marginBottom: "6%" },
    scroll: commons.scroll,
    list: { gap: 16 },
    listContent: { paddingVertical: 8, paddingBottom: 24 },
    parentDevProp: { gap: 6 },
    labelProp: { width: "100%", paddingLeft: "10%", paddingRight: "10%", fontSize: 16, fontWeight: "600" },
    valueProp: { width: "100%", paddingLeft: "20%", paddingRight: "10%", fontSize: 17, lineHeight: 24 },
    connectionOptions: { width: "100%", flexDirection: "row", flexWrap: "wrap", gap: 18, paddingLeft: "20%", paddingRight: "10%" },
    connectionOption: { flexDirection: "row", alignItems: "center", gap: 7 },
    connectionValue: { fontSize: 17, lineHeight: 24 },
    radioOuter: { width: 18, height: 18, borderWidth: 1.5, borderRadius: 9, justifyContent: "center", alignItems: "center" },
    radioInner: { width: 9, height: 9, borderRadius: 5 },
    dangerButton: { backgroundColor: "#a65f65" }
});

export const macFilterLight = StyleSheet.create({
    screen: { backgroundColor: "rgba(251, 249, 255, 0.88)" },
    segmentedControl: { borderColor: "#d8d3eb", backgroundColor: "rgba(255, 255, 255, 0.84)" },
    activeSegment: { backgroundColor: "#5145c7" },
    segmentText: { color: "#30266f" },
    activeSegmentText: { color: "white" },
    labelProp: { color: "#30266f" },
    valueProp: { color: "#30266f" },
    radioOuter: { borderColor: "#7770a6" },
    radioInner: { backgroundColor: "#4e43c2" },
    primaryButton: { backgroundColor: "#378f73" }
});

export const macFilterDark = StyleSheet.create({
    screen: { backgroundColor: "rgba(7, 9, 10, 0.9)" },
    segmentedControl: { borderColor: "#293036", backgroundColor: "#1a1f23" },
    activeSegment: { backgroundColor: "#247d68" },
    segmentText: { color: "#c1c6ca" },
    activeSegmentText: { color: "white" },
    labelProp: { color: "#b8bdc1" },
    valueProp: { color: "#f1f3f4" },
    radioOuter: { borderColor: "#aeb5ba" },
    radioInner: { backgroundColor: "#65b79f" },
    primaryButton: { backgroundColor: "#247d68" }
});

export const macFilterDynamic = {
    safeArea: (paddingBottom: number) => ({ paddingBottom })
};

export const accessRouter = StyleSheet.create({
    screen: { ...commons.screen, flex: 1, paddingHorizontal: 16, paddingTop: "10%", gap: 12 },
    addressBar: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, borderWidth: 1, borderRadius: 9 },
    addressInput: { flex: 1, paddingVertical: 10, fontSize: 15 },
    webViewContainer: { flex: 1, overflow: "hidden", borderWidth: 1, borderRadius: 8 }
});

export const accessRouterLight = StyleSheet.create({
    screen: { backgroundColor: "rgba(251, 249, 255, 0.88)" },
    addressBar: { borderColor: "#d8d3eb", backgroundColor: "rgba(255, 255, 255, 0.9)" },
    addressInput: { color: "#30266f" },
    webViewContainer: { borderColor: "#d8d3eb", backgroundColor: "white" }
});

export const accessRouterDark = StyleSheet.create({
    screen: { backgroundColor: "rgba(7, 9, 10, 0.9)" },
    addressBar: { borderColor: "#293036", backgroundColor: "#1a1f23" },
    addressInput: { color: "#f1f3f4" },
    webViewContainer: { borderColor: "#293036", backgroundColor: "#111416" }
});

export const accessRouterPalette = {
    light: { icon: "#4e43c2" },
    dark: { icon: "#d8dde0" }
};
