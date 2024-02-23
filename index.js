#!/usr/bin/env node

const fs = require('node:fs');
const exec = require('child_process').exec;
const OpenAI = require('openai');

function execProcess(command, cb) {
  var child = exec(command, function (err, stdout, stderr) {
    if (err != null) {
      return cb(new Error(err), null);
    } else if (typeof (stderr) != "string") {
      return cb(new Error(stderr), null);
    } else {
      return cb(null, stdout);
    }
  });
}

fs.readFile('./package.json', 'utf8', (err, data) => {
  if (err) {
    console.error("Don't exists package.json file");
    return;
  }
  const package = JSON.parse(data);
  const openaiToken = package?.gdescriber?.openai_token;

  if (!openaiToken) {
    console.error("Configure you token in package.json");
    return;
  }

  const openai = new OpenAI({
    apiKey: openaiToken,
  });

  execProcess("git --no-pager log HEAD...main --format='%ai;%an;%B'", async function (err, response) {
    if (!err) {
      try {
        const chatCompletion = await openai.chat.completions.create({
          messages: [
            { role: 'system', content: "I have some git commit titles from my work with the node program that I'm doing and I would like to create a description for the github pull request explaining what I did to the reviewer, please don't use commit names" },
            { role: 'system', content: "Please, add Changes Made, Details and message thanking the reviewer" },
            { role: 'system', content: "The title is divided into: datetime;author name;title of changes" },
            { role: 'user', content: response },
          ],
          model: 'gpt-3.5-turbo',
          temperature: 0.01,
        });

        console.log(chatCompletion?.choices[0]?.message?.content);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(err);
    }
  });
});