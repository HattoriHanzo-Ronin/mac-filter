export const VALIDATION_MESSAGES = {
    INVALID_FORMAT: "Formato incorrecto",
    REQUIRED: "Requerido",
    MAX_INTERFACE_LENGTH: "Longitud máxima, 4 caracteres"
};

export const VALIDATION_PATTERNS = {
    NAME_OR_TYPE: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/,
    MAC: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
    INTERFACE: /^[A-Za-z]+$/,
    IP: /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/
};

export const PLACEHOLDER_ITEM = {
    id: "placeholder",
    name: "Dispositivo",
    type: "",
    mac: "00:00:00:00:00:00",
    intrface: "LAN",
    ip: "0.0.0.0"
};
