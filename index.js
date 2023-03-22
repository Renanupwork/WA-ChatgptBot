
const messagebird = require('messagebird').initClient('s3NOD6ikffMPAsFL4GiDbWUU0');
const express = require("express");
const axios = require("axios");

var bodyParser = require('body-parser');

const query = require('./generate');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var port = 4000;
let chartHistory = [];
app.post('/chat', async function(req, res) {
    console.log('receiving data ...');
    console.log('Text is ',req.body.payload);
    if(!chartHistory[req.body.contactPhoneNumber])
        chartHistory[req.body.contactPhoneNumber] = [];
    let prompt = "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\n";
    chartHistory[req.body.contactPhoneNumber].map(ele=>{
        prompt += "Human: " + ele.user + "\n";
        prompt += "AI: " + ele.bot + "\n";
    })
    prompt += "Human: " + req.body.payload + "\nAI:";
    const result = await query({
        prompt: prompt
    });
    if(result === 'error') {
        return;
    }
    console.log('Reply is ',result);
    const reply = {
        type: 'text',
        content: {
          "text": result,
        },
    };

    messagebird.conversations.reply(req.body.conversationId, reply, (err, response) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            console.log(response);
            chartHistory[req.body.contactPhoneNumber].push({user:req.body.payload, bot:result});
            res.sendStatus(200);
        }
      });

    //   messagebird.messages.create({
    //     'recipients': req.body.message.from,
    //     'originator':  req.body.message.to,
    //     "body":result
    //   }, function(err, response) {
    //     if (err) {
    //       console.error(err);
    //     } else {
    //       console.log(response);
    //       chartHistory[req.body.message.from].push({user:req.body.message.content.text, bot:result});
    //       res.sendStatus(200);

    //     }
    //   });
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);// start a conversation
