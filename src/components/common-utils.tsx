import { Picker } from "@react-native-picker/picker";
import { TextInput, View } from "react-native";
import CustomButt from "./custom-butt";

export interface ListItem {
    id: string;
    name: string;
    type: string;
    mac: string;
    intrface?: string;
    ip?: string;
}

export const Pick = (props: {
    list: ListItem[];
    val: string;
    onChange: (value: string) => void;
    changeItem: (item: ListItem) => void;
}) => (
    <View style={{ borderWidth: 0.7, borderRadius: 100, borderStyle: "dashed" }}>
        <Picker
            style={{ color: "black" }}
            selectedValue={props.val}
            onValueChange={(v) => {
                props.onChange(v);
                const item = props.list.find((it) => it.id === v);
                if (item) {
                    props.changeItem(item);
                }
            }}
        >
            {props.list?.map((item) => (
                <Picker.Item
                    style={{ fontSize: 20, fontWeight: "bold" }}
                    key={item.id}
                    value={item.id}
                    label={makeNm(item.name, item.type)}
                />
            ))}
        </Picker>
    </View>
);

export const SearchInput = (props: {
    list: ListItem[];
    search: string;
    onChange: (value: string) => void;
    setVal: (value: string) => void;
    changeItem: (item: ListItem) => void;
}) => (
    <View style={{ flexDirection: "row", gap: "2%" }}>
        <TextInput
            style={{ flex: 1, borderWidth: 1, padding: 10 }}
            value={props.search}
            onChangeText={(tx) => props.onChange(tx)}
            placeholder="Nombre o Mac"
            placeholderTextColor="black"
        />
        <CustomButt
            label="Buscar"
            onPress={() => {
                const find =
                    props.list.find((it) => it.name === props.search) ||
                    props.list.find((it) => it.mac === props.search.replaceAll("-", ":"));
                if (find) {
                    if (props.changeItem) {
                        props.changeItem(find);
                    }

                    props.setVal(find.id);
                } else {
                    alert("No se ha encontrado resultado");
                }

                props.onChange("");
            }}
            style={{ width: "30%" }}
        />
    </View>
);

export const makeNm = (st: string, st2: string) => `${st} ${st2 !== "" ? `( ${st2} )` : ""}`;
