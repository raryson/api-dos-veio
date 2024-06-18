/// <reference lib="deno.unstable" />deno
// @deno-types="npm:@types/express@4.17.15"
import express, { json } from "npm:express@4.18.2";

const app = express();
app.use(json());
const kv = await Deno.openKv();
const exposedPort = 3000
const tbName = `users`

app.get("/", (_, res) => {
  res.send("Essa é a API dos véio");
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  const data = {
    username,
    password
  };
  
  const result = await kv.set([tbName, username], data);
  res.json(result)
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  const entry = await kv.get([tbName, username]) as {key: string[], value: {username: string, password: string}, versionstamp: string};

  res.json(entry.value.username === username && entry.value.password === password)
})


app.listen(exposedPort, () => {
  console.log(`listening at ${exposedPort}`)
});