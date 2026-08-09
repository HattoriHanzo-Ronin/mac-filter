export type DeviceLabelKey =
    | "name"
    | "type"
    | "connections"
    | "connection_type"
    | "mac"
    | "model"
    | "ip"
    | "wifi_pass"
    | "admin_pass"
    | "mac_filter";

export type DeviceScalarPropertyKey = Exclude<DeviceLabelKey, "connections" | "connection_type" | "mac" | "admin_pass">;

export type DeviceDisplayProperty =
    | {
          key: "connection_type" | "mac";
          label: string;
          val: string[];
      }
    | {
          key: DeviceScalarPropertyKey;
          label: string;
          val: string;
      };

export type MessageDuration = "LONG" | "SHORT";

export type ValidationErrors<T extends object> = Partial<Record<keyof T, string[]>>;
