/**
 * UI utilities
 *
 * @author HattoriHanzo-Ronin
 */
export default class UiUtils {
    static makeName(name: string, type: string) {
        return `${name} ${type !== "" ? `( ${type} )` : ""}`;
    }

    static firstToUpper(value: string) {
        return value.replace(value.charAt(0), value.charAt(0).toUpperCase());
    }
}
