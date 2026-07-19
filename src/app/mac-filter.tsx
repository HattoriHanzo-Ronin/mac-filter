import { useEffect, useState } from "react";
import { FlatList, View, Text, useWindowDimensions, BackHandler } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListItem, Pick, SearchInput } from "@/src/components/common-components";
import { router } from "expo-router";
import { macFilter } from "../styles";
import Background from "../components/background";
import CustomButt from "../components/custom-butt";
import UiUtils from "../utils/ui-utils";
import { PLACEHOLDER_ITEM } from "../constants";

const entries = [PLACEHOLDER_ITEM];

export default function MacFilter() {
    const safeTop = useSafeAreaInsets().top + (useWindowDimensions().height * 10) / 100;
    const safeBottom = useSafeAreaInsets().bottom + (useWindowDimensions().height * 6) / 100;
    const [allow, setAllow] = useState(true);
    const [val, setVal] = useState(entries[0].id);
    const [selectedEntry, setSelectedEntry] = useState<ListItem>(entries[0]);
    const [search, setSearch] = useState("");
    const entryProps = [
        { label: "Nombre", val: UiUtils.makeName(selectedEntry.name, selectedEntry.type) },
        { label: "Mac", val: selectedEntry.mac }
    ];

    useEffect(() => {
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            router.replace("/main-app");
            return true;
        });

        return () => sub.remove();
    }, []);

    return (
        <Background>
            <View style={[macFilter.parent, { paddingTop: safeTop, paddingBottom: safeBottom }]}>
                <CustomButt
                    label={`Cambiar a ${allow ? "no permitidos" : "permitidos"}`}
                    onPress={() => setAllow(!allow)}
                />
                <Pick
                    list={entries}
                    val={val}
                    onChange={(value: string) => setVal(value)}
                    changeItem={setSelectedEntry}
                />
                <SearchInput
                    list={entries}
                    search={search}
                    onChange={(value: string) => setSearch(value)}
                    setVal={(value: string) => setVal(value)}
                    changeItem={setSelectedEntry}
                />
                <FlatList
                    contentContainerStyle={macFilter.list}
                    data={entryProps}
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
                <CustomButt label={allow ? "Quitar" : "Añadir"} onPress={() => {}} />
            </View>
        </Background>
    );
}
