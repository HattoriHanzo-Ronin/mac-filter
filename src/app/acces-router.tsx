import { TextInput, View, Pressable, Text, Switch, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Device, useAppContext } from "../components/app-context-provider";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { accesRouter } from "./styles";
import axios from "axios";
import { Pick } from "../components/common-utils";

export default function Rout() {
    const context = useAppContext();
    const [urlWeb, setUrlWeb] = useState(
        `http://${context.lastDev?.ip}${context.lastDev?.type === "Router" ? "/te_acceso_router.asp" : ""}`
    );
    const [inVal, setInVal] = useState("");
    const [allow, setAllow] = useState(false);
    const [list, setList] = useState<Device[]>([]);
    const [val, setVal] = useState("");
    const [lastWhite, setLastWhite] = useState<Device | undefined>(undefined);
    const [show, setShow] = useState(true);
    const getWhitelist = async (isAllow: boolean) => {
        const { data } = await axios.get(`${context.url}?${isAllow ? "allow" : "notAllow"}=${context.lastDev?.id}`);
        setList(data);
        if (lastWhite === undefined) {
            setLastWhite(data[0]);
        }

        setVal(data[0].id);
    };
    const getScript = () => {
        if (context.lastDev?.type === "Rep") {
            return `
                    function fill(){
                        const input = document.querySelector('input[type="password"], input[name="password"]');

                        if(input){
                        input.value = "${context.net.pass}";

                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));

                        return;
                        }

                        setTimeout(fill,200);
                    }

                    fill();

                    
                    true;
                `;
        }

        return `
                    function fill(){
                        const input = document.querySelector('input[name="Password"]');
                        if(input){
                            input.value = "${context.net.pass}";
                            return;
                        }
                        setTimeout(fill,200);
                        }
                        fill();
                        true;
                `;
    };

    useEffect(() => {
        if (context.lastDev?.type === "Rep") {
            getWhitelist(allow);
        }

        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            if (!show) {
                setShow(true);
            }

            return true;
        });

        return () => sub.remove();
    }, []);

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
                    onSubmitEditing={(evt) => setUrlWeb(evt.nativeEvent.text)}
                />
            </View>
            <WebView
                source={{ uri: urlWeb }}
                onNavigationStateChange={(url) => {
                    setInVal(url.url);
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                injectedJavaScript={getScript()}
            />

            {context.lastDev?.type === "Rep" && show && (
                <View style={accesRouter.parentFooter}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Switch style={{ alignSelf: "flex-start" }} value={show} onChange={() => setShow(false)} />
                        <Text style={{ textAlign: "left", flex: 1 }}>Desactivar</Text>
                        <Text style={{ textAlign: "right" }}>{allow ? "Permitidos" : "No permitidos"}</Text>
                        <Switch
                            style={{ alignSelf: "flex-end" }}
                            value={allow}
                            onChange={() => {
                                setAllow(!allow);
                                getWhitelist(!allow);
                            }}
                        />
                    </View>
                    <View style={accesRouter.parentMac}>
                        <Text selectable style={{ fontSize: 15 }}>
                            MAC: {lastWhite?.mac.replaceAll(":", "-")}
                        </Text>
                        <Pressable
                            style={accesRouter.butt}
                            onPress={async () => {
                                if (urlWeb !== "accessControl") {
                                    setUrlWeb(`http://${context.lastDev?.ip}/webpages/index.html#/accessControl`);
                                }

                                if (allow) {
                                    await axios.delete(`${context.url}/allow/${context.lastDev?.id}/${lastWhite?.id}`);
                                    await getWhitelist(allow);
                                    setLastWhite(list[0]);
                                    alert("Eliminado");
                                } else {
                                    await axios.post(`${context.url}/allow/${context.lastDev?.id}`, lastWhite);
                                    await getWhitelist(!allow);
                                    setAllow(!allow);
                                    alert("Añadido");
                                }
                            }}
                        >
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{allow ? "Quitar" : "Añadir"}</Text>
                        </Pressable>
                    </View>
                    <Pick
                        list={list}
                        val={val}
                        onChange={(v: string) => setVal(v)}
                        changeItem={(item: Device) => setLastWhite(item)}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}
