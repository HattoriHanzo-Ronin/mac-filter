import { StyleSheet } from "react-native";
import { commons, darkTheme, lightTheme, type ThemeColors, type ThemeMode } from "@/src/styles/style";

export const screenBackground = StyleSheet.create({
    container: { flex: 1 }
});

function createScreenBackgroundStyles(theme: ThemeColors, mode: ThemeMode) {
    return StyleSheet.create({
        container: { backgroundColor: theme.background },
        image: { opacity: mode === "dark" ? 0.16 : 0.1 }
    });
}

export const screenBackgroundStyles = {
    dark: createScreenBackgroundStyles(darkTheme, "dark"),
    light: createScreenBackgroundStyles(lightTheme, "light")
};

export const deviceForm = StyleSheet.create({
    screen: { flex: 1 },
    form: { paddingHorizontal: 22, paddingTop: "15%", paddingBottom: 40, gap: 14 },
    label: { ...commons.label, fontSize: 17 },
    connectionTypeLabel: { width: "32%", lineHeight: 21 },
    connectionTypeValue: { flex: 1 },
    connectionMacLabel: { width: 48, paddingTop: 14 },
    connectionMacValue: { flex: 1, gap: 6 },
    input: { minHeight: 50, borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, fontSize: 17 },
    passwordInput: { minHeight: 50, borderWidth: 1, borderRadius: 9, paddingHorizontal: 12 },
    passwordTextInput: { fontSize: 17 },
    pickerContainer: { minHeight: 50, justifyContent: "center", borderWidth: 1, borderRadius: 9 },
    connectionsTitle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    addRowButton: { flexDirection: "row", alignItems: "center", alignSelf: "center", gap: 7, padding: 8 },
    addRowText: { fontSize: 16, fontWeight: "600" },
    removeButton: { position: "absolute", top: 28, right: 0, width: 36, height: 36, justifyContent: "center", alignItems: "center" },
    connection: { position: "relative", width: "100%", gap: 12, paddingVertical: 14 },
    connectionType: { width: "100%", flexDirection: "row", alignItems: "center", gap: 6, paddingRight: 42 },
    connectionMac: { width: "100%", flexDirection: "row", alignItems: "flex-start", gap: 10 },
    error: commons.error
});

export const deviceFormDynamic = {
    form: (safeBottom: number) => ({ paddingBottom: safeBottom + 72 })
};

function createDeviceFormStyles(theme: ThemeColors, mode: ThemeMode) {
    const isDark = mode === "dark";
    return StyleSheet.create({
        screen: { backgroundColor: isDark ? "rgba(7, 9, 10, 0.9)" : "rgba(251, 249, 255, 0.88)" },
        label: { color: isDark ? theme.textMuted : theme.text },
        passwordTextInput: { color: isDark ? theme.text : "#27205f" },
        input: { color: isDark ? theme.text : "#27205f", borderColor: isDark ? "#293036" : theme.border, backgroundColor: theme.surfaceMuted },
        pickerContainer: { borderColor: isDark ? "#293036" : theme.border, backgroundColor: theme.surfaceMuted },
        connectionSeparator: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: isDark ? "rgba(101, 183, 159, 0.3)" : "rgba(78, 67, 194, 0.3)" },
        accentText: { color: isDark ? "#65b79f" : "#4e43c2" },
        primaryButton: { backgroundColor: theme.accent }
    });
}

export const deviceFormStyles = {
    dark: createDeviceFormStyles(darkTheme, "dark"),
    light: createDeviceFormStyles(lightTheme, "light")
};

export const deviceFormPalette = {
    light: { icon: "#4e43c2", picker: "#30266f", switch: "#378f73", remove: "#a65f65" },
    dark: { icon: "#65b79f", picker: "#f1f3f4", switch: "#247d68", remove: "#c47a7e" }
};

export const loadingWindow = StyleSheet.create({
    backdrop: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
    window: { minWidth: 180, alignItems: "center", gap: 16, paddingHorizontal: 28, paddingVertical: 24, borderWidth: 1, borderRadius: 14, elevation: 8, shadowColor: "black", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 8 },
    text: { fontSize: 17, fontWeight: "600" }
});

function createLoadingWindowStyles(theme: ThemeColors, mode: ThemeMode) {
    const isDark = mode === "dark";
    return StyleSheet.create({
        backdrop: { backgroundColor: isDark ? "rgba(0, 0, 0, 0.24)" : "rgba(25, 20, 50, 0.14)" },
        window: { borderColor: theme.border, backgroundColor: isDark ? theme.surface : theme.background },
        text: { color: theme.text },
        indicator: { color: isDark ? "#65b79f" : theme.accent }
    });
}

export const loadingWindowStyles = {
    dark: createLoadingWindowStyles(darkTheme, "dark"),
    light: createLoadingWindowStyles(lightTheme, "light")
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

function createCommonComponentStyles(theme: ThemeColors, mode: ThemeMode) {
    const isDark = mode === "dark";
    return StyleSheet.create({
        pickerContainer: { borderColor: theme.border, backgroundColor: theme.surfaceMuted },
        pickerDialog: { borderColor: theme.border, backgroundColor: isDark ? "#111416" : theme.background },
        pickerOption: { borderBottomColor: isDark ? "#30373d" : "#ded9ed" },
        selectedPickerOption: { backgroundColor: theme.accentMuted },
        picker: { color: theme.text },
        searchInput: { color: isDark ? theme.text : "#27205f", borderColor: theme.border, backgroundColor: isDark ? theme.surface : theme.surfaceMuted }
    });
}

export const commonComponentStyles = {
    dark: createCommonComponentStyles(darkTheme, "dark"),
    light: createCommonComponentStyles(lightTheme, "light")
};

export const commonComponentsPalette = {
    light: { placeholder: "#77718d", picker: "#30266f" },
    dark: { placeholder: "#8e959a", picker: "#f1f3f4" }
};

export const customButton = StyleSheet.create({
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
