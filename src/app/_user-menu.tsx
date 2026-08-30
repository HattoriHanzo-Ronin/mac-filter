import { Ionicons } from "@expo/vector-icons";
import { userMenu, userMenuDark, userMenuLight, userMenuPalette } from "@/src/styles/app/style";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Pressable, Text, TextInput, View, useColorScheme } from "react-native";
import { useAppContext } from "@/src/components/app-context-provider";
import PasswordInput from "@/src/components/password-input";
import ValidationMessages from "@/src/components/validation-messages";
import type { ValidationErrors } from "@/src/types/ui";
import type { DialogProps, UpdatePasswordRequest, UpdateUsernameRequest, UserMenuSectionProps } from "@/src/types/users";
import UiUtils from "@/src/utils/ui-utils";

export function Dialog(props: DialogProps) {
    const { children, visible, onCancel, onAccept } = props;
    const theme = useColorScheme() === "dark" ? userMenuDark : userMenuLight;

    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
            <View style={userMenu.dialogBackdrop}>
                <View style={[userMenu.dialog, theme.dialog]}>
                    {children}
                    <View style={userMenu.dialogActions}>
                        <Pressable style={[userMenu.dialogButton, theme.cancelButton]} onPress={onCancel}>
                            <Text style={[userMenu.cancelButtonText, theme.cancelButtonText]}>Cancelar</Text>
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

function ChangeUsernameMenu(props: UserMenuSectionProps) {
    const { user, setUser, executeApiRequest } = useAppContext();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [newUsername, setNewUsername] = useState<string>("");
    const [validationErrors, setValidationErrors] = useState<ValidationErrors<UpdateUsernameRequest>>({});
    const theme = useColorScheme() === "dark" ? userMenuDark : userMenuLight;

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
            <Pressable style={[userMenu.option, theme.option]} onPress={() => setIsVisible(true)}>
                <Text style={[userMenu.optionText, theme.optionText]}>Cambiar nombre de usuario</Text>
            </Pressable>
            <Dialog visible={isVisible} onCancel={() => closeDialog(setIsVisible, props.onClose)} onAccept={() => void changeUsername()}>
                <Text style={theme.dialogLabel}>Nuevo nombre de usuario:</Text>
                <TextInput
                    accessibilityLabel="Nuevo nombre de usuario"
                    autoCapitalize="none"
                    style={[userMenu.textInput, theme.textInput]}
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

function ChangePasswordMenu(props: UserMenuSectionProps) {
    const { authUtils, executeApiRequest } = useAppContext();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [validationErrors, setValidationErrors] = useState<ValidationErrors<UpdatePasswordRequest>>({});
    const isDark = useColorScheme() === "dark";
    const theme = isDark ? userMenuDark : userMenuLight;
    const palette = isDark ? userMenuPalette.dark : userMenuPalette.light;

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
            <Pressable style={[userMenu.option, theme.option]} onPress={() => setIsVisible(true)}>
                <Text style={[userMenu.optionText, theme.optionText]}>Cambiar contraseña</Text>
            </Pressable>
            <Dialog visible={isVisible} onCancel={() => closeDialog(setIsVisible, props.onClose)} onAccept={() => void changePassword()}>
                <Text style={theme.dialogLabel}>Contraseña actual:</Text>
                <PasswordInput
                    accessibilityLabel="Contraseña actual"
                    autoCapitalize="none"
                    containerStyle={[userMenu.passwordInput, theme.passwordInput]}
                    iconColor={palette.dialogIcon}
                    inputStyle={[userMenu.passwordTextInput, theme.passwordTextInput]}
                    value={currentPassword}
                    onChangeText={(value) => {
                        setCurrentPassword(value);
                        setValidationErrors((errors) => UiUtils.removeValidationError(errors, "currentPassword"));
                    }}
                />
                <ValidationMessages errors={validationErrors.currentPassword} />
                <Text style={theme.dialogLabel}>Nueva contraseña:</Text>
                <PasswordInput
                    accessibilityLabel="Nueva contraseña"
                    autoCapitalize="none"
                    containerStyle={[userMenu.passwordInput, theme.passwordInput]}
                    iconColor={palette.dialogIcon}
                    inputStyle={[userMenu.passwordTextInput, theme.passwordTextInput]}
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
    const isDark = useColorScheme() === "dark";
    const palette = isDark ? userMenuPalette.dark : userMenuPalette.light;
    const theme = isDark ? userMenuDark : userMenuLight;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <View style={userMenu.header}>
            <Text numberOfLines={1} style={[userMenu.username, { color: palette.headerText }]}>
                {user?.username}
            </Text>
            <Pressable accessibilityLabel="Abrir menú de usuario" hitSlop={8} onPress={() => setIsOpen(true)}>
                <Ionicons color={palette.headerIcon} name="open-outline" size={20} />
            </Pressable>
            <Modal animationType="fade" transparent visible={isOpen} onRequestClose={() => setIsOpen(false)}>
                <Pressable style={userMenu.backdrop} onPress={() => setIsOpen(false)}>
                    <View style={[userMenu.menu, theme.menu]}>
                        <ChangeUsernameMenu onClose={() => setIsOpen(false)} />
                        <ChangePasswordMenu onClose={() => setIsOpen(false)} />
                        <Pressable style={[userMenu.option, theme.option]} onPress={() => void authUtils.logout()}>
                            <Text style={[userMenu.logoutText, theme.logoutText]}>Cerrar sesión</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
