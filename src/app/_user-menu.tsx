import { Ionicons } from "@expo/vector-icons";
import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAppContext } from "@/src/components/app-context-provider";
import ValidationMessages from "@/src/components/validation-messages";
import { ValidationErrors } from "@/src/types/ui";
import { UpdatePasswordRequest, UpdateUsernameRequest } from "@/src/types/users";
import UiUtils from "@/src/utils/ui-utils";

export function Dialog(props: PropsWithChildren<{ visible: boolean; onCancel: () => void; onAccept: () => void }>) {
    const { children, visible, onCancel, onAccept } = props;

    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
            <View style={styles.dialogBackdrop}>
                <View style={styles.dialog}>
                    {children}
                    <View style={styles.dialogActions}>
                        <Pressable style={[styles.dialogButton, styles.cancelButton]} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </Pressable>
                        <Pressable style={[styles.dialogButton, styles.acceptButton]} onPress={onAccept}>
                            <Text style={styles.acceptButtonText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function PasswordInput(props: { value: string; onChangeText: (value: string) => void }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View style={styles.passwordInput}>
            <TextInput
                autoCapitalize="none"
                secureTextEntry={!isVisible}
                style={styles.passwordTextInput}
                value={props.value}
                onChangeText={props.onChangeText}
            />
            <Pressable hitSlop={8} onPress={() => setIsVisible((isVisible) => !isVisible)}>
                <Ionicons color="#4b5563" name={isVisible ? "eye-off-outline" : "eye-outline"} size={22} />
            </Pressable>
        </View>
    );
}

function closeDialog(setIsVisible: Dispatch<SetStateAction<boolean>>, onClose: () => void): void {
    setIsVisible(false);
    onClose();
}

function ChangeUsernameMenu(props: { onClose: () => void }) {
    const { user, setUser, executeApiRequest } = useAppContext();
    const [isVisible, setIsVisible] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [validationErrors, setValidationErrors] = useState<ValidationErrors<UpdateUsernameRequest>>({});

    async function changeUsername(): Promise<void> {
        const result = await executeApiRequest((apiUtils) =>
            apiUtils.updateUsername({ id: user?.id ?? "", username: newUsername.trim() })
        );
        if (result.success) {
            const { username } = result.data;
            setValidationErrors({});
            setIsVisible(false);
            props.onClose();
            setUser((user) => (user ? { ...user, username } : null));
            return;
        }
        setValidationErrors(
            result.error.details ? UiUtils.mapValidationErrors<UpdateUsernameRequest>(result.error.details) : {}
        );
    }

    return (
        <>
            <Pressable style={styles.option} onPress={() => setIsVisible(true)}>
                <Text style={styles.optionText}>Cambiar nombre de usuario</Text>
            </Pressable>
            <Dialog visible={isVisible} onCancel={() => closeDialog(setIsVisible, props.onClose)} onAccept={() => void changeUsername()}>
                <Text>Nuevo nombre de usuario:</Text>
                <TextInput
                    autoCapitalize="none"
                    style={styles.textInput}
                    value={newUsername}
                    onChangeText={(value) => {
                        setNewUsername(value);
                        setValidationErrors((errors) => UiUtils.removeValidationError(errors, "username"));
                    }}
                />
                <ValidationMessages errors={validationErrors.username} />
            </Dialog>
        </>
    );
}

function ChangePasswordMenu(props: { onClose: () => void }) {
    const { authUtils, executeApiRequest } = useAppContext();
    const [isVisible, setIsVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [validationErrors, setValidationErrors] = useState<ValidationErrors<UpdatePasswordRequest>>({});

    async function changePassword(): Promise<void> {
        const result = await executeApiRequest((apiUtils) => apiUtils.updatePassword({ currentPassword, newPassword }));
        if (result.success) {
            setValidationErrors({});
            await authUtils.logout();
            return;
        }

        setValidationErrors(
            result.error.details ? UiUtils.mapValidationErrors<UpdatePasswordRequest>(result.error.details) : {}
        );
    }

    return (
        <>
            <Pressable style={styles.option} onPress={() => setIsVisible(true)}>
                <Text style={styles.optionText}>Cambiar contraseña</Text>
            </Pressable>
            <Dialog visible={isVisible} onCancel={() => closeDialog(setIsVisible, props.onClose)} onAccept={() => void changePassword()}>
                <Text>Contraseña actual:</Text>
                <PasswordInput
                    value={currentPassword}
                    onChangeText={(value) => {
                        setCurrentPassword(value);
                        setValidationErrors((errors) => UiUtils.removeValidationError(errors, "currentPassword"));
                    }}
                />
                <ValidationMessages errors={validationErrors.currentPassword} />
                <Text>Nueva contraseña:</Text>
                <PasswordInput
                    value={newPassword}
                    onChangeText={(value) => {
                        setNewPassword(value);
                        setValidationErrors((errors) => UiUtils.removeValidationError(errors, "newPassword"));
                    }}
                />
                <ValidationMessages errors={validationErrors.newPassword} />
            </Dialog>
        </>
    );
}

export default function UserMenu() {
    const { user, authUtils } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View style={styles.header}>
            <Text numberOfLines={1} style={styles.username}>
                {user?.username}
            </Text>
            <Pressable hitSlop={8} onPress={() => setIsOpen(true)}>
                <Ionicons color="#4b5563" name="open-outline" size={20} />
            </Pressable>
            <Modal animationType="fade" transparent visible={isOpen} onRequestClose={() => setIsOpen(false)}>
                <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
                    <View style={styles.menu}>
                        <ChangeUsernameMenu onClose={() => setIsOpen(false)} />
                        <ChangePasswordMenu onClose={() => setIsOpen(false)} />
                        <Pressable style={styles.option} onPress={() => void authUtils.logout()}>
                            <Text style={styles.logoutText}>Cerrar sesión</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    dialogBackdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "rgba(0, 0, 0, 0.35)"
    },
    dialog: {
        width: "100%",
        maxWidth: 420,
        gap: 16,
        padding: 20,
        borderRadius: 10,
        backgroundColor: "white",
        elevation: 6,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6
    },
    dialogActions: {
        flexDirection: "row",
        gap: 12
    },
    dialogButton: {
        flex: 1,
        minHeight: 44,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 6
    },
    cancelButton: {
        backgroundColor: "#e5e7eb"
    },
    acceptButton: {
        backgroundColor: "#1e88e5"
    },
    cancelButtonText: {
        color: "#111827",
        fontWeight: "600"
    },
    acceptButtonText: {
        color: "white",
        fontWeight: "600"
    },
    textInput: {
        minHeight: 42,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#6b7280",
        fontSize: 16
    },
    passwordInput: {
        minHeight: 42,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#6b7280"
    },
    passwordTextInput: {
        flex: 1,
        paddingHorizontal: 4,
        fontSize: 16
    },
    header: {
        maxWidth: 220,
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    username: {
        flexShrink: 1,
        fontSize: 16,
        fontWeight: "600"
    },
    backdrop: {
        flex: 1,
        alignItems: "flex-end",
        paddingTop: 54,
        paddingRight: 12,
        backgroundColor: "rgba(0, 0, 0, 0.15)"
    },
    menu: {
        minWidth: 230,
        overflow: "hidden",
        borderRadius: 8,
        backgroundColor: "white",
        elevation: 6,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6
    },
    option: {
        paddingHorizontal: 18,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#d1d5db"
    },
    optionText: {
        fontSize: 16,
        color: "#111827"
    },
    logoutText: {
        fontSize: 16,
        color: "#dc2626"
    }
});
