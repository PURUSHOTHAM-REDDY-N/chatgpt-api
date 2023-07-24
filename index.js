const express = require("express");
const cors = require('cors');

require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

app.get('/',(req,res)=>{
  res.send("hello")
})

app.post("/gpt", async (request, response) => {
  const { chats } = request.body;
  console.log(chats)

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a Conditional Fund Raising Assistant. You can help campaign creators to define the creative conditions for their campaigns.",
      },
      ...chats,
    ],
  });

  response.json({
    output: result.data.choices[0].message,
  });
});



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
