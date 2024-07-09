import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from "dotenv";

import { ApolloServer } from "@apollo/server"                              /*This package is used to create the server */
// import { startStandaloneServer } from "@apollo/server/standalone"       /*This package is used to start the server */
import { expressMiddleware } from '@apollo/server/express4';               /*We'll not use startsstandalone, instead use express from apollo */
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

import {connectDB} from "./db/connectDB.js";

dotenv.config();
const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({                                       /*This is the server*/
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers, 
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

// Ensure we wait for our server to start
await server.start();


// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
    '/',
    cors(),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => ({req}),
    }),
  );
  
  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

  await connectDB();
  
  console.log(`🚀 Server ready at http://localhost:4000/`);
 
// const { url } = await startStandaloneServer(server)                     /*Here we start the server*/
 
// console.log(`🚀 Server ready at ${url}`)