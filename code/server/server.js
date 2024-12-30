const express = require('express');
const { check, param, body, validationResult } = require('express-validator');
const { login, db } = require('./app_logic_tier/login');
const { User } = require('./data_tier/User');
const dayjs = require('dayjs')

const { getAllSKU, getSKU, addNewSKU, modifySKU, modifySKUPosition, deleteSKU,
  getAllSKUitem, getSKUitem, getSKUitemBySKU, addNewSKUitem, modifySKUitem, deleteSKUitem } = require('./app_logic_tier/ManageSKUs');
const { getAllPosition, getPosition, modifyPosition, modifyPositionID, addNewPosition, deletePosition } = require('./app_logic_tier/ManagePosition');
const { getAllUsers, getAllSuppliers, getUser, modifyUser, addNewUser, deleteUser } = require('./app_logic_tier/ManageUsers')
const { getAllItem, getItem, modifyItem, addNewItem, deleteItem } = require('./app_logic_tier/ManageItems');

const { getAllRestockOrders,
  getIssuedRestockOrders,
  getRestockOrdersById,
  getItemsFromRestockOrderById,
  createRestockOrder,
  updateStatus,
  setRestockOrderSKUItems,
  setTrasportNoteRestockOrder,
  deleteRestockOrder,
  getAllInternalOrders,
  getIssuedInternalOrder,
  getAcceptedInternalOrder,
  getInternalOrderById,
  createInternalOrder,
  updateInternalOrder,
  deleteInternalOrder,
  getAllReturnOrder,
  getReturnOrderById,
  createReturnOrder,
  deleteReturnOrder } = require('./app_logic_tier/ManageOrder');

const { SKU } = require('./data_tier/SKU');
const { RestockOrder } = require('./data_tier/RestockOrder');
const { SKUitem } = require('./data_tier/SKUitem');
const { restockOrderElaborate, internalOrderElaborate, returnOrderElaborate } = require('./app_logic_tier/service');
const { InternalOrder } = require('./data_tier/InternalOrder');
const { ReturnOrder } = require('./data_tier/ReturnOrder');
const { TestDescriptor } = require('./data_tier/TestDescriptor');
const { TestResult } = require('./data_tier/TestResult');
const { getAllTestDescriptors, getTestDescriptorById, addNewTestDescriptor, modifyTestDescriptor, deleteTestDescriptor,
  getAllTestResults, getTestResultById, addNewTestResult, modifyTestResult, deleteTestResult } = require('./app_logic_tier/ManageTests');
const { createDatabase, deleteDatabase } = require('./database/createDatabase');
const { getIdSku } = require('./acceptanceTest/utils-id');
const { delivery } = require('./acceptanceTest/utils-users');

// init express
const app = new express();
const port = 3001;

app.use(express.json());

//GET /api/test
app.get('/api/hello', (req, res) => {
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});

app.post('/api/managerSessions',

  [check('username').isEmail()],

  async (req, res) => {

    try {


      const errors = validationResult(req.body.username);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }


      let credentials = {
        username: req.body.username,
        password: req.body.password
      }

      let user = await login(credentials);

      let response = new User(user[0].id, user[0].email, undefined, user[0].name, user[0].surname, user[0].type);

      return res.json(response);
    } catch (error) {
      return res.status(501).end();
    }
  })


//GET SKU
app.get('/api/skus', async (req, res) => {

  try {
    /*     if (!getSessionStatus().active && getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        }
     */
    let skuarray = await getAllSKU();

    return res.status(200).json(skuarray);
  } catch (error) {
    return res.status(501);
  }
});

app.get('/api/skus/:id', [param('id').notEmpty().isDecimal()], async (req, res) => {

  try {

    /*     if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }


    let sku = await getSKU(req.params.id);

    if (sku === undefined) {
      return res.status(404).json({ error: 'NotFound' });
    }

    return res.status(200).json(sku);
  } catch (error) {
    return res.status(501).end();
  }
});

//POST SKU
app.post('/api/sku',
  [body('description').notEmpty(),
  body('weight').notEmpty().isInt({ min: 0 }),
  body('volume').notEmpty().isInt({ min: 0 }),
  body('notes').notEmpty(),
  body('price').notEmpty().isInt({ min: 0 }),
  body('availableQuantity').notEmpty().isInt({ min: 0 })],
  async (req, res) => {
    try {
      /*   if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        } */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }

      await addNewSKU(req.body);

      return res.status(201).send();
    } catch (error) {
      return res.status(501).send();
    }
  });

//PUT SKU
app.put('/api/sku/:id', [param('id').isDecimal(),
body('newDescription').notEmpty(), body('newWeight').notEmpty(), body('newVolume').notEmpty(),
body('newNotes').notEmpty(), body('newPrice').notEmpty(), body('newAvailableQuantity').notEmpty()],
  async (req, res) => {

    try {
      /*       if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
              return res.status(401).json({ error: 'Unauthorizer' });
            } */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }

      let sku = await getSKU(req.params.id);

      if (sku === undefined) {
        return res.status(404).json({ error: 'Not Found' });
      }

      let r = await modifySKU(req.params.id, req.body);

      if (r === -1) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }
      return res.status(200).end();
    } catch (error) {
      return res.status(501).end();
    }
  });


app.put('/api/sku/:id/position', [param('id').isDecimal(),
body('position').notEmpty().isLength({ min: 12, max: 12 })], async (req, res) => {
  try {
    /*     if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }

    let sku = await getSKU(req.params.id);

    if (sku === undefined) {
      return res.status(404).json({ error: 'NotFound' });
    }

    let r = await modifySKUPosition(req.params.id, req.body.position);

    if (r === -1) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }
    return res.status(200).end();
  } catch (error) {
    return res.status(503).end();
  }
})


//////////    RESTOCK ORDER API

//GET RESTOCK ORDER

app.get('/api/restockOrders', async (req, res) => {

  try {

    let orderVec = await getAllRestockOrders();

    let response = restockOrderElaborate(orderVec);

    return res.json(response);

  } catch (e) {
    res.status(500).send();
  }
})


app.get('/api/restockOrdersIssued', async (req, res) => {

  try {
    let orderVec = await getIssuedRestockOrders();

    let response = restockOrderElaborate(orderVec);

    return res.json(response);

  } catch (error) {

    res.status(500).send();
  }
})


app.get('/api/restockOrders/:id',
  [param('id').isDecimal()],
  async (req, res) => {

    try {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).send();
      }

      let orderVec = await getRestockOrdersById(req.params.id);

      if (orderVec.length === 0) {
        res.status(404).send('Not Found');
        return;
      }

      let response = restockOrderElaborate(orderVec);

      return res.json(response);

    } catch (e) {

      return res.status(500).send(e);

    }

  })


app.get('/api/restockOrders/:id/returnItems',
  [param('id').notEmpty().isDecimal()],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422);
    }

    try {

      let dbResponse = await getItemsFromRestockOrderById(req.params.id);

      if (dbResponse.length === 0) {
        return res.status(404).send();
      }

      if (dbResponse[0].state === 'COMPLETEDRETURN') {
        res.status(422).send('Unprocessable entity');
      }
      if (dbResponse.length === 0) {
        res.status(404).send('Not Found');
      } else {
        res.json(dbResponse);
      }

    } catch (error) {

      return res.status(500).send();
    }
  })


//POST RESTOCK ORDER

app.post('/api/restockOrder',
  [body('issueDate').notEmpty(),
  body('products').notEmpty(),
  body('supplierId').notEmpty()],
  async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).end();
    }

    try {

      const ro = new RestockOrder(undefined, undefined, req.body.products, req.body.supplierId, req.body.issueDate, undefined, undefined);
      await createRestockOrder(ro);

      return res.status(201).end();

    } catch (error) {

      return res.status(503).end();

    }

  })

//PUT RESTOCK ORDER

app.put('/api/restockOrder/:id',
  [param('id').isDecimal(),
  body('newState').isAlpha()],
  async (req, res) => {


    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).end();
    }

    try {

      let order = await getRestockOrdersById(req.params.id);

      if (order.length === 0) {
        return res.status(404).send();
      }

      let response = await updateStatus(req.params.id, req.body.newState);

      if (response === 'ok') {
        return res.status(200).send();
      }


    } catch (error) {

      return res.status(503).send(error);
    }

  })

app.put('/api/restockOrder/:id/skuitems',
  [param('id').notEmpty().isDecimal(),
  body('skuItems').notEmpty().isArray()],
  async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty() || req.body === null) {
      return res.status(422).end();
    }
    try {

      let newSkuItems = req.body.skuItems;

      let order = await getRestockOrdersById(req.params.id);

      if (order.length === 0) {
        return res.status(404).end();
      }

      if (order[0].state !== 'DELIVERED') {
        return res.status(422).end();
      }

      await setRestockOrderSKUItems(req.params.id, newSkuItems);

      return res.status(200).end();

    } catch (error) {
      return res.status(503).end();
    }
  })

app.put('/api/restockOrder/:id/transportNote',
  [param('id').isDecimal(),
  body('transportNote').notEmpty()],
  async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).send();
    }

    try {

      let order = await getRestockOrdersById(req.params.id);

      if (order.length === 0) {
        return res.status(404).send();
      }

      if (order[0].state !== 'DELIVERY') {
        return res.status(422).send();
      }

      const isBefore = dayjs(req.body.transportNote.deliveryDate).isBefore(order[0].issueDate);

      if (isBefore) {
        return res.status(422).send();
      }

      let trasportNote = JSON.stringify(req.body.transportNote);

      let response = await setTrasportNoteRestockOrder(req.params.id, trasportNote);

      if (response === 'ok') {
        return res.status(200).send();
      }

    } catch (error) {

      return res.status(503).send();
    }

  })

app.delete('/api/restockOrder/:id',
  [param('id').isDecimal()],
  async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).send();
    }

    try {

      let order = await getRestockOrdersById(req.params.id);

      if (order.length === 0) {
        return res.status(404).send();
      }

      let response = await deleteRestockOrder(req.params.id);

      if (response === 'ok') {
        return res.status(204).end();
      }

    } catch (error) {

      return res.status(503).send();

    }
  }
)

//////////    INTERNAL ORDER API

// GET INTERNAL ORDER

app.get('/api/internalOrders',
  async (req, res) => {

    try {

      let orderVec = await getAllInternalOrders();

      let response = internalOrderElaborate(orderVec);

      res.json(response);

    } catch (e) {

      res.status(500).send();

    }
  })

app.get('/api/internalOrdersIssued',
  async (req, res) => {

    try {

      let orderVec = await getIssuedInternalOrder();

      let response = internalOrderElaborate(orderVec);

      res.json(response);

    } catch (error) {

      res.status(500).send();
    }
  })

app.get('/api/internalOrdersAccepted',
  async (req, res) => {

    try {

      let orderVec = await getAcceptedInternalOrder();

      let response = internalOrderElaborate(orderVec);

      res.json(response);

    } catch (error) {

      res.status(500).send();

    }
  })


app.get('/api/internalOrders/:id',
  [param('id').isDecimal()],
  async (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send();
    }

    try {

      let orderVec = await getInternalOrderById(req.params.id);

      if (orderVec.notEmpty()) {
        return res.status(404);
      }

      let response = internalOrderElaborate(orderVec);

      return res.json(response);

    } catch (error) {

      return res.status(500).end();

    }
  })

// POST INTERNAL ORDER

app.post('/api/internalOrders',
  [body('issueDate').notEmpty(),
  body('products').notEmpty(),
  body('customerId').notEmpty().isDecimal()],
  async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).end();
    }

    try {

      let io = new InternalOrder('ISSUED', undefined, req.body.products, req.body.issueDate, undefined, req.body.customerId);

      await createInternalOrder(io);

      return res.status(201).send();


    } catch (error) {
      return res.status(503).send();
    }

  }
)


// PUT INTERNAL ORDER

app.put('/api/internalOrders/:id',
  [param('id').isDecimal()],
  async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).end();
    }

    try {

      let order = await getInternalOrderById(req.params.id);

      if (order.length === 0) {
        return res.status(404).send();
      }

      let skuItems = [];

      if (req.body.newState === 'COMPLETED') {
        skuItems = req.body.products;
      }

      let response = await updateInternalOrder(req.params.id, req.body.newState, skuItems);

      if (response === 'ok') {
        return res.status(200).send();
      }


    } catch (error) {

      return res.status(500).send();

    }

  }
)

app.delete('/api/internalOrders/:id',
  [param('id').isDecimal()],
  async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).end();
    }


    try {

      let order = await getInternalOrderById(req.params.id);

      if (order.length === 0) {
        return res.status(404).send();
      }

      let response = await deleteInternalOrder(req.params.id);

      if (response == 'ok') {
        return res.status(201).send();
      }

    } catch (error) {
      res.status(500).send();
    }
  })



///////// RETURN ORDER API

// GET RETURN ORDER
app.get('/api/returnOrders',
  async (req, res) => {
    try {

      let orderVec = await getAllReturnOrder();

      let response = returnOrderElaborate(orderVec);

      return res.json(response).send();

    } catch (error) {

      return res.status(500).send();

    }

  })


app.get('/api/returnOrders/:id',
  [param('id').notEmpty().isDecimal()],
  async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).end();
    }
    try {

      let orderVec = await getReturnOrderById(req.params.id);

      if (orderVec.length === 0) {
        return res.status(404).send();
      }

      let response = returnOrderElaborate(orderVec);

      return res.status(200).json(response[0]).send();

    } catch (error) {

      return res.status(500).send(error);

    }

  })


app.post('/api/returnOrder',
  [body('returnDate').notEmpty(),
  body('products').notEmpty(),
  body('restockOrderId').notEmpty()],
  async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).end();
    }

    try {

      let reo = new ReturnOrder(req.body.restockOrderId, undefined, req.body.returnDate, req.body.products);

      let order = await getRestockOrdersById(req.body.restockOrderId);

      if (order.length === 0) {
        return res.status(404).send();
      }

      await createReturnOrder(reo);

      return res.status(201).send();

    } catch (error) {
      return res.status(500).send();
    }


  })


app.delete('/api/returnOrder/:id',
  [param('id')],
  async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).end();
    }

    try {

      let orderVec = await getReturnOrderById(req.params.id);

      if (orderVec.notEmpty()) {
        return res.status(404).send();
      }

      await deleteReturnOrder(req.params.id);

      return res.status(204).send();


    } catch (error) {

      return res.status(500).send();

    }

  });


//DELETE SKU

app.delete('/api/skus/:id', [param('id').isDecimal() ], async (req, res) => {

  /*   if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
      return res.status(401).json({ error: 'Unauthorizer' });
    } */
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }

    await deleteSKU(req.params.id);


    return res.status(204).end();
  } catch (error) {
    return res.status(503).end();
  }
});

//GET SKUitem
app.get('/api/skuitems', async (req, res) => {

  try {
    /*     if (!getSessionStatus().active && getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        }
     */
    let skuarray = await getAllSKUitem();
    return res.status(200).json(skuarray);
  } catch (error) {
    return res.status(501);
  }
});

app.get('/api/skuitems/sku/:id', [param('id').isDecimal()], async (req, res) => {

  try {

    /*     if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }


    let skuitems = await getSKUitemBySKU(req.params.id);

    if (skuitems.length === 0) {
      return res.status(404).json({ error: 'NotFound' });
    }

    return res.status(200).json(skuitems);
  } catch (error) {
    return res.status(501).end();
  }
});

app.get('/api/skuitems/:rfid', [param('rfid').isDecimal().isLength({ min: 32, max: 32 })], async (req, res) => {

  try {

    /*     if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }


    let skuItem = await getSKUitem(req.params.rfid);

    if (skuItem === undefined) {
      return res.status(404).json({ error: 'NotFound' });
    }

    return res.status(200).json(skuItem);
  } catch (error) {
    return res.status(501).end();
  }
});

//POST SKUitem
app.post('/api/skuitem',
  [body('RFID').isDecimal().isLength({ min: 32, max: 32 }).notEmpty(), body('SKUId').notEmpty(), body('DateOfStock').notEmpty()],
  async (req, res) => {
    try {
      /*   if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        } */
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }

      const skuId = req.body.SKUId;

      let sku = await getSKU(skuId);

      if (!sku) {
        return res.status(404).end();
      }


      await addNewSKUitem(req.body);

      return res.status(201).end();
    } catch (error) {
      return res.status(501).end();
    }
  });

//PUT SKUitem
app.put('/api/skuitems/:rfid', [param('rfid').isAlphanumeric(), param('rfid').isLength({ min: 32, max: 32 }),
body('newAvailable').notEmpty(), body('newDateOfStock').notEmpty()],
  async (req, res) => {

    try {
      /*       if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
              return res.status(401).json({ error: 'Unauthorizer' });
            } */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }

      let sku = await getSKUitem(req.params.rfid);

      if (sku === undefined) {
        return res.status(404).json({ error: 'Not Found' });
      }

      await modifySKUitem(req.params.rfid, req.body);


      return res.status(200).end();
    } catch (error) {
      return res.status(501).end();
    }
  });

//DELETE SKUitem
app.delete('/api/skuitems/:rfid', [param('rfid').isDecimal(), param('rfid').isLength({ min: 32, max: 32 })], async (req, res) => {
  try {
    /*   if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
        return res.status(401).json({ error: 'Unauthorizer' });
      } */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }


    await deleteSKUitem(req.params.rfid);


    return res.status(204).end();
  } catch (error) {
    return res.status(503).end();
  }

});

//GET items
app.get('/api/items', async (req, res) => {

  try {
    /*     if (!getSessionStatus().active && getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        }
     */
    let itemArray = await getAllItem();

    return res.status(200).json(itemArray);
  } catch (error) {
    return res.status(501).end();
  }
});

app.get('/api/items/:id/:supplierId', [check('id').notEmpty(), check('supplierId').notEmpty()], async (req, res) => {

  try {

    /*     if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        } */

    const errors = validationResult(req);
    if (!errors.isEmpty() || req.params.id === "null") {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }

    let item = await getItem(req.params.id, req.paramssupplierId);

    if (item === undefined) {
      return res.status(404).json({ error: 'NotFound' });
    }

    return res.status(200).json(item);
  } catch (error) {
    return res.status(501).end();
  }
});

//POST item
app.post('/api/item',
  [body('id').notEmpty(), body('description').notEmpty(), body('price').notEmpty(),
  body('SKUId').notEmpty(), body('supplierId').notEmpty()],
  async (req, res) => {
    try {
      /*   if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        } */

      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }

      const testSKU = await getSKU(req.body.SKUId);
      if (testSKU === undefined) {
        return res.status(404).json({ error: 'Not Found' });
      };

      await addNewItem(req.body);

      return res.status(201).end();
    } catch (error) {
      return res.status(501).end();
    }
  });

//PUT item
app.put('/api/item/:id/:supplierId', [check('id').notEmpty(), check('supplierId').notEmpty(), check('id').isAlphanumeric(),
body('newDescription').notEmpty(), body('newPrice').notEmpty()],
  async (req, res) => {

    try {
      /*       if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
              return res.status(401).json({ error: 'Unauthorizer' });
            } */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }

      let item = await getItem(req.params.id, req.params.supplierId);

      if (item === undefined) {
        return res.status(404).json({ error: 'Not Found' });
      }

      await modifyItem(req.params.id, req.body, req.params.supplierId);


      return res.status(200).end();
    } catch (error) {
      return res.status(501).end();
    }
  });

//DELETE item
app.delete('/api/items/:id/:supplierId', [check('id').notEmpty(), check('supplierId').notEmpty()], async (req, res) => {
  try {
    /*   if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
        return res.status(401).json({ error: 'Unauthorizer' });
      } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }


    await deleteItem(req.params.id, req.params.supplierId);


    return res.status(204).end();
  } catch (error) {
    return res.status(503).end();
  }
});

//GET position
app.get('/api/positions', async (req, res) => {

  try {
    /*     if (!getSessionStatus().active && getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        }
     */
    let posarray = await getAllPosition();

    return res.status(200).json(posarray);
  } catch (error) {
    return res.status(501).send();
  }
});

//POST position
app.post('/api/position',
  [body('positionID').notEmpty().isInt({ min: 0 }), body('aisleID').notEmpty().isInt({ min: 0 }), body('row').notEmpty().isInt({ min: 0 }),
  body('col').notEmpty().isInt({ min: 0 }), body('maxWeight').notEmpty().isInt({ min: 0 }), body('maxVolume').notEmpty().isInt({ min: 0 })],
  async (req, res) => {
    try {
      /*   if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        } */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }

      await addNewPosition(req.body);

      return res.status(201).send();
    } catch (error) {
      return res.status(501).send();
    }
  });

app.put('/api/position/:positionID',
  [param('positionID').notEmpty().isInt({ min: 0 }), body('newAisleID').notEmpty().isInt({ min: 0 }), body('newRow').notEmpty().isInt({ min: 0 }),
  body('newCol').notEmpty().isInt({ min: 0 }), body('newMaxWeight').notEmpty().isInt({ min: 0 }), body('newMaxVolume').notEmpty().isInt({ min: 0 })],
  async (req, res) => {

    try {
      /*       if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
              return res.status(401).json({ error: 'Unauthorizer' });
            } */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }

      let pos = await getPosition(req.params.positionID);

      if (pos.length === 0) {
        return res.status(404).json({ error: 'Not Found' });
      }

      await modifyPosition(req.params.positionID, req.body);


      return res.status(200).send();
    } catch (error) {
      return res.status(501).send();
    }
  });

app.put('/api/position/:positionID/changeID',
  [param('positionID').notEmpty().isInt({ min: 0 }), body('newPositionID').notEmpty().isInt({ min: 0 })],
  async (req, res) => {

    try {
      /*       if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
              return res.status(401).json({ error: 'Unauthorizer' });
            } */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }

      let pos = await getPosition(req.params.positionID);

      if (pos.length === 0) {
        return res.status(404).json({ error: 'Not Found' });
      }

      await modifyPositionID(req.params.positionID, req.body);


      return res.status(200).send();
    } catch (error) {
      return res.status(501).send();
    }
  });

//DELETE position
app.delete('/api/position/:positionID', [param('positionID').notEmpty().isInt({ min: 0 })], async (req, res) => {
  try {
    /*   if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
        return res.status(401).json({ error: 'Unauthorizer' });
      } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }


    await deletePosition(req.params.positionID);


    return res.status(204).send();
  } catch (error) {
    return res.status(503).send();
  }
});


// api/userinfo cannot be implemented right now

//GET suppliers
app.get('/api/suppliers', async (req, res) => {

  try {
    /*     if (!getSessionStatus().active && getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        }
     */
    let supplierArray = await getAllSuppliers();

    return res.status(200).json(supplierArray);
  } catch (error) {
    return res.status(501);
  }
});

//GET users
app.get('/api/users', async (req, res) => {

  try {
    /*     if (!getSessionStatus().active && getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        }
     */
    let userArray = await getAllUsers();

    return res.status(200).json(userArray);
  } catch (error) {
    return res.status(501);
  }
});

//POST User
app.post('/api/newUser',
  [body('username').notEmpty().isEmail(), body('name').notEmpty(), body('surname').notEmpty(),
  body('password').notEmpty(), body('type').notEmpty().isIn(['customer', 'qualityEmployee', 'clerk', 'deliveryEmployee', 'supplier'])],
  async (req, res) => {
    try {
      /*   if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
          return res.status(401).json({ error: 'Unauthorizer' });
        } */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }
      const testUser = await getUser(req.body.username, req.body.type);
      if (testUser !== undefined) {
        return res.status(404).json({ error: 'Conflict' });
      };
      await addNewUser(req.body);

      return res.status(201).end();
    } catch (error) {
      return res.status(501).end();
    }
  });

app.put('/api/users/:username',
  [param('username').notEmpty().isEmail(), body('oldType').notEmpty(), body('newType').notEmpty().isIn(['customer', 'qualityEmployee', 'clerk', 'deliveryEmployee', 'supplier'])],
  async (req, res) => {

    try {
      /*       if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
              return res.status(401).json({ error: 'Unauthorizer' });
            } */

      const errors = validationResult(req);
      if (!errors.isEmpty() || body.oldType === null || body.newType === null) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }
      const testUser = await getUser(req.params.username, req.body.oldType);
      if (testUser === undefined) {
        return res.status(404).json({ error: 'Not Found' });
      };

      await modifyUser(req.params.username, req.body);


      return res.status(200).end();
    } catch (error) {
      return res.status(501).end();
    }
  });


//DELETE user
app.delete('/api/users/:username/:type', [param('username').notEmpty().isEmail(), param('type').notEmpty().isIn(['customer', 'qualityEmployee', 'clerk', 'deliveryEmployee', 'supplier'])], async (req, res) => {
  try {
    /*   if (!getSessionStatus().active || getSessionStatus().type !== 'Manager') {
        return res.status(401).json({ error: 'Unauthorizer' });
      } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }


    await deleteUser(req.params.username, req.params.type);


    return res.status(204).end();
  } catch (error) {
    return res.status(503).end();
  }
});


//GET testDescriptors
app.get('/api/testDescriptors', async (req, res) => {

  try {

    let TestDescriptorsArray = await getAllTestDescriptors();

    return res.status(200).json(TestDescriptorsArray);
  } catch (error) {
    return res.status(500).end();
  }
});

app.get('/api/testDescriptors/:id', [param('id').notEmpty().isInt()], async (req, res) => {

  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }

    let TestDescriptor = await getTestDescriptorById(req.params.id);

    if (TestDescriptor === undefined) {
      return res.status(404).json({ error: 'NotFound' });
    }

    return res.status(200).json(TestDescriptor);
  } catch (error) {
    return res.status(501).end();
  }
});

//POST testDescriptors
app.post('/api/testDescriptor',
  [body('name').notEmpty().isAlphanumeric(),
  body('procedureDescription').notEmpty(),
  body('idSKU').notEmpty().isDecimal()],
  async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).send();
    }

    try {

      let sku = await getSKU(req.body.idSKU);

      if (!sku) {
        return res.status(404).end();
      }

      const newTestDescriptor = new TestDescriptor(undefined, req.body.name, req.body.procedureDescription, req.body.idSKU);
      await addNewTestDescriptor(newTestDescriptor);

      return res.status(201).send();

    } catch (error) {

      return res.status(503).send();

    }

  });

//PUT testDescriptors
app.put('/api/testDescriptor/:id',
  [param('id').isDecimal(), param('id').notEmpty(),
  body('newName').notEmpty(), body('newProcedureDescription').notEmpty(), body('newIdSKU').notEmpty()],
  async (req, res) => {


    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).send();
    }

    try {

      let testDescriptorById = await getTestDescriptorById(req.params.id);

      if (!testDescriptorById) {

        return res.status(404).send();
      }

      const sku = await getSKU(req.body.newIdSKU);

      if (!sku) {
        return res.status(404).send();
      }

      let response = await modifyTestDescriptor(req.params.id, req.body);

      if (!response) {
        return res.status(200).send();
      }


    } catch (error) {

      return res.status(503).send(error);
    }

  })

//DELETE testDescriptors
app.delete('/api/testDescriptor/:id', [param('id').notEmpty().isDecimal()], async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }


    await deleteTestDescriptor(req.params.id);


    return res.status(204).end();
  } catch (error) {
    return res.status(503).end();
  }
});

//GET testResult
app.get('/api/skuitems/:rfid/testResults', [param('rfid').notEmpty().isDecimal().isLength({ min: 32, max: 32 })], async (req, res) => {

  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return res.status(422).json({ error: 'Unprocessable Entity' });
    }

    let TestResultsArray = await getAllTestResults(req.params.rfid);

    if (TestResultsArray.length === 0) {
      return res.status(404).json({ error: 'NotFound' });
    }

    return res.status(200).json(TestResultsArray);
  } catch (error) {
    return res.status(500).end();
  }
});

app.get('/api/skuitems/:rfid/testResults/:id', [check('id').notEmpty()], async (req, res) => {

  try {

    const errors = validationResult(req.params.id, req.params.rfid);

    if (!errors.isEmpty()) {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }

    let TestResult = await getTestResultById(req.params.id, req.params.rfid);

    if (TestResult === undefined) {
      return res.status(404).json({ error: 'NotFound' });
    }

    return res.status(200).json(TestResult);
  } catch (error) {
    return res.status(501).end();
  }
});

//POST testResults
app.post('/api/skuitems/testResult',
  [body('rfid').notEmpty().isDecimal().isLength({ min: 32, max: 32 }),
  body('idTestDescriptor').notEmpty().isDecimal(),
  body('Date').notEmpty().isDate(),
  body('Result').notEmpty().isBoolean()],
  async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).send();
    }

    try {

      const skuItem = await getSKUitem(req.body.rfid);

      if (!skuItem) {
        return res.status(404).send();
      }

      const newTestResult = new TestResult(undefined, req.body.idTestDescriptor, req.body.Date, req.body.Result, req.body.rfid);
      await addNewTestResult(newTestResult);

      return res.status(201).send();

    } catch (error) {

      res.status(503).send();

    }

  });

//PUT testResults
app.put('/api/skuitems/:rfid/testResult/:id',
  [param('rfid').isDecimal().isLength({ min: 32, max: 32 }),
  param('id').notEmpty(),
  body('newIdTestDescriptor'),
  body('newDate').notEmpty().isDate(),
  body('newResult').notEmpty().isBoolean()],
  async (req, res) => {


    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).send();
    }

    try {

      let testResultById = await getTestResultById(req.params.id, req.params.rfid);

      if (!testResultById) {

        return res.status(404).send();
      }

      let response = await modifyTestResult(req.params.id, req.params.rfid, req.body);

      if (response === undefined) {
        return res.status(200).send();
      }


    } catch (error) {

      return res.status(503).send(error);
    }

  })

//DELETE testResults
app.delete('/api/skuitems/:rfid/testResult/:id',
  [param('id').notEmpty(),
  param('rfid').notEmpty().isDecimal().isLength({ min: 32, max: 32 })
  ], async (req, res) => {
    try {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }

      await deleteTestResult(req.params.id);

      return res.status(204).end();
    } catch (error) {
      return res.status(503).end();
    }
  });









// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


async function handleDB(){
  //await deleteDatabase();
  await createDatabase();
}

handleDB();

module.exports = app;