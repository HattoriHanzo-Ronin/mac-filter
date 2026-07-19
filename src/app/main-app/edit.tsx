import { View, Text } from "react-native";
import Formu from "../../components/formu";
import { makeNm } from "@/src/components/common-utils";
import { edit } from "../styles";
import Background from "@/src/components/background";
export default function Edit() {
    const onSubmit = () => {};
    return (
        <Background>
            <View style={edit.parent}>
                <Text style={edit.titleForm}>Editar {makeNm("Dispositivo", "")}</Text>
                <Formu onSubmit={onSubmit} />
            </View>
        </Background>
    );
}
