const express = require("express");
const cors = require('cors');

require("dotenv").config();
const {Configuration, OpenAIApi} = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/gpt", async (req, res) => {
    try {
        const {prompt} = req.body;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `
              ${prompt}
            `,
            max_tokens: 3000,
            // temperature: 0,
            // top_p: 1.0,
            // frequency_penalty: 0.0,
            // presence_penalty: 0.0,
            // stop: ["\n"],
        });

        return res.status(200).json({
            success: true,
            data: response.data.choices[0].text,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.response
                ? error.response.data
                : "There was an issue on the server",
        });
    }
});

app.post('/createTasks', async (req, res)=> {
    try {
        // throw QueryEmptyError
        const reqBody = req.body

        // console.log(body);

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `
              generate three tasks for the person '${reqBody.person}' based on these keywords '${reqBody.tasks}'.
              Return an array of json objects as response which contains two properties: challenge_name(task name), challenge_description'
            `,
            max_tokens: 3000,
            // temperature: 0,
            // top_p: 1.0,
            // frequency_penalty: 0.0,
            // presence_penalty: 0.0,
            // stop: ["\n"],
        });
        console.log(response.data.choices[0].text);
        return res.status(200).json(
            {
                data: response.data.choices[0].text,
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            success: false,
            error: e.type
        })
    }

})


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
