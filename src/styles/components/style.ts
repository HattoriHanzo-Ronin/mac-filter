import { StyleSheet } from "react-native";
import { commons } from "@/src/styles/style";

export const deviceForm = StyleSheet.create({
    form: {
        padding: 16,
        gap: 16
    },
    label: commons.label,
    input: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 10
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 6
    },
    connectionsTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e88e5"
    },
    addButtonText: {
        color: "white",
        fontSize: 28,
        lineHeight: 30
    },
    removeButton: {
        width: 40,
        height: 40,
        marginTop: 25,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#c62828"
    },
    removeButtonText: {
        color: "white",
        fontSize: 28,
        lineHeight: 30
    },
    connection: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10
    },
    connectionType: {
        flex: 1,
        gap: 6
    },
    connectionMac: {
        flex: 2,
        gap: 6
    },
    error: commons.error
});

export const formField = StyleSheet.create({
    field: {
        gap: 6
    },
    label: commons.label
});

export const validationMessages = StyleSheet.create({
    error: commons.error
});

export const commonComponents = StyleSheet.create({
    pickerContainer: { borderWidth: 0.7, borderRadius: 100, borderStyle: "dashed" },
    picker: { color: "black" },
    pickerItem: { fontSize: 20, fontWeight: "bold" },
    search: { flexDirection: "row", gap: "2%" },
    searchInput: { flex: 1, borderWidth: 1, padding: 10 },
    searchButton: { width: "30%" }
});

export const customButt = StyleSheet.create({
    pressable: { flex: 1 },
    background: { width: "100%", height: 50, justifyContent: "center", alignItems: "center" },
    label: { textAlign: "center", fontSize: 19, fontWeight: "bold" }
});

export const customButtDynamic = {
    background: (active: boolean) => ({
        backgroundColor: active ? "rgba(13, 158, 177, 0.8)" : "rgba(13, 158, 177, 0.4)"
    }),
    label: (color: string) => ({ color })
};
