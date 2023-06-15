
import fs from "fs/promises";
import path from "path";

export const getStartingStockNumber = async function (
  sku: string
): Promise<number> {
  try {
    const stockFile = await fs.readFile(
      path.join(__dirname, "stock.json"),
      "utf-8"
    );
    const stock = JSON.parse(stockFile);

    const startingStockNo = stock.find(
      (item: { sku: string }) => item.sku === sku
    )?.qty;

    if (!startingStockNo) return 0;

    return startingStockNo;
  } catch (error) {
    throw new Error();
  }
};

export const getNoOfSkuPurchased = async function (
    sku: string
  ): Promise<number> {
    try {
      const transactionsFile = await fs.readFile(
        path.join(__dirname, "transactions.json"),
        "utf-8"
      );
      const transactions = JSON.parse(transactionsFile);
  
      const transactionsForSku = transactions.filter(
        (item: { SKU_purchased: Array<{ sku: string; qty: number }> }) =>
          item.SKU_purchased.some((skuObj) => skuObj.sku === sku)
      );
  
      const noOfSkuPurchased = transactionsForSku.reduce(
        (
          acc: number,
          item: { SKU_purchased: Array<{ sku: string; qty: number }> }
        ) => {
          const skuObj = item.SKU_purchased.find((skuObj) => skuObj.sku === sku);
          const no = skuObj?.qty;
          return acc + skuObj!.qty;
        },
        0
      );
  
      return noOfSkuPurchased;
    } catch (error) {
      throw new Error();
    }
  };

export const checkStockLevels = async function (
  sku: string
): Promise<{ sku: string; qty: number }> {
  try {
    const startingStock = await getStartingStockNumber(sku);
    const noOfStockPurchased = await getNoOfSkuPurchased(sku);

    if (startingStock === 0 && noOfStockPurchased === 0) {
      throw new Error(`SKU ${sku} not found`);
    }

    const currentStock = startingStock - noOfStockPurchased;

    if (currentStock < 0) throw new Error("Oh no! We've oversold!");

    return { sku: sku, qty: currentStock };
  } catch (error: any) {
    throw Error(error.message || `Error checking stock levels for SKU: ${sku}`);
  }
};


