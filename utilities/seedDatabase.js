const { User, Receipt, Order } = require('../database/models');

const users = require('../data/users');
const receipts = require('../data/receipts');
const orders = require('../data/orders');

const populateUsersTable = async (users) => {
  for (let i = 0; i < users.length; i++) {
    let currentUser = users[i];
    await User.create(currentUser);
  }
}

const populateReceiptsTable = async (receipts) => {
  for (let i = 0; i < receipts.length; i++) {
    let currentReceipt = receipts[i];
    await Receipt.create(currentReceipt);
  }
}

const populateOrdersTable = async (orders) => {
  for (let i = 0; i < orders.length; i++) {
    let currentOrder = orders[i];
    await Order.create(currentOrder);
  }
}

const seedDatabase = async () => {
  try {
    await populateUsersTable(users);
    await populateReceiptsTable(receipts);
    await populateOrdersTable(orders);
    console.log("Successfully seeded!");
    process.exit(0);
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }
}

seedDatabase();
