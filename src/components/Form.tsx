import { Controller, useForm } from "react-hook-form";
import { View, Text, TextInput, KeyboardType } from "react-native";
import { PropsWithChildren, useEffect } from "react";
import { form } from "../app/styles";
import CustomButt from "./CustomButt";

export default function Form(
    props: PropsWithChildren<{
        type: {};
        values: { placeHold: string; rules: {}; key: string; keyBoard?: string; onChange?: Function }[];
        onSubmit: Function;
    }>
) {
    type Form = typeof props.type;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<Form>({ defaultValues: props.type });
    const onSubmit = async (data: Form) => {
        let newData = {};
        props.values.map((it) => {
            const addValue = data[getKey(it.key)];
            if (addValue !== "") {
                newData = { [getKey(it.key)]: addValue, ...newData };
            }
        });
        props.onSubmit(newData);
    };
    const getKey = (k: string) => k as keyof Form;
    const firsToUpper = (st: string) => st.replace(st.charAt(0), st.charAt(0).toUpperCase());

    useEffect(() => {
        reset(props.type);
    }, [props.type]);

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
                                    placeholder={firsToUpper(item.placeHold)}
                                    value={value}
                                    onChangeText={(val) => onChange(item.onChange ? item.onChange(val) : val)}
                                    onBlur={onBlur}
                                    style={form.txIn}
                                    keyboardType={
                                        item.keyBoard !== undefined ? (item.keyBoard as KeyboardType) : "default"
                                    }
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
