import Form, { FormValues } from "./form";

export default function Formu(props: {
    onSubmit: (data: Partial<FormValues>) => void | Promise<void>;
    onChangeName?: (value: string) => string;
    onChangeType?: (value: string) => string;
}) {
    const formMess = "Formato incorrecto";
    const reqErr = "Requerido";
    return (
        <Form
            type={{ name: "", mac: "", intrface: "", type: "", ip: "" }}
            values={[
                {
                    placeHold: "nombre",
                    rules: {
                        required: reqErr,
                        pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/, message: formMess }
                    },
                    key: "name",
                    onChange: props.onChangeName
                },
                {
                    placeHold: "tipo",
                    rules: { pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/, message: formMess } },
                    key: "type",
                    onChange: props.onChangeType
                },
                {
                    placeHold: "mac",
                    rules: {
                        validate: (val: string) => {
                            if (val && !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(val)) {
                                return formMess;
                            }

                            if (!val) {
                                return reqErr;
                            }

                            return true;
                        }
                    },
                    key: "mac",
                    onChange: (tx: string) => tx.replaceAll("-", ":").toLocaleUpperCase()
                },
                {
                    placeHold: "interfaz",
                    rules: {
                        validate: (val: string) => {
                            if (val && !/^[A-Za-z]+$/.test(val)) {
                                return formMess;
                            }

                            if (val.length > 4) {
                                return "Longitud máxima, 4 caracteres";
                            }

                            if (!val) {
                                return reqErr;
                            }

                            return true;
                        }
                    },
                    key: "intrface"
                },
                {
                    placeHold: "ip",
                    rules: {
                        pattern: {
                            value: /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
                            message: formMess
                        }
                    },
                    key: "ip"
                }
            ]}
            onSubmit={props.onSubmit}
        />
    );
}
