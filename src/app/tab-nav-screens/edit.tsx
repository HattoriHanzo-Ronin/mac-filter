import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import { edit } from "../../styles";
import UiUtils from "@/src/utils/ui-utils";
import { DeviceFormRequest } from "@/src/types/form";
import { UpdateDeviceRequest } from "@/src/types/devices";
import { useAppContext } from "@/src/components/app-context-provider";
import DeviceForm from "@/src/components/device-form";
import { ApiErrorResponse } from "@/src/types/api-response";

export default function Edit() {
    const { lastDevice, setDevices, setLastDevice, executeApiRequest, isAuthenticated } = useAppContext();

    async function updateDevice(request: DeviceFormRequest): Promise<ApiErrorResponse | undefined> {
        const result = await executeApiRequest((apiUtils) => apiUtils.updateDevice(request as UpdateDeviceRequest));
        if (!result.success) {
            return result;
        }

        const { data } = result;
        setDevices((devices) => devices.map((device) => (device.id === lastDevice?.id ? data : device)));
        setLastDevice(data);
        return undefined;
    }

    if (!isAuthenticated) {
        return <Redirect href="/" />;
    }

    if (!lastDevice) {
        return <Redirect href="/tab-nav-screens" />;
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={edit.parent}>
                <Text style={edit.titleForm}>Editar {UiUtils.makeName(lastDevice.name, lastDevice.model ?? "")}</Text>
                <DeviceForm onSubmit={updateDevice} device={lastDevice} />
            </View>
        </View>
    );
}
