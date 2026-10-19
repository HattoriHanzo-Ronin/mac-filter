import { StyleSheet } from "react-native";

export type ThemeMode = "dark" | "light";

export interface ThemeColors {
    background: string;
    header: string;
    surface: string;
    surfaceMuted: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
    accentMuted: string;
    danger: string;
}

export const lightTheme: ThemeColors = {
    background: "#fbf9ff",
    header: "#fbf9ff",
    surface: "#ffffff",
    surfaceMuted: "rgba(255, 255, 255, 0.9)",
    border: "#d8d3eb",
    text: "#30266f",
    textMuted: "#77718d",
    accent: "#378f73",
    accentMuted: "#ece9fb",
    danger: "#a65f65"
};

export const darkTheme: ThemeColors = {
    background: "#07090a",
    header: "#0d1012",
    surface: "#15191c",
    surfaceMuted: "#1a1f23",
    border: "#394148",
    text: "#f1f3f4",
    textMuted: "#b8bdc1",
    accent: "#247d68",
    accentMuted: "#203c35",
    danger: "#c47a7e"
};

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
