#!/usr/bin/env node

const fs = require('node:fs');
const exec = require('child_process').exec;
const OpenAI = require('openai');
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'origin', alias: 'o', type: String },
  { name: 'prompt', alias: 'p', type: String }
];
const options = commandLineArgs(optionDefinitions);

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

function generateGitCommand() {
  const command = ["git --no-pager log"];

  if (options.origin) {
    command.push(`HEAD...${options.origin}`);
  } else {
    command.push(`HEAD...main`);
  }

  command.push("--format='%ai;%an;%B'");

  return command.join(' ');
}

const generateDescriber = (openaiToken) => {
  if (!openaiToken) {
    console.error("Configure you token in package.json");
    return;
  }

  const openai = new OpenAI({
    apiKey: openaiToken,
  });

  execProcess(generateGitCommand(), async function (err, response) {
    if (!err) {
      if (!response || response == "") {
        console.error("You have no new commits");
        return;
      }

      const messages = [
        { role: 'system', content: "I have some git commit titles from my work that I'm doing and I would like to create a description for the github pull request explaining what I did to the reviewer, please don't use commit names" },
        { role: 'system', content: "Please, add Changes Made, Details and message thanking the reviewer" },
      ];

      if (options.prompt) messages.push({ role: 'system', content: options.prompt });

      messages.push({ role: 'system', content: "The title is divided into: datetime;author name;title of changes" });
      messages.push({ role: 'user', content: `Titles:
${response}` });

      try {
        const chatCompletion = await openai.chat.completions.create({
          messages: messages,
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
}

const openaiToken = process.env.openai_token || process.env.OPENAI_TOKEN;

if (openaiToken) {
  generateDescriber(openaiToken)
} else {
  fs.readFile('./package.json', 'utf8', (err, data) => {
    if (err) {
      console.error("Don't exists package.json file");
      return;
    }
    const package = JSON.parse(data);
  
    generateDescriber(package?.gdescriber?.openai_token)
  });
}
