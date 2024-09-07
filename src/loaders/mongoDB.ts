import { MongoClient } from "mongodb";
import config from '../config';

const { user, password } = config.mongodb;

const uri = `mongodb+srv://${user}:${password}@cluster0.vbr97.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
let client: MongoClient;

try {
  client = new MongoClient(uri);
  console.log('mongo loaded');
} catch (error) {
  console.log(error);
}

export default function getDatabase() {
  return client.db('your-bar');
}
