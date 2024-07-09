import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from "dotenv";

import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session';

import { ApolloServer } from "@apollo/server"                              /*This package is used to create the server */
// import { startStandaloneServer } from "@apollo/server/standalone"       /*This package is used to start the server */
import { expressMiddleware } from '@apollo/server/express4';               /*We'll not use startsstandalone, instead use express from apollo */
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildContext } from "graphql-passport";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

import {connectDB} from "./db/connectDB.js";
import { configurePassport } from './passport/passport.config.js';

dotenv.config();
configurePassport();
const app = express();
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection:'sessions',
});
store.on("error",(err) => console.log(err));

app.use(                                  // Calling the session middleware
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,                        // this option specifies whether to save the session to the store on every request
    saveUninitialized: false,             //option specifies whether to save the uninitialized session
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,    // 7 days
      httpOnly:true                       // this option prevents the Cross-Site Scripting (XSS) attacks
    }, 
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req,res }) => buildContext({req,res}),
    }),
  );

  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  await connectDB();  
  console.log(`🚀 Server ready at http://localhost:4000/`);
 
// const { url } = await startStandaloneServer(server)                     /*Here we start the server*/ 
// console.log(`🚀 Server ready at ${url}`)