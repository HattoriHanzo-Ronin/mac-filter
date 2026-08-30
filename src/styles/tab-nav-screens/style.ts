import { StyleSheet } from "react-native";
import { commons } from "@/src/styles/style";

export const tabLayoutLight = StyleSheet.create({
    bar: { backgroundColor: "#fbf9ff", elevation: 0, shadowOpacity: 0, borderBottomColor: "#e3deef", borderBottomWidth: StyleSheet.hairlineWidth },
    activeLabel: { color: "#378f73" },
    inactiveLabel: { color: "#9b94d6" },
    indicator: { backgroundColor: "#378f73", height: 2 }
});

export const tabLayoutDark = StyleSheet.create({
    bar: { backgroundColor: "#0d1012", elevation: 0, shadowOpacity: 0, borderBottomColor: "#293036", borderBottomWidth: StyleSheet.hairlineWidth },
    activeLabel: { color: "#65b79f" },
    inactiveLabel: { color: "#858d92" },
    indicator: { backgroundColor: "#65b79f", height: 2 }
});

export const index = StyleSheet.create({
    screen: commons.screen,
    parent: { flex: 1, paddingHorizontal: 18, paddingTop: "10%", paddingBottom: 18, gap: 14 },
    controlSpacing: { marginBottom: "6%" },
    parentButt: { flexDirection: "row", width: "100%", gap: 10, paddingBottom: "8%" },
    actionButton: { flex: 1 },
    dangerButton: { backgroundColor: "#a65f65" },
    connectionOptions: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", gap: 18, paddingLeft: "20%", paddingRight: "10%" },
    connectionOption: { flexDirection: "row", alignItems: "center", gap: 7 },
    connectionValue: { fontSize: 17, lineHeight: 24 },
    radioOuter: { width: 18, height: 18, borderWidth: 1.5, borderRadius: 9, justifyContent: "center", alignItems: "center" },
    radioInner: { width: 9, height: 9, borderRadius: 5 },
    scroll: commons.scroll,
    listFooter: commons.listFooter,
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

export const indexLight = StyleSheet.create({
    screen: { backgroundColor: "rgba(251, 249, 255, 0.88)" },
    parentDevProp: { flexDirection: "column", alignItems: "flex-start" },
    labelProp: { color: "#30266f" },
    valueProp: { color: "#30266f" },
    qrLink: { color: "#4e43c2" },
    qrDialog: { borderColor: "#d8d3eb", backgroundColor: "#fbf9ff" },
    qrCloseButton: { backgroundColor: "#77718d" },
    radioOuter: { borderColor: "#7770a6" },
    radioInner: { backgroundColor: "#4e43c2" },
    primaryButton: { backgroundColor: "#378f73" }
});

export const indexDark = StyleSheet.create({
    screen: { backgroundColor: "rgba(7, 9, 10, 0.9)" },
    parentDevProp: { flexDirection: "column" },
    labelProp: { color: "#b8bdc1" },
    valueProp: { color: "#f1f3f4" },
    qrLink: { color: "#65b79f" },
    qrDialog: { borderColor: "#394148", backgroundColor: "#15191c" },
    qrCloseButton: { backgroundColor: "#4b5359" },
    radioOuter: { borderColor: "#aeb5ba" },
    radioInner: { backgroundColor: "#65b79f" },
    primaryButton: { backgroundColor: "#247d68" }
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
