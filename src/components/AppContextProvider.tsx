import axios from "axios";
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from "react";

interface Net {
    wifipass: string;
    pass: string;
    devices: Device[];
}

export interface Device {
    intrface: string;
    ip: string;
    name: string;
    id: string;
    type: string;
    mac: string;
}
interface ContextType {
    net: Net;
    lastDev: Device | null;
    setLastDev: Dispatch<SetStateAction<Device | null>>;
    getNet: Function;
    url: string;
    load: boolean;
}

const AppContext = createContext<ContextType>({} as ContextType);

export const useAppContext = () => {
    return useContext(AppContext);
};

export default function AppContextProvider(props: PropsWithChildren) {
    const [net, setNet] = useState<Net>({
        wifipass: "",
        pass: "",
        devices: []
    });
    const [lastDev, setLastDev] = useState<Device | null>(null);
    const url = "http://10.8.200.8:60001/net";
    const [load, setLoad] = useState(true);
    const getNet = async () => {
        setLoad(true);
        try {
            const list = await axios.get(url);
            const { data } = list;
            setNet(data);
            if (!lastDev && data?.devices?.length) {
                setLastDev(data.devices[0]);
            }
        } catch {
            alert("No hay datos");
        } finally {
            setLoad(false);
        }
    };
    const contextValues: ContextType = {
        net,
        lastDev,
        setLastDev,
        getNet,
        url,
        load
    };
    useEffect(() => {
        getNet();
    }, []);

    return <AppContext.Provider value={contextValues}>{props.children}</AppContext.Provider>;
}
