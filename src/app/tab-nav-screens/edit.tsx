import { Redirect } from "expo-router";
import { DeviceFormRequest } from "@/src/types/form";
import { UpdateDeviceRequest } from "@/src/types/devices";
import { useAppContext } from "@/src/components/app-context-provider";
import DeviceForm from "@/src/components/device-form";
import ScreenBackground from "@/src/components/screen-background";
import { ApiErrorResponse } from "@/src/types/api-response";
import LoadingWindow from "@/src/components/loading-window";

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
        <ScreenBackground>
            <DeviceForm onSubmit={updateDevice} device={lastDevice} />
            <LoadingWindow />
        </ScreenBackground>
    );
}
