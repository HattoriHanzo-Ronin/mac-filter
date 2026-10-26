import { StyleSheet } from "react-native";
import { commons, darkTheme, lightTheme, type ThemeColors, type ThemeMode } from "@/src/styles/style";

export const rootLayout = StyleSheet.create({
    screen: commons.rootScreen
});

function createRootLayoutStyles(theme: ThemeColors) {
    return StyleSheet.create({
        header: { backgroundColor: theme.header },
        headerTint: { color: theme.text }
    });
}

export const rootLayoutStyles = {
    dark: createRootLayoutStyles(darkTheme),
    light: createRootLayoutStyles(lightTheme)
};

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

function createLoginStyles(theme: ThemeColors, mode: ThemeMode) {
    const isDark = mode === "dark";
    return StyleSheet.create({
        background: { backgroundColor: isDark ? "#050607" : "#f7f4ef" },
        backgroundImage: { opacity: isDark ? 0.34 : 0.2 },
        label: { color: isDark ? "#b9bdc2" : "#27205f" },
        inputContainer: {
            borderColor: isDark ? "#2d343a" : "#d7d2e5",
            backgroundColor: isDark ? "rgba(25, 30, 34, 0.94)" : "rgba(250, 249, 255, 0.92)"
        },
        input: { color: isDark ? "#f5f7f8" : "#181433" },
        button: { backgroundColor: theme.accent }
    });
}

export const loginStyles = {
    dark: createLoginStyles(darkTheme, "dark"),
    light: createLoginStyles(lightTheme, "light")
};

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
    acceptButton: {
        backgroundColor: "#2f8f75"
    },
    cancelButtonText: { fontWeight: "600" },
    acceptButtonText: {
        color: "white",
        fontWeight: "600"
    },
    textInput: {
        minHeight: 42,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        fontSize: 16
    },
    passwordInput: {
        minHeight: 42,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1
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
        elevation: 6,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6
    },
    option: {
        paddingHorizontal: 18,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    optionText: { fontSize: 16 },
    logoutText: { fontSize: 16 }
});

function createUserMenuStyles(theme: ThemeColors, mode: ThemeMode) {
    const isDark = mode === "dark";
    const outlinedSurface = isDark ? { borderWidth: 1, borderColor: "#343b40" } : {};
    return StyleSheet.create({
        dialog: { backgroundColor: isDark ? "#171b1e" : theme.surface, ...outlinedSurface },
        dialogLabel: { color: isDark ? theme.text : "#27205f" },
        textInput: { color: theme.text, borderBottomColor: isDark ? "#697178" : "#8b85ad" },
        passwordInput: { borderBottomColor: isDark ? "#697178" : "#8b85ad" },
        passwordTextInput: { color: theme.text },
        cancelButton: { backgroundColor: isDark ? "#343b40" : "#e8e6f0" },
        cancelButtonText: { color: isDark ? theme.text : "#27205f" },
        menu: { backgroundColor: isDark ? "#171b1e" : theme.surface, ...outlinedSurface },
        option: { borderBottomColor: isDark ? "#343b40" : theme.border },
        optionText: { color: isDark ? theme.text : "#27205f" },
        logoutText: { color: isDark ? "#d98289" : "#a94f57" }
    });
}

export const userMenuStyles = {
    dark: createUserMenuStyles(darkTheme, "dark"),
    light: createUserMenuStyles(lightTheme, "light")
};

export const userMenuPalette = {
    light: { headerText: "#27205f", headerIcon: "#4e43c2", dialogIcon: "#4e43c2" },
    dark: { headerText: "#f1f3f4", headerIcon: "#d8dde0", dialogIcon: "#d8dde0" }
};

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
    listActions: { marginTop: "20%" },
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

function createMacFilterStyles(theme: ThemeColors, mode: ThemeMode) {
    const isDark = mode === "dark";
    return StyleSheet.create({
        screen: { backgroundColor: isDark ? "rgba(7, 9, 10, 0.9)" : "rgba(251, 249, 255, 0.88)" },
        segmentedControl: { borderColor: isDark ? "#293036" : theme.border, backgroundColor: isDark ? theme.surfaceMuted : "rgba(255, 255, 255, 0.84)" },
        activeSegment: { backgroundColor: isDark ? theme.accent : "#5145c7" },
        segmentText: { color: isDark ? "#c1c6ca" : theme.text },
        activeSegmentText: { color: "white" },
        labelProp: { color: isDark ? theme.textMuted : theme.text },
        valueProp: { color: theme.text },
        radioOuter: { borderColor: isDark ? "#aeb5ba" : "#7770a6" },
        radioInner: { backgroundColor: isDark ? "#65b79f" : "#4e43c2" },
        primaryButton: { backgroundColor: theme.accent }
    });
}

export const macFilterStyles = {
    dark: createMacFilterStyles(darkTheme, "dark"),
    light: createMacFilterStyles(lightTheme, "light")
};

export const macFilterDynamic = {
    safeArea: (paddingBottom: number) => ({ paddingBottom })
};

export const accessRouter = StyleSheet.create({
    screen: { ...commons.screen, flex: 1, paddingHorizontal: 16, paddingTop: "10%", gap: 12 },
    webViewContainer: { flex: 1, overflow: "hidden", borderWidth: 1, borderRadius: 8 },
    actions: { flexDirection: "row", alignSelf: "center", gap: 18 },
    action: { padding: 10 }
});

function createAccessRouterStyles(theme: ThemeColors, mode: ThemeMode) {
    const isDark = mode === "dark";
    return StyleSheet.create({
        screen: { backgroundColor: isDark ? "rgba(7, 9, 10, 0.9)" : "rgba(251, 249, 255, 0.88)" },
        webViewContainer: { borderColor: isDark ? "#293036" : theme.border, backgroundColor: isDark ? "#111416" : "white" }
    });
}

export const accessRouterStyles = {
    dark: createAccessRouterStyles(darkTheme, "dark"),
    light: createAccessRouterStyles(lightTheme, "light")
};

export const accessRouterPalette = {
    light: { icon: "#4e43c2" },
    dark: { icon: "#d8dde0" }
};
