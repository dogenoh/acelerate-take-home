import { PrismaClient } from '@prisma/client';

// Create a new Prisma client instance
const prisma = new PrismaClient();

// Use the environment variable for the connection URL
const connectionString = process.env.ELEPHANTSQL_CONNECTION_URL;

// Set the connection URL for Prisma client
prisma.$connect({
  datasources: {
    db: {
      url: connectionString,
    },
  },
});

export default prisma;
