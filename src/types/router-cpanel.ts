export type RouterCpanelNavigationAction = "back" | "reload";
export type RouterCpanelTheme = "dark" | "light";

export interface RouterCpanelSession {
    id: string;
    url: string;
    expiresAt: string;
}
