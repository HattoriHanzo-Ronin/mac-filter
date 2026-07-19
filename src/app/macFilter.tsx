import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList, View, Text, useWindowDimensions, BackHandler } from "react-native";
import { Device, useAppContext } from "@/src/components/AppContextProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { makeNm, Pick, SearchInput } from "@/src/components/CommonUtils";
import { router } from "expo-router";
import { macFilter } from "./styles";
import Background from "../components/Background";
import CustomButt from "../components/CustomButt";

export default function MacFilter() {
    const context = useAppContext();
    const safeTop = useSafeAreaInsets().top + (useWindowDimensions().height * 10) / 100;
    const safeBottom = useSafeAreaInsets().bottom + (useWindowDimensions().height * 6) / 100;
    const [allow, setAllow] = useState(true);
    const [list, setList] = useState<Device[]>([]);
    const [val, setVal] = useState("");
    const [lastWhite, setLastWhite] = useState<Device | undefined>(undefined);
    const [devProps, setDevProps] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const getData = async (isAllow: boolean) => {
        const { data } = await axios.get(`${context.url}?${isAllow ? "allow" : "notAllow"}=${context.lastDev?.id}`);
        setList(data);
        setLastWhite(data[0]);
        setVal(data[0].id);
    };
    const mkDevProps = (dev: Device) => {
        return [
            { label: "Nombre", val: makeNm(dev.name, dev.type) },
            { label: "Mac", val: dev.mac.toUpperCase().replaceAll("-", ":") }
        ];
    };

    useEffect(() => {
        getData(allow);
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            router.replace("/mainApp");
            return true;
        });

        return () => sub.remove();
    }, []);

    useEffect(() => {
        if (lastWhite) {
            setDevProps(mkDevProps(lastWhite));
        }
    }, [lastWhite]);

    return (
        <Background>
            <View style={[macFilter.parent, { paddingTop: safeTop, paddingBottom: safeBottom }]}>
                <CustomButt
                    label={`Cambiar a ${allow ? "no permitidos" : "permitidos"}`}
                    onPress={() => {
                        setAllow(!allow);
                        getData(!allow);
                    }}
                />
                <Pick
                    list={list}
                    val={val}
                    onChange={(v: string) => setVal(v)}
                    changeItem={(item: Device) => setLastWhite(item)}
                />
                <SearchInput
                    list={list}
                    search={search}
                    onChange={(tx: string) => setSearch(tx)}
                    setVal={(tx: string) => setVal(tx)}
                    changeItem={(item: Device) => setLastWhite(item)}
                />
                <FlatList
                    contentContainerStyle={macFilter.list}
                    data={devProps}
                    renderItem={(it) => (
                        <View style={macFilter.parentDevProp}>
                            <Text style={macFilter.labelProp}>{it.item.label}:</Text>
                            <Text selectable style={macFilter.valueProp}>
                                {it.item.val}
                            </Text>
                        </View>
                    )}
                    keyExtractor={(it) => it.label}
                />
                <CustomButt
                    label={allow ? "Quitar" : "Añadir"}
                    onPress={async () => {
                        if (allow) {
                            await axios.delete(`${context.url}/allow/${context.lastDev?.id}/${lastWhite?.id}`);
                            await getData(allow);
                            alert("Eliminado");
                        } else {
                            await axios.post(`${context.url}/allow/${context.lastDev?.id}`, lastWhite);
                            await getData(allow);
                            alert("Añadido");
                        }
                    }}
                />
            </View>
        </Background>
    );
}
