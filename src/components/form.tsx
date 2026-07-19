import { Controller, RegisterOptions, useForm } from "react-hook-form";
import { View, Text, TextInput, KeyboardType } from "react-native";
import { PropsWithChildren, useEffect } from "react";
import { form } from "../styles";
import CustomButt from "./custom-butt";
import UiUtils from "../utils/ui-utils";

export type FormValues = Record<string, string>;

export default function Form(
    props: PropsWithChildren<{
        type: FormValues;
        values: {
            placeHold: string;
            rules: RegisterOptions<FormValues>;
            key: string;
            keyBoard?: KeyboardType;
            onChange?: (value: string) => string;
        }[];
        onSubmit: (data: Partial<FormValues>) => void | Promise<void>;
    }>
) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<FormValues>({ defaultValues: props.type });
    const onSubmit = async (data: FormValues) => {
        let newData: Partial<FormValues> = {};
        props.values.map((it) => {
            const addValue = data[getKey(it.key)];
            if (addValue !== "") {
                newData = { [getKey(it.key)]: addValue, ...newData };
            }
        });
        props.onSubmit(newData);
    };
    const getKey = (k: string) => k as keyof FormValues;

    useEffect(() => {
        reset(props.type);
    }, [props.type, reset]);

    return (
        <View style={form.parent}>
            {props.values.map((item) => {
                const key = getKey(item.key);
                return (
                    <>
                        <Controller
                            key={item.placeHold}
                            control={control}
                            name={key}
                            rules={item.rules}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholderTextColor="black"
                                    placeholder={UiUtils.firstToUpper(item.placeHold)}
                                    value={value}
                                    onChangeText={(val) => onChange(item.onChange ? item.onChange(val) : val)}
                                    onBlur={onBlur}
                                    style={form.txIn}
                                    keyboardType={item.keyBoard ?? "default"}
                                />
                            )}
                        />
                        {errors[key] && <Text style={{ color: "red" }}>{errors[key]?.["message"]}</Text>}
                    </>
                );
            })}
            <View style={{ flexDirection: "row", width: "100%", gap: "2%" }}>
                <CustomButt label={isSubmitting ? "Guardando.." : "Guardar"} onPress={handleSubmit(onSubmit)} />
                {props.children}
            </View>
        </View>
    );
}
