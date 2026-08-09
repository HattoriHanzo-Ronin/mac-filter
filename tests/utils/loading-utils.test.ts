import LoadingUtils from "../../src/utils/loading-utils";

describe("LoadingUtils", () => {
    const setIsLoading = jest.fn();
    const loadingUtils = new LoadingUtils(setIsLoading);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns the operation result and updates the loading state", async () => {
        await expect(loadingUtils.run(async () => "result")).resolves.toBe("result");
        expect(setIsLoading.mock.calls).toEqual([[true], [false]]);
    });

    it("clears the loading state when the operation fails", async () => {
        const error = new Error("Operation failed");
        await expect(loadingUtils.run(async () => Promise.reject(error))).rejects.toBe(error);
        expect(setIsLoading.mock.calls).toEqual([[true], [false]]);
    });

    it("keeps loading active until all concurrent operations finish", async () => {
        let finishFirst: () => void;
        let finishSecond: () => void;
        const firstOperation = loadingUtils.run(
            () => new Promise<void>((resolve) => {
                finishFirst = resolve;
            })
        );
        const secondOperation = loadingUtils.run(
            () => new Promise<void>((resolve) => {
                finishSecond = resolve;
            })
        );
        expect(setIsLoading.mock.calls).toEqual([[true]]);
        finishFirst!();
        await firstOperation;
        expect(setIsLoading.mock.calls).toEqual([[true]]);
        finishSecond!();
        await secondOperation;
        expect(setIsLoading.mock.calls).toEqual([[true], [false]]);
    });
});
