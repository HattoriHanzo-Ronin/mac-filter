import { View, Text } from "react-native";
import Formu from "../../components/formu";
import { edit } from "../../styles";
import Background from "@/src/components/background";
import UiUtils from "@/src/utils/ui-utils";
export default function Edit() {
    const onSubmit = () => {};
    return (
        <Background>
            <View style={edit.parent}>
                <Text style={edit.titleForm}>Editar {UiUtils.makeName("Dispositivo", "")}</Text>
                <Formu onSubmit={onSubmit} />
            </View>
        </Background>
    );
}
