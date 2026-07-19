import { TextInput, View, Pressable, Text, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { accessRouter } from "../styles";
import { Pick } from "../components/common-components";
import { PLACEHOLDER_ITEM } from "../constants";

export default function AccessRouter() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={accessRouter.parent}>
                <Pressable onPress={() => router.replace("/main-app")}>
                    <Ionicons name="arrow-back" size={20} />
                </Pressable>
                <TextInput style={accessRouter.tabInput} value="" />
            </View>
            <WebView source={{ uri: "about:blank" }} javaScriptEnabled domStorageEnabled />
            <View style={accessRouter.parentFooter}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Switch style={{ alignSelf: "flex-start" }} value />
                    <Text style={{ textAlign: "left", flex: 1 }}>Desactivar</Text>
                    <Text style={{ textAlign: "right" }}>No permitidos</Text>
                    <Switch style={{ alignSelf: "flex-end" }} value={false} />
                </View>
                <View style={accessRouter.parentMac}>
                    <Text selectable style={{ fontSize: 15 }}>
                        MAC: {PLACEHOLDER_ITEM.mac.replaceAll(":", "-")}
                    </Text>
                    <Pressable style={accessRouter.butt}>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>Añadir</Text>
                    </Pressable>
                </View>
                <Pick list={[PLACEHOLDER_ITEM]} val={PLACEHOLDER_ITEM.id} onChange={() => {}} changeItem={() => {}} />
            </View>
        </SafeAreaView>
    );
}
