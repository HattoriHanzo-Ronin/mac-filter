import { Ionicons } from "@expo/vector-icons";
import { userMenu, userMenuPalette } from "@/src/styles/app/style";
import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { Modal, Pressable, Text, TextInput, View, useColorScheme } from "react-native";
import { useAppContext } from "@/src/components/app-context-provider";
import PasswordInput from "@/src/components/password-input";
import ValidationMessages from "@/src/components/validation-messages";
import { ValidationErrors } from "@/src/types/ui";
import { UpdatePasswordRequest, UpdateUsernameRequest } from "@/src/types/users";
import UiUtils from "@/src/utils/ui-utils";

export function Dialog(props: PropsWithChildren<{ visible: boolean; onCancel: () => void; onAccept: () => void }>) {
    const { children, visible, onCancel, onAccept } = props;

    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
            <View style={userMenu.dialogBackdrop}>
                <View style={userMenu.dialog}>
                    {children}
                    <View style={userMenu.dialogActions}>
                        <Pressable style={[userMenu.dialogButton, userMenu.cancelButton]} onPress={onCancel}>
                            <Text style={userMenu.cancelButtonText}>Cancelar</Text>
                        </Pressable>
                        <Pressable style={[userMenu.dialogButton, userMenu.acceptButton]} onPress={onAccept}>
                            <Text style={userMenu.acceptButtonText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
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
            <Pressable style={userMenu.option} onPress={() => setIsVisible(true)}>
                <Text style={userMenu.optionText}>Cambiar nombre de usuario</Text>
            </Pressable>
            <Dialog visible={isVisible} onCancel={() => closeDialog(setIsVisible, props.onClose)} onAccept={() => void changeUsername()}>
                <Text>Nuevo nombre de usuario:</Text>
                <TextInput
                    autoCapitalize="none"
                    style={userMenu.textInput}
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
            <Pressable style={userMenu.option} onPress={() => setIsVisible(true)}>
                <Text style={userMenu.optionText}>Cambiar contraseña</Text>
            </Pressable>
            <Dialog visible={isVisible} onCancel={() => closeDialog(setIsVisible, props.onClose)} onAccept={() => void changePassword()}>
                <Text>Contraseña actual:</Text>
                <PasswordInput
                    autoCapitalize="none"
                    containerStyle={userMenu.passwordInput}
                    iconColor="#4b5563"
                    inputStyle={userMenu.passwordTextInput}
                    value={currentPassword}
                    onChangeText={(value) => {
                        setCurrentPassword(value);
                        setValidationErrors((errors) => UiUtils.removeValidationError(errors, "currentPassword"));
                    }}
                />
                <ValidationMessages errors={validationErrors.currentPassword} />
                <Text>Nueva contraseña:</Text>
                <PasswordInput
                    autoCapitalize="none"
                    containerStyle={userMenu.passwordInput}
                    iconColor="#4b5563"
                    inputStyle={userMenu.passwordTextInput}
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
    const palette = useColorScheme() === "dark" ? userMenuPalette.dark : userMenuPalette.light;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View style={userMenu.header}>
            <Text numberOfLines={1} style={[userMenu.username, { color: palette.headerText }]}>
                {user?.username}
            </Text>
            <Pressable hitSlop={8} onPress={() => setIsOpen(true)}>
                <Ionicons color={palette.headerIcon} name="open-outline" size={20} />
            </Pressable>
            <Modal animationType="fade" transparent visible={isOpen} onRequestClose={() => setIsOpen(false)}>
                <Pressable style={userMenu.backdrop} onPress={() => setIsOpen(false)}>
                    <View style={userMenu.menu}>
                        <ChangeUsernameMenu onClose={() => setIsOpen(false)} />
                        <ChangePasswordMenu onClose={() => setIsOpen(false)} />
                        <Pressable style={userMenu.option} onPress={() => void authUtils.logout()}>
                            <Text style={userMenu.logoutText}>Cerrar sesión</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
