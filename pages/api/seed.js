import { Client, Environment } from 'square';
import crypto from 'crypto';

const handler = async (req, res) => {
  const clientProd = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN_PROD,
    environment: Environment.Production,
  });

  const clientSandbox = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN_SANDBOX,
    environment: Environment.Sandbox,
  });

  const catalog = await clientProd.catalogApi.searchCatalogObjects({
    includeRelatedObjects: true,
  });

  const catalogJSON = JSON.parse(
    JSON.stringify(
      catalog.result,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )
  );

  const catalogUpsert = catalogJSON.objects
    .filter((object) => object.type === 'ITEM')
    .map((object) => {
      if (object.type === 'ITEM') {
        return {
          type: object.type,
          id: `#${object.id}`,
          itemData: object.itemData
            ? {
                name: object.name,
                description: object.description,
                variations: object.itemData?.variations
                  ? object.itemData.variations.map((variation) => {
                      return {
                        id: `#${variation.id}`,
                        type: variation.type,
                        itemVariationData: {
                          itemId: `#${object.id}`,
                          name: variation.itemVariationData.name,
                          pricingType: variation.itemVariationData.pricingType,
                          priceMoney: variation.itemVariationData.priceMoney,
                        },
                      };
                    })
                  : [],
                productType: object.itemData.productType,
              }
            : '',
        };
      }
    });

  const uuid = crypto.randomUUID();
  const upsertCatalog =
    await clientSandbox.catalogApi.batchUpsertCatalogObjects({
      idempotencyKey: uuid,
      batches: [{ objects: [catalogUpsert] }],
    });

  console.log(upsertCatalog);

  res.status(201).send(upsertCatalog);
};

export default handler;
