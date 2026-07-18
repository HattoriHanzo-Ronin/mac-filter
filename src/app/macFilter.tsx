import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList, View, Text, useWindowDimensions, BackHandler } from "react-native";
import { Device, useAppContext } from "@/src/components/AppContextProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { makeNm, Pick, SearchInput } from "@/src/components/CommonUtils";
import { router } from "expo-router";
import { macFilter } from "./styles";
import Background from "../components/Background";
import CustomButt from "../components/CustomButt";



export default function MacFilter() {
  const
    // rocgera el contexto
    context = useAppContext(), 
    // generara los safe area
    safeTop = useSafeAreaInsets().top + useWindowDimensions().height * 10 / 100, safeBottom = useSafeAreaInsets().bottom + useWindowDimensions().height * 6 / 100,
    // controla el estado si muetsra permitidos o no permitidos
    [allow, setAllow] = useState(true),
    // controla el estado la lista de mac 
    [list, setList] = useState<Device[]>([]), [val, setVal] = useState(""),
    // controla el estado de la ultima mac seleccionada
    [lastWhite, setLastWhite] = useState<Device | undefined>(undefined),
    // controla el estado del array de propiedades
    [devProps, setDevProps] = useState<any[]>([]),
    // controla el estado del input de busqueda
    [search, setSearch] = useState(""),
    // utiliza esa lista para incializar todos los datos
    getData = async (isAllow: boolean) => {
      // obtiene la lista
      const { data } = await axios.get(`${context.url}?${isAllow ? "allow" : "notAllow"}=${context.lastDev?.id}`)
      // actuliza el estado de las variables
      setList(data)
      setLastWhite(data[0])
      setVal(data[0].id)
    },
    // crea el contenido de devProps
    mkDevProps = (dev: Device) => {
      return [{ label: "Nombre", val: makeNm(dev.name, dev.type) }, { label: "Mac", val: dev.mac.toUpperCase().replaceAll("-", ":") }]
    }


  useEffect(() => {
    // incializa todo en el primer render  
    getData(allow);
    // añade un evento al boton de atras para que vuelva a la pantalla principal
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace("/mainApp")
      // evita que el sistema haga la acción por defecto
      return true
    })

    // desmonta el listener al salir
    return () => sub.remove()
  }, [])

  // este actulizara el array de las propiedades
  useEffect(() => {
    // si esta iniciliazado actualizara el estado de la propiedades
    if (lastWhite) setDevProps(mkDevProps(lastWhite))
    //cada evz que cambia
  }, [lastWhite])

  return (
    <Background>
      <View style={[macFilter.parent, { paddingTop: safeTop, paddingBottom: safeBottom }]}>
        <CustomButt label={`Cambiar a ${allow ? "no permitidos" : "permitidos"}`}
          onPress={() => {
            // cambiara el estado de allow
            setAllow(!allow)
            // actulizara los datos
            getData(!allow)
          }} />
        <Pick list={list} val={val} onChange={(v: string) => setVal(v)} changeItem={(item: Device) => setLastWhite(item)} />
        <SearchInput list={list} search={search} onChange={(tx: string) => setSearch(tx)} setVal={(tx: string) => setVal(tx)} changeItem={(item: Device) => setLastWhite(item)} />
        <FlatList contentContainerStyle={macFilter.list} data={devProps} renderItem={it =>
          <View style={macFilter.parentDevProp}>
            <Text style={macFilter.labelProp}>{it.item.label}:</Text><Text selectable style={macFilter.valueProp}>{it.item.val}</Text>
          </View>}
          keyExtractor={it => it.label} />
        <CustomButt label={allow ? "Quitar" : "Añadir"}
          onPress={async () => {
            if (allow) {
              // borrara del filtro mac el device
              await axios.delete(`${context.url}/allow/${context.lastDev?.id}/${lastWhite?.id}`)
              await getData(allow)
              alert("Eliminado")
            } else {
              // añadira al filtro mac el device
              await axios.post(`${context.url}/allow/${context.lastDev?.id}`, lastWhite)
              await getData(allow)
              alert("Añadido")
            }
          }} />
      </View>
    </Background>)
}