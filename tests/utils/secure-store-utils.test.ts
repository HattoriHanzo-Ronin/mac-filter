import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import SecureStoreUtils from "../../src/utils/secure-store-utils";

jest.mock("expo-secure-store");

const PAYLOAD = { refreshToken: "refresh-token" };

describe("SecureStoreUtils", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("serializes and stores a value", async () => {
        await SecureStoreUtils.set("refreshToken", PAYLOAD);
        expect(setItemAsync).toHaveBeenCalledWith("refreshToken", JSON.stringify(PAYLOAD));
    });

    it("returns a stored value", async () => {
        jest.mocked(getItemAsync).mockResolvedValue(JSON.stringify(PAYLOAD));
        expect(await SecureStoreUtils.get<typeof PAYLOAD>("refreshToken")).toEqual(PAYLOAD);
    });

    it("returns null when the value does not exist", async () => {
        jest.mocked(getItemAsync).mockResolvedValue(null);
        expect(await SecureStoreUtils.get("refreshToken")).toBeNull();
    });

    it("deletes a stored value", async () => {
        await SecureStoreUtils.delete("refreshToken");
        expect(deleteItemAsync).toHaveBeenCalledWith("refreshToken");
    });
});
