import { View, Text, FlatList, useWindowDimensions } from "react-native";
import { useEffect, useState } from "react";
import { Device, useAppContext } from "@/src/components/AppContextProvider";
import axios from "axios";
import { router } from "expo-router";
import { makeNm, Pick, SearchInput } from "@/src/components/CommonUtils";
import { index } from "../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Background from "@/src/components/Background";
import CustomButt from "@/src/components/CustomButt";




export default function Index() {
    const context = useAppContext(),
        // valor para medir el picker es siempre mejor usar un id que el propio objeto
        [val, setVal] = useState(""),
        // controla el estado del array de las propiedades del dispositivo
        [devProps, setDevProps] = useState<any[]>([]),
        // controla el estado del input de busqueda
        [search, setSearch] = useState(""),
        // crea el contenido de devProps
        mkDevProps = (dev: Device | null) => {
            if (dev) {
                // si tiene ip devolvera junto con ip
                if (dev?.ip !== "") return [{ label: "Nombre", val: makeNm(dev.name, dev.type) }, { label: "Mac", val: dev.mac }, { label: "Interfaz", val: dev.intrface },
                { label: "Ip", val: dev.ip }]
                // sino devolvera sin ip    
                return [{ label: "Nombre", val: makeNm(dev.name, dev.type) }, { label: "Mac", val: dev.mac }, { label: "Interfaz", val: dev.intrface }]
            }
            // por defecto lo devovlera vacio
            return []
        },
        // controlara el safe area de abajo 
        safe = useSafeAreaInsets().bottom + useWindowDimensions().height * 4 / 100


    useEffect(() => {
        // actualiza el valor del picker con el id de el ultimo dispositivo
        setVal(context.lastDev?.id ?? "")
        // actualiza la lista de propiedades del dispositivo
        setDevProps(mkDevProps(context.lastDev))
        // cada vez que el utlimo dispositivo cambia
    }, [context.lastDev])
    return (
        <Background>
            <View style={[index.parent, { paddingBottom: safe }]}>

                <Text style={index.wifiFormat}>{context.net.wifipass}</Text>
                <Pick list={context.net?.devices} val={val} onChange={(v: string) => setVal(v)} changeItem={(item: Device) => context.setLastDev(item)} />
                <SearchInput list={context.net?.devices} search={search} onChange={(tx: string) => setSearch(tx)} setVal={(tx: string) => setVal(tx)} changeItem={(item: Device) => context.setLastDev(item)} />
                <FlatList contentContainerStyle={index.list} data={devProps} renderItem={it =>
                    <View style={index.parentDevProp}>
                        <Text style={index.labelProp}>{it.item.label}:</Text><Text selectable style={index.valueProp}>{it.item.val}</Text>
                    </View>} keyExtractor={it => it.label} />
                <View style={index.parentButt}>
                    <CustomButt label="Borrar"
                        onPress={async () => {
                            // borrara el dispositivo seleccionado
                            await axios.delete(`${context.url}/${context.lastDev?.id}`)
                            await context.getNet()
                            context.setLastDev(context.net.devices[0])
                            alert("Eliminado")
                        }} />
                    {
                        // si el dispositivo seleccionado es un router o un repetidor mostrara un boton de Administrar
                        (context.lastDev?.type === "Router" || context.lastDev?.type === "Rep" && context.lastDev.name !== "RepCande") && <CustomButt label="Administrar"
                            onPress={() => {
                                // creara la url par apasarla como parametro
                                // y dependiendo de si es router o repetidor hara una cosa u otra
                                if (context.lastDev?.name === "RepPasillo") router.replace("/macFilter")
                                else router.replace("/accesRouter")
                            }} />
                    }
                </View>
            </View>

        </Background>)
}