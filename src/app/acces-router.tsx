import { TextInput, View, Pressable, Text, Switch, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { accesRouter } from "./styles";
import { ListItem, Pick } from "../components/common-utils";

const entries: ListItem[] = [{ id: "placeholder", name: "Dispositivo", type: "", mac: "00:00:00:00:00:00" }];

export default function Rout() {
    const [urlWeb, setUrlWeb] = useState("about:blank");
    const [inVal, setInVal] = useState("");
    const [allow, setAllow] = useState(false);
    const [val, setVal] = useState(entries[0].id);
    const [selectedEntry, setSelectedEntry] = useState(entries[0]);
    const [show, setShow] = useState(true);

    useEffect(() => {
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            if (!show) {
                setShow(true);
            }

            return true;
        });

        return () => sub.remove();
    }, [show]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={accesRouter.parent}>
                <Pressable onPress={() => router.replace("/main-app")}>
                    <Ionicons name="arrow-back" size={20} />
                </Pressable>
                <TextInput
                    style={accesRouter.tabInput}
                    value={inVal}
                    onChangeText={setInVal}
                    onSubmitEditing={(evt) => setUrlWeb(evt.nativeEvent.text || "about:blank")}
                />
            </View>
            <WebView
                source={{ uri: urlWeb }}
                onNavigationStateChange={(state) => setInVal(state.url === "about:blank" ? "" : state.url)}
                javaScriptEnabled
                domStorageEnabled
            />
            {show && (
                <View style={accesRouter.parentFooter}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Switch style={{ alignSelf: "flex-start" }} value={show} onValueChange={() => setShow(false)} />
                        <Text style={{ textAlign: "left", flex: 1 }}>Desactivar</Text>
                        <Text style={{ textAlign: "right" }}>{allow ? "Permitidos" : "No permitidos"}</Text>
                        <Switch style={{ alignSelf: "flex-end" }} value={allow} onValueChange={setAllow} />
                    </View>
                    <View style={accesRouter.parentMac}>
                        <Text selectable style={{ fontSize: 15 }}>
                            MAC: {selectedEntry.mac.replaceAll(":", "-")}
                        </Text>
                        <Pressable style={accesRouter.butt} onPress={() => {}}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{allow ? "Quitar" : "Añadir"}</Text>
                        </Pressable>
                    </View>
                    <Pick
                        list={entries}
                        val={val}
                        onChange={(value: string) => setVal(value)}
                        changeItem={setSelectedEntry}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}
