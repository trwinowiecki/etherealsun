import { Client, Environment } from 'square';

const covertToJSON = (data) => {
  return JSON.parse(
    JSON.stringify(
      data.result,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )
  );
};

const getAllCatalog = async (client) => {
  const catalog = await client.catalogApi.searchCatalogObjects({
    includeRelatedObjects: true,
  });

  return covertToJSON(catalog);
};

const getOneCatalog = async (client, id) => {
  let response;
  try {
    response = await client.catalogApi.retrieveCatalogObject(id, true);
    response = {
      ...response,
      inventory: await client.inventoryApi.retrieveInventoryCount(
        covertToJSON(response).object.itemData.variations[0].id
      ),
    };
  } catch (error) {
    response = error;
  }

  return covertToJSON(response);
};

const getOneInventory = async (client, id) => {
  let response;
  try {
    response = await client.inventoryApi.retrieveInventoryCount(id);
  } catch (error) {
    response = error;
  }

  return covertToJSON(response);
};

const handler = async (req, res) => {
  const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN_PROD,
    environment: Environment.Production,
  });

  let data;

  switch (req.body.type) {
    case 'GET_ALL_CATALOG':
      data = await getAllCatalog(client);
      res.status(200).send(data);
      break;
    case 'GET_ONE_CATALOG':
      data = await getOneCatalog(client, req.body.id);
      res.status(200).send(data);
      break;
    case 'GET_ONE_INVENTORY':
      data = await getOneInventory(client, req.body.id);
      res.status(200).send(data);
      break;
    default:
      res.status(404).send('Request not found');
  }
};

export default handler;
