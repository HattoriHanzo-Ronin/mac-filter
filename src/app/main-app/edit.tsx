import { View, Text } from "react-native";
import { Device, useAppContext } from "../../components/app-context-provider";
import axios from "axios";
import Formu from "../../components/formu";
import { makeNm } from "@/src/components/common-utils";
import { edit } from "../styles";
import Background from "@/src/components/background";
export default function Edit() {
    const context = useAppContext();
    const onSubmit = async (data: {}) => {
        const devToEdit = data as Device;
        if (devToEdit.type) {
            await axios.patch(`${context.url}/${context.lastDev?.id}`, data);
        }

        await context.getNet();
        alert("Editado");
    };
    return (
        <Background>
            <View style={edit.parent}>
                <Text style={edit.titleForm}>
                    Editar {makeNm(context.lastDev?.name ?? "", context.lastDev?.type ?? "")}
                </Text>
                <Formu onSubmit={onSubmit} editMode />
            </View>
        </Background>
    );
}
