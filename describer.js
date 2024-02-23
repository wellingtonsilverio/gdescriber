const exec = require('child_process').exec;

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

execProcess("git --no-pager log HEAD...main --format='%ai;%an;%B'", function(err, response){
    if(!err){
        console.log(response);
        console.log("---");
    }else {
        console.log(err);
    }
});