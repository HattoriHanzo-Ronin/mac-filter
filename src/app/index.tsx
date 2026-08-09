import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../components/app-context-provider";
import { ValidationErrors } from "../types/ui";
import { LoginRequest } from "../types/auth";
import UiUtils from "../utils/ui-utils";

export default function Index() {
    const { authUtils, isAuthenticated, isLoading } = useAppContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validationErrors, setValidationErrors] = useState<ValidationErrors<LoginRequest>>({});
    const isSubmitDisabled = isLoading || !username.trim() || !password;
    const { username: usernameError, password: passwordError } = validationErrors;

    useEffect(() => {
        authUtils.restoreSession();
    }, [authUtils]);

    async function handleLogin() {
        const validationDetails = await authUtils.login({ username: username.trim(), password });
        if (validationDetails) {
            setValidationErrors(UiUtils.mapValidationErrors<LoginRequest>(validationDetails));
        }
    }

    if (isAuthenticated) {
        return <Redirect href="/logout" />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.form}>
                <Text style={styles.title}>Iniciar sesión</Text>
                <TextInput
                    autoCapitalize="none"
                    autoComplete="username"
                    editable={!isLoading}
                    onChangeText={(value) => {
                        setUsername(value);
                        setValidationErrors((errors) => UiUtils.removeValidationError(errors, "username"));
                    }}
                    placeholder="Usuario"
                    style={styles.input}
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
                    style={styles.input}
                    value={password}
                />
                {passwordError && <Text>{passwordError.join("\n")}</Text>}
                <Pressable
                    disabled={isSubmitDisabled}
                    onPress={handleLogin}
                    style={({ pressed }) => [
                        styles.button,
                        isSubmitDisabled && styles.buttonDisabled,
                        pressed && styles.buttonPressed
                    ]}
                >
                    {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Entrar</Text>}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white"
    },
    form: {
        padding: 24,
        gap: 16
    },
    title: {
        marginBottom: 8,
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16
    },
    button: {
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        backgroundColor: "#1e88e5"
    },
    buttonDisabled: {
        opacity: 0.5
    },
    buttonPressed: {
        opacity: 0.8
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    }
});
