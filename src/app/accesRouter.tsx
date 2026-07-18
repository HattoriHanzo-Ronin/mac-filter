
import { TextInput, View, Pressable, Text, Button, Switch, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Device, useAppContext } from '../components/AppContextProvider';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { accesRouter } from "./styles"
import axios from 'axios';
import { Pick } from '../components/CommonUtils';

export default function Rout() {
    // recoge el contexto
    const context = useAppContext(),
        // controla el estado de la url
        [urlWeb, setUrlWeb] = useState(`http://${context.lastDev?.ip}${context.lastDev?.type === "Router" ? "/te_acceso_router.asp" : ""}`),
        // controla ele stado del input donde se puede escribir la url
        [inVal, setInVal] = useState(""),
        // controla el estado si muetsra permitidos o no permitidos
        [allow, setAllow] = useState(false),
        // controla el estado la lista de mac 
        [list, setList] = useState<Device[]>([]), [val, setVal] = useState(""),
        // controla el estado de la ultima mac seleccionada
        [lastWhite, setLastWhite] = useState<Device | undefined>(undefined),
        // controla el estado del switch
        [show, setShow] = useState(true),
        getWhitelist = async (isAllow: boolean) => {
            // obtiene la lista
            const { data } = await axios.get(`${context.url}?${isAllow ? "allow" : "notAllow"}=${context.lastDev?.id}`)
            // actuliza el estado de las variables
            setList(data)
            if (lastWhite === undefined) setLastWhite(data[0])
            setVal(data[0].id)
        }, getScript = () => {
            if (context.lastDev?.type === "Rep") return `
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
                `
        }

    useEffect(() => {
        if (context.lastDev?.type === "Rep") getWhitelist(allow);

        // añade un evento al boton de atras para que vuelva a la pantalla principal
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            if (!show) setShow(true)
            // evita que el sistema haga la acción por defecto
            return true
        })

        // desmonta el listener al salir
        return () => sub.remove()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={accesRouter.parent}>
                <Pressable onPress={() => router.replace("/mainApp")}><Ionicons name="arrow-back" size={20} /></Pressable>
                <TextInput style={accesRouter.tabInput} value={inVal} onChangeText={setInVal}
                    // controla cuando se pulse enter y cambiara la url
                    onSubmitEditing={evt => setUrlWeb(evt.nativeEvent.text)} />
            </View>
            <WebView
                source={{ uri: urlWeb }}
                // controla cuando se cambia la url
                onNavigationStateChange={(url) => {
                    setInVal(url.url);
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                // este script injecta la contraseña en el input
                injectedJavaScript={getScript()}
            />

            {
                // mostrara un footer
                (context.lastDev?.type === "Rep" && show) &&
                <View style={accesRouter.parentFooter}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Switch style={{ alignSelf: "flex-start" }} value={show} onChange={() => setShow(false)} /><Text style={{ textAlign: "left", flex: 1 }}>Desactivar</Text>
                        <Text style={{ textAlign: "right" }}>{allow ? "Permitidos" : "No permitidos"}</Text><Switch style={{ alignSelf: "flex-end" }} value={allow}
                            onChange={
                                () => {
                                    setAllow(!allow)
                                    getWhitelist(!allow)
                                }
                            } />
                    </View>
                    <View style={accesRouter.parentMac}>
                        <Text selectable style={{ fontSize: 15 }}>MAC: {lastWhite?.mac.replaceAll(":", "-")}</Text>
                        <Pressable style={accesRouter.butt}
                            onPress={async () => {
                                if (urlWeb !== "accessControl") setUrlWeb(`http://${context.lastDev?.ip}/webpages/index.html#/accessControl`)
                                if (allow) {
                                    // borrara del filtro mac del device
                                    await axios.delete(`${context.url}/allow/${context.lastDev?.id}/${lastWhite?.id}`)
                                    await getWhitelist(allow)
                                    setLastWhite(list[0])
                                    alert("Eliminado")
                                } else {
                                    // añadira al filtro mac el device
                                    await axios.post(`${context.url}/allow/${context.lastDev?.id}`, lastWhite)
                                    await getWhitelist(!allow)
                                    setAllow(!allow)
                                    alert("Añadido")
                                }

                            }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{allow ? "Quitar" : "Añadir"}</Text>
                        </Pressable>
                    </View>
                    <Pick list={list} val={val} onChange={(v: string) => setVal(v)} changeItem={(item: Device) => setLastWhite(item)} />

                </View>}
        </SafeAreaView>)
}