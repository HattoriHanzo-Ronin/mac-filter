import axios from "axios"
import { useAppContext } from "@/src/components/AppContextProvider"
import { View, Text } from "react-native"
import Formu from "@/src/components/Formu"
import { useState } from "react"
import { makeNm } from "@/src/components/CommonUtils"
import { add } from "../styles"
import Background from "@/src/components/Background"

export default function Add() {
    const context = useAppContext(), onSubmit = async (data: {}) => {
        // añadira el dispositivo 
        await axios.post(context.url, data)
        await context.getNet()
        setName("")
        setType("")
        alert("Agregado")
    }, 
    // cobntrolaran el estadod el texto del titulo
    [name, setName] = useState(""), [type, setType] = useState("")
    return (
        <Background>
            <View style={add.parent}>
                <Text style={add.titleForm}>Añadir {makeNm(name, type)}</Text>
                <Formu onSubmit={onSubmit} onChangeName={(tx: string) => {
                    setName(tx)
                    return tx
                }}
                    onChangeType={(tx: string) => {
                        setType(tx)
                        return tx
                    }} />
            </View>
        </Background>)
}