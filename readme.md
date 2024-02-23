# DESCRIBER: Description by AI
Generate a description of the tasks done to put in the pull request from your commits
![](https://raw.githubusercontent.com/wellingtonsilverio/gdescriber/main/.readme-assets/example.gif)

## Configure:
Add the environment variable `OPENAI_TOKEN` with your openai api key or add it to package.json
```json
{
    ...
    "gdescriber": {
        "openai_token": "YOU-OPENAI-API-KEY"
    }
}
```

## Run
Execute in you project folder
```bash
npx gdescriber
```

## Options
Pass parameters in the execution line

### --origin
Change the origin branch to compare commits, example:
```bash
npx gdescriber --origin develop
```
### --prompt
Add new text to the AI ​​prompt, example:
```bash
npx gdescriber --prompt "Considering that my project is an e-commerce in NextJS"
```
