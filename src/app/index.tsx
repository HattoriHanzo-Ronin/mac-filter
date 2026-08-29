import { Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImageBackground, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButt from "../components/custom-butt";
import FormField from "../components/form-field";
import FormTextInput from "../components/form-text-input";
import { FormPasswordInput } from "../components/password-input";
import { useAppContext } from "../components/app-context-provider";
import { login, loginDark, loginLight, loginPalette } from "@/src/styles/app/style";
import { LoginRequest } from "../types/auth";
import { ValidationErrors } from "../types/ui";
import UiUtils from "../utils/ui-utils";

const DEFAULT_VALUES: LoginRequest = { username: "", password: "" };

export default function Index() {
    const { authUtils, loadingUtils, isAuthenticated, isLoading } = useAppContext();
    const isDark = useColorScheme() === "dark";
    const theme = isDark ? loginDark : loginLight;
    const palette = isDark ? loginPalette.dark : loginPalette.light;
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
        <ImageBackground
            imageStyle={theme.backgroundImage}
            resizeMode="cover"
            source={require("@/assets/images/background.jpg")}
            style={[login.background, theme.background]}
        >
            <SafeAreaView style={login.safeArea}>
                <View style={login.form}>
                    <FormField label="Usuario" labelStyle={theme.label} errors={validationErrors.username}>
                        <View style={[login.inputContainer, theme.inputContainer]}>
                            <Ionicons color={palette.icon} name="person-outline" size={20} />
                            <FormTextInput
                                autoCapitalize="none"
                                autoComplete="username"
                                control={control}
                                editable={!isLoading}
                                name="username"
                                onValueChange={() => UiUtils.clearValidationError(setValidationErrors, "username")}
                                placeholder=""
                                placeholderTextColor={palette.placeholder}
                                style={[login.input, theme.input]}
                            />
                        </View>
                    </FormField>
                    <FormField label="Contraseña" labelStyle={theme.label} errors={validationErrors.password}>
                        <FormPasswordInput
                            autoCapitalize="none"
                            autoComplete="password"
                            containerStyle={[login.inputContainer, theme.inputContainer]}
                            control={control}
                            editable={!isLoading}
                            iconColor={palette.icon}
                            inputStyle={[login.input, theme.input]}
                            leftIcon="lock-closed-outline"
                            name="password"
                            onSubmitEditing={() => void handleSubmit(submitLogin)()}
                            onValueChange={() => UiUtils.clearValidationError(setValidationErrors, "password")}
                            placeholder=""
                            placeholderTextColor={palette.placeholder}
                        />
                    </FormField>
                    <CustomButt
                        buttonStyle={theme.button}
                        disabled={isSubmitDisabled}
                        label="Entrar"
                        loading={isLoading || isSubmitting}
                        onPress={handleSubmit(submitLogin)}
                    />
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}
