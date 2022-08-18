import { createContext, useReducer } from 'react';
import { Client, Environment } from 'square';

const handler = async (req, res) => {
  const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Production,
  });

  const catalog = await client.catalogApi.searchCatalogObjects({
    includeRelatedObjects: true,
  });

  const catalogJSON = JSON.parse(
    JSON.stringify(
      catalog.result,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )
  );

  res.status(201).send(catalogJSON);
};

export default handler;
