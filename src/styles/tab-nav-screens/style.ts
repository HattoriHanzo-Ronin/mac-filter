import { StyleSheet } from "react-native";
import { commons, darkTheme, lightTheme, type ThemeColors, type ThemeMode } from "@/src/styles/style";

function createTabLayoutStyles(theme: ThemeColors, mode: ThemeMode) {
    const isDark = mode === "dark";
    return StyleSheet.create({
        bar: { backgroundColor: theme.header, elevation: 0, shadowOpacity: 0, borderBottomColor: isDark ? "#293036" : "#e3deef", borderBottomWidth: StyleSheet.hairlineWidth },
        activeLabel: { color: isDark ? "#65b79f" : theme.accent },
        inactiveLabel: { color: isDark ? "#858d92" : "#9b94d6" },
        indicator: { backgroundColor: isDark ? "#65b79f" : theme.accent, height: 2 }
    });
}

export const tabLayoutStyles = {
    dark: createTabLayoutStyles(darkTheme, "dark"),
    light: createTabLayoutStyles(lightTheme, "light")
};

export const index = StyleSheet.create({
    screen: commons.screen,
    parent: { flex: 1, paddingHorizontal: 18, paddingTop: "10%", paddingBottom: 18, gap: 14 },
    controlSpacing: { marginBottom: "6%" },
    listActions: { marginTop: "20%", paddingBottom: "8%" },
    parentButt: { flexDirection: "row", width: "100%", gap: 10 },
    actionButton: { flex: 1 },
    dangerButton: { backgroundColor: "#a65f65" },
    connectionOptions: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", gap: 18, paddingLeft: "20%", paddingRight: "10%" },
    connectionOption: { flexDirection: "row", alignItems: "center", gap: 7 },
    connectionValue: { fontSize: 17, lineHeight: 24 },
    radioOuter: { width: 18, height: 18, borderWidth: 1.5, borderRadius: 9, justifyContent: "center", alignItems: "center" },
    radioInner: { width: 9, height: 9, borderRadius: 5 },
    scroll: commons.scroll,
    list: { gap: 16 },
    listContent: { paddingVertical: 8, paddingBottom: 24 },
    parentDevProp: { gap: 6 },
    labelProp: { width: "100%", paddingLeft: "10%", paddingRight: "10%", fontSize: 16, fontWeight: "600" },
    valueGroup: { width: "100%", gap: 6 },
    valueProp: { width: "100%", paddingLeft: "20%", paddingRight: "10%", fontSize: 17, lineHeight: 24 },
    qrLink: { alignSelf: "center", paddingVertical: 4, fontSize: 15, fontWeight: "600" },
    qrBackdrop: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "rgba(0, 0, 0, 0.38)" },
    qrDialog: { width: "100%", maxWidth: 360, alignItems: "center", gap: 20, padding: 22, borderWidth: 1, borderRadius: 14, elevation: 8, shadowColor: "black", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 8 },
    qrHelperText: { fontSize: 16, lineHeight: 22, textAlign: "center" },
    qrContainer: { padding: 14, borderRadius: 10, backgroundColor: "white" },
    qrActions: { width: "100%", flexDirection: "row", gap: 12 },
    qrAction: { flex: 1 }
});

function createIndexStyles(theme: ThemeColors, mode: ThemeMode) {
    const isDark = mode === "dark";
    return StyleSheet.create({
        screen: { backgroundColor: isDark ? "rgba(7, 9, 10, 0.9)" : "rgba(251, 249, 255, 0.88)" },
        parentDevProp: { flexDirection: "column", ...(isDark ? {} : { alignItems: "flex-start" as const }) },
        labelProp: { color: isDark ? theme.textMuted : theme.text },
        valueProp: { color: theme.text },
        qrLink: { color: isDark ? "#65b79f" : "#4e43c2" },
        qrDialog: { borderColor: theme.border, backgroundColor: isDark ? theme.surface : theme.background },
        qrCloseButton: { backgroundColor: isDark ? "#4b5359" : theme.textMuted },
        radioOuter: { borderColor: isDark ? "#aeb5ba" : "#7770a6" },
        radioInner: { backgroundColor: isDark ? "#65b79f" : "#4e43c2" },
        primaryButton: { backgroundColor: theme.accent }
    });
}

export const indexStyles = {
    dark: createIndexStyles(darkTheme, "dark"),
    light: createIndexStyles(lightTheme, "light")
};

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
