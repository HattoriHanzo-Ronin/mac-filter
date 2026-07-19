import Form, { FormValues } from "./form";
import { VALIDATION_MESSAGES, VALIDATION_PATTERNS } from "../constants";

export default function Formu(props: {
    onSubmit: (data: Partial<FormValues>) => void | Promise<void>;
    onChangeName?: (value: string) => string;
    onChangeType?: (value: string) => string;
}) {
    return (
        <Form
            type={{ name: "", mac: "", intrface: "", type: "", ip: "" }}
            values={[
                {
                    placeHold: "nombre",
                    rules: {
                        required: VALIDATION_MESSAGES.REQUIRED,
                        pattern: {
                            value: VALIDATION_PATTERNS.NAME_OR_TYPE,
                            message: VALIDATION_MESSAGES.INVALID_FORMAT
                        }
                    },
                    key: "name",
                    onChange: props.onChangeName
                },
                {
                    placeHold: "tipo",
                    rules: {
                        pattern: {
                            value: VALIDATION_PATTERNS.NAME_OR_TYPE,
                            message: VALIDATION_MESSAGES.INVALID_FORMAT
                        }
                    },
                    key: "type",
                    onChange: props.onChangeType
                },
                {
                    placeHold: "mac",
                    rules: {
                        validate: (val: string) => {
                            if (val && !VALIDATION_PATTERNS.MAC.test(val)) {
                                return VALIDATION_MESSAGES.INVALID_FORMAT;
                            }

                            if (!val) {
                                return VALIDATION_MESSAGES.REQUIRED;
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
                            if (val && !VALIDATION_PATTERNS.INTERFACE.test(val)) {
                                return VALIDATION_MESSAGES.INVALID_FORMAT;
                            }

                            if (val.length > 4) {
                                return VALIDATION_MESSAGES.MAX_INTERFACE_LENGTH;
                            }

                            if (!val) {
                                return VALIDATION_MESSAGES.REQUIRED;
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
                            value: VALIDATION_PATTERNS.IP,
                            message: VALIDATION_MESSAGES.INVALID_FORMAT
                        }
                    },
                    key: "ip"
                }
            ]}
            onSubmit={props.onSubmit}
        />
    );
}
