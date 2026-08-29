import { useEffect, useState } from "react";
import { login } from "@/src/styles/app/style";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../components/app-context-provider";
import { LoginRequest } from "../types/auth";
import { ValidationErrors } from "../types/ui";
import UiUtils from "../utils/ui-utils";

export default function Index() {
    const { authUtils, loadingUtils, isAuthenticated, isLoading } = useAppContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validationErrors, setValidationErrors] = useState<ValidationErrors<LoginRequest>>({});
    const isSubmitDisabled = isLoading || !username.trim() || !password;
    const { username: usernameError, password: passwordError } = validationErrors;

    async function handleLogin() {
        const validationDetails = await loadingUtils.run(() =>
            authUtils.login({ username: username.trim(), password })
        );
        if (validationDetails) {
            setValidationErrors(UiUtils.mapValidationErrors<LoginRequest>(validationDetails));
        }
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
                <TextInput
                    autoCapitalize="none"
                    autoComplete="username"
                    editable={!isLoading}
                    onChangeText={(value) => {
                        setUsername(value);
                        setValidationErrors((errors) => UiUtils.removeValidationError(errors, "username"));
                    }}
                    placeholder="Usuario"
                    style={login.input}
                    value={username}
                />
                {usernameError && <Text>{usernameError.join("\n")}</Text>}
                <TextInput
                    autoCapitalize="none"
                    autoComplete="password"
                    editable={!isLoading}
                    onChangeText={(value) => {
                        setPassword(value);
                        setValidationErrors((errors) => UiUtils.removeValidationError(errors, "password"));
                    }}
                    onSubmitEditing={isSubmitDisabled ? undefined : handleLogin}
                    placeholder="Contraseña"
                    secureTextEntry
                    style={login.input}
                    value={password}
                />
                {passwordError && <Text>{passwordError.join("\n")}</Text>}
                <Pressable
                    disabled={isSubmitDisabled}
                    onPress={handleLogin}
                    style={({ pressed }) => [
                        login.button,
                        isSubmitDisabled && login.buttonDisabled,
                        pressed && login.buttonPressed
                    ]}
                >
                    {isLoading ? <ActivityIndicator color="white" /> : <Text style={login.buttonText}>Entrar</Text>}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
