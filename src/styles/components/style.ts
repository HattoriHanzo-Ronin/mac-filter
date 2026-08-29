import { StyleSheet } from "react-native";
import { commons } from "@/src/styles/style";

export const screenBackground = StyleSheet.create({
    container: { flex: 1 }
});

export const screenBackgroundLight = StyleSheet.create({
    container: { backgroundColor: "#fbf9ff" },
    image: { opacity: 0.1 }
});

export const screenBackgroundDark = StyleSheet.create({
    container: { backgroundColor: "#07090a" },
    image: { opacity: 0.16 }
});

export const deviceForm = StyleSheet.create({
    screen: { flex: 1 },
    form: { paddingHorizontal: 22, paddingTop: "15%", paddingBottom: 40, gap: 14 },
    label: { ...commons.label, fontSize: 17 },
    connectionLabel: { minHeight: 42, textAlignVertical: "bottom" },
    input: { minHeight: 50, borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, fontSize: 17 },
    passwordInput: { minHeight: 50, borderWidth: 1, borderRadius: 9, paddingHorizontal: 12 },
    passwordTextInput: { fontSize: 17 },
    pickerContainer: { minHeight: 50, justifyContent: "center", borderWidth: 1, borderRadius: 9 },
    connectionsTitle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    addRowButton: { flexDirection: "row", alignItems: "center", alignSelf: "center", gap: 7, padding: 8 },
    addRowText: { fontSize: 16, fontWeight: "600" },
    removeButton: { width: 34, height: 50, justifyContent: "center", alignItems: "center", marginTop: 48 },
    connection: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
    connectionType: { flex: 1, minWidth: 105, gap: 6 },
    connectionMac: { flex: 2, minWidth: 150, gap: 6 },
    error: commons.error
});

export const deviceFormDynamic = {
    form: (safeBottom: number) => ({ paddingBottom: safeBottom + 72 })
};

export const deviceFormLight = StyleSheet.create({
    screen: { backgroundColor: "rgba(251, 249, 255, 0.88)" },
    label: { color: "#30266f" },
    passwordTextInput: { color: "#27205f" },
    input: { color: "#27205f", borderColor: "#d8d3eb", backgroundColor: "rgba(255, 255, 255, 0.9)" },
    pickerContainer: { borderColor: "#d8d3eb", backgroundColor: "rgba(255, 255, 255, 0.9)" },
    accentText: { color: "#4e43c2" },
    primaryButton: { backgroundColor: "#378f73" }
});

export const deviceFormDark = StyleSheet.create({
    screen: { backgroundColor: "rgba(7, 9, 10, 0.9)" },
    label: { color: "#b8bdc1" },
    passwordTextInput: { color: "#f1f3f4" },
    input: { color: "#f1f3f4", borderColor: "#293036", backgroundColor: "#1a1f23" },
    pickerContainer: { borderColor: "#293036", backgroundColor: "#1a1f23" },
    accentText: { color: "#65b79f" },
    primaryButton: { backgroundColor: "#247d68" }
});

export const deviceFormPalette = {
    light: { icon: "#4e43c2", picker: "#30266f", switch: "#378f73", remove: "#a65f65" },
    dark: { icon: "#65b79f", picker: "#f1f3f4", switch: "#247d68", remove: "#c47a7e" }
};

export const passwordInput = StyleSheet.create({
    container: { flexDirection: "row", alignItems: "center", gap: 12 },
    input: { flex: 1 }
});

export const formField = StyleSheet.create({
    field: {
        gap: 6
    },
    horizontal: {
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    label: commons.label
});

export const validationMessages = StyleSheet.create({
    error: commons.error
});

export const commonComponents = StyleSheet.create({
    pickerContainer: { minHeight: 50, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, paddingHorizontal: 14, borderWidth: 1, borderRadius: 9 },
    picker: { flex: 1, fontSize: 17 },
    pickerItem: { flex: 1, fontSize: 17 },
    pickerBackdrop: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "rgba(0, 0, 0, 0.55)" },
    pickerDialog: { maxHeight: "70%", overflow: "hidden", borderWidth: 1, borderRadius: 12 },
    pickerOption: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
    pickerOptionPressed: { opacity: 0.72 },
    search: { flexDirection: "row", gap: 10 },
    searchInput: { flex: 1, minHeight: 52, borderWidth: 1, borderRadius: 9, paddingHorizontal: 14, fontSize: 17 },
    searchButton: { width: 100 }
});

export const commonComponentsLight = StyleSheet.create({
    pickerContainer: { borderColor: "#d8d3eb", backgroundColor: "rgba(255, 255, 255, 0.9)" },
    pickerDialog: { borderColor: "#d8d3eb", backgroundColor: "#fbf9ff" },
    pickerOption: { borderBottomColor: "#ded9ed" },
    selectedPickerOption: { backgroundColor: "#ece9fb" },
    picker: { color: "#30266f" },
    searchInput: { color: "#27205f", borderColor: "#d8d3eb", backgroundColor: "rgba(255, 255, 255, 0.9)" }
});

export const commonComponentsDark = StyleSheet.create({
    pickerContainer: { borderColor: "#394148", backgroundColor: "#1a1f23" },
    pickerDialog: { borderColor: "#394148", backgroundColor: "#111416" },
    pickerOption: { borderBottomColor: "#30373d" },
    selectedPickerOption: { backgroundColor: "#203c35" },
    picker: { color: "#f1f3f4" },
    searchInput: { color: "#f1f3f4", borderColor: "#394148", backgroundColor: "#15191c" }
});

export const commonComponentsPalette = {
    light: { placeholder: "#77718d", picker: "#30266f" },
    dark: { placeholder: "#8e959a", picker: "#f1f3f4" }
};

export const customButt = StyleSheet.create({
    pressable: {
        width: "100%"
    },
    background: {
        width: "100%",
        minHeight: 52,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "#2f8f75"
    },
    label: {
        color: "white",
        textAlign: "center",
        fontSize: 17,
        fontWeight: "600"
    },
    disabled: {
        opacity: 0.55
    },
    pressed: {
        opacity: 0.82
    }
});
