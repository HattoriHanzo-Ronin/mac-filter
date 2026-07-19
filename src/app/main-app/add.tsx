import { View, Text } from "react-native";
import Formu from "@/src/components/formu";
import { useState } from "react";
import { add } from "../../styles";
import Background from "@/src/components/background";
import UiUtils from "@/src/utils/ui-utils";

export default function Add() {
    const onSubmit = () => {
        setName("");
        setType("");
    };
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    return (
        <Background>
            <View style={add.parent}>
                <Text style={add.titleForm}>Añadir {UiUtils.makeName(name, type)}</Text>
                <Formu
                    onSubmit={onSubmit}
                    onChangeName={(tx: string) => {
                        setName(tx);
                        return tx;
                    }}
                    onChangeType={(tx: string) => {
                        setType(tx);
                        return tx;
                    }}
                />
            </View>
        </Background>
    );
}
