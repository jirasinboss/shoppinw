const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const password = bcrypt.hashSync('123456');
const userData = [
  {
    username: 'boss',
    password: password,
    email: 'jirasinj@gmail.com',
    firstName: 'jirasin',
    lastName: 'wiset',
    address: '156/10',
    phone: 654743544,
  },
  {
    username: 'pee',
    password: password,
    email: 'preera@gmail.com',
    firstName: 'preera',
    lastName: 'joo',
    address: '156/10',
    phone: 896546315,
  },
];

const todoData = [
  { title: 'Learn HTML', dueDate: new Date(), userId: 1 },
  { title: 'Learn CSS', dueDate: new Date(), userId: 1 },
  { title: 'Learn JS', dueDate: new Date(), userId: 2 },
  { title: 'Learn React', dueDate: new Date(), userId: 2 },
];

const run = async () => {
  try {
    await prisma.user.createMany({
      data: userData,
    });
    await prisma.todo.createMany({
      data: todoData,
    });
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
};

run();
