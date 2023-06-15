import { getNoOfSkuPurchased, getStartingStockNumber, checkStockLevels } from "./app";

describe("getStartingStockNumber", () => {
  it("should return a stock number given an SKU", async () => {
    const result = await getStartingStockNumber("123");
    expect(result).toEqual(10);
  });

  it("should return 0 if no SKU is found", async () => {
    const result = await getStartingStockNumber("123456");
    expect(result).toEqual(0);
  });
});

describe("getNoOfSkuPurchased", () => {
  it("should return a number of how many items of the SKU have been purchased", async () => {
    const result = await getNoOfSkuPurchased("123");
    expect(result).toEqual(5);
  });

  it("should return 0 if SKU has no transactions", async () => {
   const result = await getNoOfSkuPurchased("1234567");
   expect(result).toEqual(0);
  });
});

describe("checkStockLevels", () => {
  it("should return an object with the SKU and the stock level", async () => {
    const result = await checkStockLevels("123");
    expect(result).toEqual({ sku: "123", qty: 5 });
  });

  it("should error if sku transactions is greater than the stock", async () => {
    try {
      await checkStockLevels("123456");
    } catch (error: any) {
        console.log(error);
      expect(error.message).toEqual("Oh no! We've oversold!");
    }
  });

    it("should error if sku is not found", async () => {
    try {
      await checkStockLevels("1234567");
    } catch (error: any) {
      expect(error.message).toEqual("SKU 1234567 not found");
    }});
});
