import { Controller, useForm } from "react-hook-form";
import { View, Text, TextInput, Pressable, KeyboardType, StyleSheet } from "react-native";
import { PropsWithChildren, useEffect } from "react";
import { form } from "../app/styles";
import CustomButt from "./CustomButt";

// creare un componente form para que s epueda usar de forma dinamica
export default function Form(props: PropsWithChildren<{
    // recibira el tipo
    type: {},
    // un arrray con los campos para el formulario y lo necesario para usar en los mismos
    values: { placeHold: string, rules: {}, key: string, keyBoard?: string, onChange?: Function }[],
    // y un onSubmit si se se quiere
    onSubmit: Function
}>) {
    // convertira el objeto pasado por props en un tipo
    type Form = typeof props.type;

    const {
        control,
        // esto controla el contenido de los campos, servira atnto como para que el formulario compruebe si tienen buen formato, como para recibir los datos a traves de el
        handleSubmit,
        // y esto sirve para controlar el estado del formulario 
        formState: { errors, isSubmitting }, reset } =
        // inicializara el formulario con los valores especificados
        useForm<Form>({ defaultValues: props.type }),
        // aunque ni si quiera esta funcionando consigue que se renderice cuando se equivocan al escribir algo
        onSubmit = async (data: Form) => {
            // creara un nuevo objeto cn los campos que tengan contenido
            let newData = {}
            // mapeara para agregar de forma dinamica
            props.values.map(it => {
                const addValue = data[getKey(it.key)]
                if (addValue !== "") newData = { [getKey(it.key)]: addValue, ...newData }
            })
            // llamara al onSubmit de la funcion que se le pasa
            props.onSubmit(newData)
        },
        // obtiene la key, auquerelamente es una forma de forzar el renderizado de los errrores por algun motivo que desconozco es necesario llamar a una funcion interna
        getKey = (k: string) => k as keyof Form,
        // esto devolvera la primera letra de cada campo en mayúscula 
        firsToUpper = (st: string) => st.replace(st.charAt(0), st.charAt(0).toUpperCase())

    useEffect(() => {
        reset(props.type)
    }, [props.type])

    return (
        <View style={form.parent}>
            {
                // ahora mapeara cada propiedad como un control
                props.values.map(item => {
                    // sera necesario castear a una porpiedad de Form 
                    const key = getKey(item.key)
                    return (
                        <><Controller key={item.placeHold} control={control}
                            name={key}
                            rules={item.rules}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput placeholderTextColor="black"
                                    placeholder={firsToUpper(item.placeHold)}
                                    value={value}
                                    // si se le pasa un metodo onChange lo usara sino usara el valor del input
                                    onChangeText={(val) => onChange(item.onChange ? item.onChange(val) : val)}
                                    /* onBlur es un poco mas complejo, en este caso solo lo quiero usar para cambiar el valor del input
                                    sustituyendo los espacios por guiones bajos */
                                    onBlur={onBlur}
                                    style={form.txIn}
                                    // el tipo de teclado habra que castearlo para evitar el error
                                    keyboardType={item.keyBoard !== undefined ? item.keyBoard as KeyboardType : "default"}
                                />
                            )} />
                            {errors[key] && <Text style={{color: "red"}}>{errors[key]?.["message"]}</Text>}
                        </>
                    )
                })
            }
            <View style={{ flexDirection: "row", width: "100%", gap: "2%" }}>
                <CustomButt label={isSubmitting ? "Guardando.." : "Guardar"} onPress={handleSubmit(onSubmit)} />
                {/*<Pressable style={form.butt} disabled={isSubmitting}
                    // si el label es guardar llamara por defecto a handleSubmit 
                    onPress={handleSubmit(onSubmit)}>
                    <Text style={form.txButt}>{isSubmitting ? "Guardando.." : "Guardar"}</Text>
                </Pressable>*/}
                {props.children}
            </View>
        </View>)
}