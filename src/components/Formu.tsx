import { useAppContext } from "./AppContextProvider";
import Form from "./Form";

export default function Formu(props: { onSubmit: Function, onChangeName?: Function, onChangeType?: Function, editMode?: true }) {
    // mensajes de error de formato y requerido
    const formMess = "Formato incorrecto", reqErr = "Requerido",
        // recogera el contexto
        context = useAppContext(), dev = context.lastDev
    // creara un formulario dinamico dependiendo de lo que s ele pase por props
    return (
        <Form type={props.editMode ? { name: dev?.name, mac: dev?.mac, intrface: dev?.intrface, type: dev?.type, ip: dev?.ip } :
            { name: "", mac: "", intrface: "", type: "", ip: "" }}
            values={[
                {
                    placeHold: "nombre", rules: {
                        required: reqErr, pattern: {
                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/,
                            message: formMess
                        }
                    }, key: "name", onChange: props.onChangeName
                }, {
                    placeHold: "tipo", rules: {
                        pattern: {
                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/,
                            message: formMess
                        }
                    }, key: "type", onChange: props.onChangeType
                },
                {
                    placeHold: "mac", rules: {
                        validate: (val: string) => {
                            if (val && !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(val)) return formMess
                            if (context.net.devices.some(it => it.mac === val) && !props.editMode) return "La mac coincide con la de otro dispositivo"
                            if (!val) return reqErr
                            return true
                        }
                    }, key: "mac", onChange: (tx: string) => tx.replaceAll("-", ":").toLocaleUpperCase()
                },
                {
                    placeHold: "interfaz", rules:
                    {
                        validate: (val: string) => {
                            if (val && !/^[A-Za-z]+$/.test(val)) return formMess
                            if (val.length > 4) return "Longitud máxima, 4 caracteres"
                            if (!val) return reqErr
                            return true
                        }
                    }, key: "intrface"
                }, {
                    placeHold: "ip", rules: {
                        pattern: {
                            value: /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
                            message: formMess
                        }
                    }, key: "ip"
                }
            ]} onSubmit={props.onSubmit} />)
}