import { Picker } from "@react-native-picker/picker"
import { Device } from "./AppContextProvider"
import { TextInput, View } from "react-native"
import CustomButt from "./CustomButt"

export const Pick = (props: { list: Device[], val: string, onChange: Function, changeItem: Function }) => {

    return (
        <View style={{ borderWidth: 0.7, borderRadius: 100, borderStyle: "dashed"}}>
            <Picker style={{ color: "black" }} selectedValue={props.val} onValueChange={v => {
                // actualiza el id
                props.onChange(v)
                // actuliza el ultimo dispositivo
                props.changeItem(props.list.find(d => d.id === v))
            }}>
                {
                    // mapea la lista de dispositivos como picker items
                    props.list?.map(item => <Picker.Item style={{ fontSize: 20, fontWeight: "bold" }} key={item.id} value={item.id} label={makeNm(item.name, item.type)} />)
                }
            </Picker>
        </View>
    )
},
    SearchInput = (props: { list: Device[], search: string, onChange: Function, setVal: Function, changeItem: Function }) => {
        return (<View // mostrara un input y un boton para buscar por nombre o mac
            style={{ flexDirection: "row", gap: "2%" }}>
            <TextInput style={{ flex: 1, borderWidth: 1, padding: 10 }} value={props.search} onChangeText={(tx) => props.onChange(tx)} placeholder="Nombre o Mac" placeholderTextColor="black" />
            <CustomButt label="Buscar"
                onPress={() => {
                    const s = props.search.toLocaleLowerCase(), find = props.list.find(it => it.name === props.search) ||
                        props.list.find(it => it.mac === props.search.replaceAll("-", ":"))
                    // si lo encuentra actualiza las variables
                    if (find) {
                        if (props.changeItem) props.changeItem(find)
                        props.setVal(find.id)
                        // sino muestra un alert
                    } else {
                        alert("No se ha encontrado resultado")
                    }
                    props.onChange("")
                }} style={{ width: "30%" }} />
        </View>)
    },
    // crea el formato del nombre junto con el tipo si existe
    makeNm = (st: string, st2: string) => `${st} ${st2 !== "" ? `( ${st2} )` : ""}`