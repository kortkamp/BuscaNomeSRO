var http = require('http'),
    config = require('./config'),
    fileHandler = require('./filehandler'),
    parse = require('url').parse,
    types = config.types,
    rootFolder = config.rootFolder,
    defaultIndex = config.defaultIndex,
    server;

module.exports = server = http.createServer();

server.on('request', onRequest);

jsonReturnTest =  {
    "name" : ['joao', 'maria', 'jose'],
    "date" : ['10/01/20','10/01/20','10/01/20'],
    "event": ['LDI','LOEC','LDR']
};

function onRequest(req, res){
    var filename = parse(req.url).pathname,
        fullPath,
        expensions;
    //console.log(parse(req.url));//---------------------------
    if(filename === '/'){
        filename = defaultIndex;
    }
    query = parse(req.url).query;
    

    
    if(query === null){ // Request file.
        //console.log('response as file');
        fullPath = rootFolder + filename;
        extension = filename.substr(filename.lastIndexOf('.') + 1);

        fileHandler(fullPath , function(data){
            res.writeHead(200, {
                'Content-Type' : types[extension] || 'text/plain',
                'Content-Length' : data.length
            });
            res.end(data);

        }, function(err) {
            res.writeHead(404);
            res.end();
        });
       
    }else{   // We have a query!
        

        query = parse(req.url,true).query;
       // console.log('response as query');
        console.log("search for " + query.name);
        res.writeHead(200, {
            'Content-Type' : types['json'] || 'application/json'
        });
        stringJson = JSON.stringify(jsonReturnTest);
        console.log(stringJson);
        res.end(stringJson);

    }
}