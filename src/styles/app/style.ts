import { StyleSheet } from "react-native";
import { commons } from "@/src/styles/style";

export const rootLayout = StyleSheet.create({
    screen: commons.rootScreen
});

export const login = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white"
    },
    form: {
        padding: 24,
        gap: 16
    },
    title: {
        marginBottom: 8,
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16
    },
    button: {
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        backgroundColor: "#1e88e5"
    },
    buttonDisabled: {
        opacity: 0.5
    },
    buttonPressed: {
        opacity: 0.8
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    }
});

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
        backgroundColor: "#1e88e5"
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
    screen: commons.screen,
    parent: {
        flex: 1,
        justifyContent: "center",
        padding: "10%",
        gap: "8%",
        backgroundColor: "rgba(255, 255, 255, 0.23)"
    },
    scroll: commons.scroll,
    list: commons.list,
    listContent: { paddingBottom: 20 },
    parentDevProp: commons.parentDevProp,
    labelProp: commons.labelProp,
    valueProp: commons.valueProp,
    connectionOptions: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 16 },
    connectionOption: { flexDirection: "row", alignItems: "center", gap: 8 },
    radioOuter: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "black" }
});

export const macFilterDynamic = {
    safeArea: (paddingTop: number, paddingBottom: number) => ({ paddingTop, paddingBottom })
};

export const accessRouter = StyleSheet.create({
    screen: commons.screen,
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
    }
});
