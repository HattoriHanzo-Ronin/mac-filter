import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import SecureStoreUtils from "../../src/utils/storage/secure-store-utils";

jest.mock("expo-secure-store");

const PAYLOAD = { refreshToken: "refresh-token" };

describe("SecureStoreUtils", () => {
    const secureStoreUtils = new SecureStoreUtils();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("serializes and stores a value", async () => {
        await secureStoreUtils.set("refreshToken", PAYLOAD);
        expect(setItemAsync).toHaveBeenCalledWith("refreshToken", JSON.stringify(PAYLOAD));
    });

    it("returns a stored value", async () => {
        jest.mocked(getItemAsync).mockResolvedValue(JSON.stringify(PAYLOAD));
        expect(await secureStoreUtils.get<typeof PAYLOAD>("refreshToken")).toEqual(PAYLOAD);
    });

    it("returns null when the value does not exist", async () => {
        jest.mocked(getItemAsync).mockResolvedValue(null);
        expect(await secureStoreUtils.get("refreshToken")).toBeNull();
    });

    it("deletes a stored value", async () => {
        await secureStoreUtils.delete("refreshToken");
        expect(deleteItemAsync).toHaveBeenCalledWith("refreshToken");
    });
});
