import { Redirect } from "expo-router";
import DeviceForm from "@/src/components/device-form";
import ScreenBackground from "@/src/components/screen-background";
import { CreateDeviceRequest } from "@/src/types/devices";
import { DeviceFormRequest } from "@/src/types/form";
import { useAppContext } from "@/src/components/app-context-provider";
import { ApiErrorResponse } from "@/src/types/api-response";
import LoadingWindow from "@/src/components/loading-window";

export default function Add() {
    const { setDevices, executeApiRequest, isAuthenticated } = useAppContext();

    async function createDevice(request: DeviceFormRequest): Promise<ApiErrorResponse | undefined> {
        const result = await executeApiRequest((apiUtils) => apiUtils.createDevice(request as CreateDeviceRequest));
        if (!result.success) {
            return result;
        }

        setDevices((devices) => [...devices, result.data]);
        return undefined;
    }

    if (!isAuthenticated) {
        return <Redirect href="/" />;
    }

    return (
        <ScreenBackground>
            <DeviceForm onSubmit={createDevice} />
            <LoadingWindow />
        </ScreenBackground>
    );
}
