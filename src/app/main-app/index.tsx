import { View, Text, FlatList, useWindowDimensions } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { ListItem, Pick, SearchInput } from "@/src/components/common-components";
import { index } from "../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Background from "@/src/components/background";
import CustomButt from "@/src/components/custom-butt";
import UiUtils from "@/src/utils/ui-utils";
import { PLACEHOLDER_ITEM } from "@/src/constants";

const devices = [PLACEHOLDER_ITEM];

export default function Index() {
    const [selectedDevice, setSelectedDevice] = useState<ListItem>(devices[0]);
    const [val, setVal] = useState(selectedDevice.id);
    const [search, setSearch] = useState("");
    const safe = useSafeAreaInsets().bottom + (useWindowDimensions().height * 4) / 100;
    const deviceProps = [
        { label: "Nombre", val: UiUtils.makeName(selectedDevice.name, selectedDevice.type) },
        { label: "Mac", val: selectedDevice.mac },
        { label: "Interfaz", val: selectedDevice.intrface ?? "" },
        { label: "Ip", val: selectedDevice.ip ?? "" }
    ];

    return (
        <Background>
            <View style={[index.parent, { paddingBottom: safe }]}>
                <Text style={index.wifiFormat}>Red local</Text>
                <Pick
                    list={devices}
                    val={val}
                    onChange={(value: string) => setVal(value)}
                    changeItem={setSelectedDevice}
                />
                <SearchInput
                    list={devices}
                    search={search}
                    onChange={(value: string) => setSearch(value)}
                    setVal={(value: string) => setVal(value)}
                    changeItem={setSelectedDevice}
                />
                <FlatList
                    contentContainerStyle={index.list}
                    data={deviceProps}
                    renderItem={(it) => (
                        <View style={index.parentDevProp}>
                            <Text style={index.labelProp}>{it.item.label}:</Text>
                            <Text selectable style={index.valueProp}>
                                {it.item.val}
                            </Text>
                        </View>
                    )}
                    keyExtractor={(it) => it.label}
                />
                <View style={index.parentButt}>
                    <CustomButt label="Borrar" onPress={() => {}} />
                    <CustomButt label="Administrar" onPress={() => router.replace("/access-router")} />
                </View>
            </View>
        </Background>
    );
}
