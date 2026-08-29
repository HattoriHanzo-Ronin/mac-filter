import { Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../components/form-field";
import FormTextInput from "../components/form-text-input";
import { useAppContext } from "../components/app-context-provider";
import { login } from "@/src/styles/app/style";
import { LoginRequest } from "../types/auth";
import { ValidationErrors } from "../types/ui";
import UiUtils from "../utils/ui-utils";

const DEFAULT_VALUES: LoginRequest = { username: "", password: "" };

export default function Index() {
    const { authUtils, loadingUtils, isAuthenticated, isLoading } = useAppContext();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors<LoginRequest>>({});
    const {
        control,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<LoginRequest>({ defaultValues: DEFAULT_VALUES, mode: "onChange" });
    const isSubmitDisabled = isLoading || isSubmitting;

    async function submitLogin(values: LoginRequest): Promise<void> {
        const validationDetails = await loadingUtils.run(() =>
            authUtils.login({ username: values.username.trim(), password: values.password })
        );
        setValidationErrors(
            validationDetails ? UiUtils.mapValidationErrors<LoginRequest>(validationDetails) : {}
        );
    }

    useEffect(() => {
        void loadingUtils.run(() => authUtils.restoreSession());
    }, [authUtils, loadingUtils]);

    if (isAuthenticated) {
        return <Redirect href="/tab-nav-screens" />;
    }

    return (
        <SafeAreaView style={login.safeArea}>
            <View style={login.form}>
                <Text style={login.title}>Iniciar sesión</Text>
                <FormField label="Usuario" errors={validationErrors.username}>
                    <FormTextInput
                        autoCapitalize="none"
                        autoComplete="username"
                        control={control}
                        editable={!isLoading}
                        name="username"
                        onValueChange={() => UiUtils.clearValidationError(setValidationErrors, "username")}
                        placeholder="Usuario"
                        style={login.input}
                    />
                </FormField>
                <FormField label="Contraseña" errors={validationErrors.password}>
                    <View style={login.passwordInput}>
                        <FormTextInput
                            autoCapitalize="none"
                            autoComplete="password"
                            control={control}
                            editable={!isLoading}
                            name="password"
                            onSubmitEditing={() => void handleSubmit(submitLogin)()}
                            onValueChange={() => UiUtils.clearValidationError(setValidationErrors, "password")}
                            placeholder="Contraseña"
                            secureTextEntry={!isPasswordVisible}
                            style={login.passwordTextInput}
                        />
                        <Pressable
                            accessibilityLabel={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                            hitSlop={8}
                            onPress={() => setIsPasswordVisible((visible) => !visible)}
                        >
                            <Ionicons
                                color="#4b5563"
                                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                size={22}
                            />
                        </Pressable>
                    </View>
                </FormField>
                <Pressable
                    disabled={isSubmitDisabled}
                    onPress={handleSubmit(submitLogin)}
                    style={({ pressed }) => [
                        login.button,
                        isSubmitDisabled && login.buttonDisabled,
                        pressed && login.buttonPressed
                    ]}
                >
                    {isLoading || isSubmitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={login.buttonText}>Entrar</Text>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
