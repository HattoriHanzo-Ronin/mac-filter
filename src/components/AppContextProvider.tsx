import axios from "axios";
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useRef, useState } from "react"


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
// el tipo para el contexto
interface ContextType {
  net: Net,
  lastDev: Device | null,
  setLastDev: Dispatch<SetStateAction<Device | null>>
  getNet: Function,
  url: string,
  load: boolean
}

// el contexto que se usara
const AppContext = createContext<ContextType>({} as ContextType);

// servira para acceder al contexto
export const useAppContext = () => {
  return useContext(AppContext);
}

// servira para llamar al context providder como un elemento
export default function AppContextProvider(props: PropsWithChildren) {
  // manejaran el valor del contexto

  // crea la red por defecto vacia
  const [net, setNet] = useState<Net>({
    wifipass: "",
    pass: "",
    devices: []
  }),
    // mantendra el ultimo device seleccionado
    [lastDev, setLastDev] = useState<Device | null>(null),
    // la url de acceso a la api ---  android:usesCleartextTraffic="true" // esto va en aplication en el manifest de android sirve para que enrute el http---
    url = "http://10.8.200.8:60001/net",
    // controla el estado de carga
    [load, setLoad] = useState(true),
    getNet = async () => {
      // pondra load en true
      setLoad(true)
      try {
        // hara la consulta a la api
        const list = await axios.get(url), { data } = list
        // actulizara los datos
        setNet(data)
        if (!lastDev && data?.devices?.length) setLastDev(data.devices[0])
      } catch {
        alert("No hay datos")
      } finally {
        // cambiara el estado de load a false
        setLoad(false)
      }
    },
    contextValues: ContextType = {
      net,
      lastDev,
      setLastDev,
      getNet,
      url,
      load
    }
  useEffect(() => {
    getNet();
  }, [])

  return (
    <AppContext.Provider value={contextValues}>
      {props.children}
    </AppContext.Provider>
  )
}

