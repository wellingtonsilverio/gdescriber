const exec = require('child_process').exec;
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: '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',
  });

function execProcess(command, cb){
    var child = exec(command, function(err, stdout, stderr){
        if(err != null){
            return cb(new Error(err), null);
        }else if(typeof(stderr) != "string"){
            return cb(new Error(stderr), null);
        }else{
            return cb(null, stdout);
        }
    });
}

execProcess("git --no-pager log HEAD...main --format='%ai;%an;%B'", async function(err, response){
    if(!err){
        console.log("execProcess",response);
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Say this is a test' }],
            model: 'gpt-3.5-turbo',
          });
        console.log("chatCompletion",chatCompletion);

    }else {
        console.log(err);
    }
});