import { MongoClient } from "mongodb";

const URI = process.env.NEXT_PUBLIC_MONGODB_URI;
const options = {}

if (!URI) {
    throw new Error("Please define the NEXT_PUBLIC_MONGODB_URI environment variable inside .env.local");
}

const client: MongoClient = new MongoClient(URI, options);
const clientPromise: Promise<MongoClient> = client.connect()

/* eslint-disable no-var */
declare global {
    var _mongoClientPromise: Promise<MongoClient>;
}
/* eslint-enable no-var */

export default clientPromise;