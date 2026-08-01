import { Redirect } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../components/app-context-provider";

export default function Logout() {
    const { authUtils, isAuthenticated, isLoading, user } = useAppContext();

    async function handleLogout() {
        await authUtils.logout();
    }

    if (!isAuthenticated) {
        return <Redirect href="/" />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
                <Text style={styles.title}>Sesión iniciada</Text>
                <Text>{user?.username}</Text>
                <Pressable
                    disabled={isLoading}
                    onPress={handleLogout}
                    style={({ pressed }) => [
                        styles.button,
                        isLoading && styles.buttonDisabled,
                        pressed && styles.buttonPressed
                    ]}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Cerrar sesión</Text>
                    )}
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
    content: {
        padding: 24,
        alignItems: "center",
        gap: 16
    },
    title: {
        fontSize: 28,
        fontWeight: "700"
    },
    button: {
        width: "100%",
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
