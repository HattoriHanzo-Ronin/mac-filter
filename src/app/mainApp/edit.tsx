import { View, Text } from "react-native";
import { Device, useAppContext } from "../../components/AppContextProvider";
import axios from "axios";
import Formu from "../../components/Formu";
import {  makeNm } from "@/src/components/CommonUtils";
import { edit } from "../styles";
import Background from "@/src/components/Background";
export default function Edit() {
    const context = useAppContext(),
        // metodo para el onsubmit del formulario
        onSubmit = async (data: {}) => {
            const devToEdit = data as Device
            if (devToEdit.type)
                await axios.patch(`${context.url}/${context.lastDev?.id}`, data)
            // actualiza la lista en el contexto
            await context.getNet()
            alert("Editado")
        }
    return (
        <Background>
            <View style={edit.parent}>
                <Text style={edit.titleForm}>Editar {makeNm(context.lastDev?.name ?? "", context.lastDev?.type ?? "")}</Text>
                <Formu onSubmit={onSubmit} editMode />
            </View>
        </Background>)
}