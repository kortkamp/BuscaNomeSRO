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



function onRequest(req, res){
    var filename = parse(req.url).pathname,
        fullPath,
        expensions;
    
    if(filename === '/'){
        filename = defaultIndex;
    }
    query = parse(req.url).query;
    
    console.log(req.url);
    
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
       
    }else{   // We have a http query!>>>>>>>>>>>>>>>>>>
        
        //console.log('http query');

        query = parse(req.url,true).query;

        
        stringJsonResponse = {}; 
        if(query.ldi != undefined){

           
            (async () =>{
                const ldi = require("./ldi");
                
                console.log(await ldi.fillLdiCustomers(query.ldi,query.order))
            })();
            

        }
        //console.log(" query.name= " + query.name+ " length=" + query.name.lenght );
        if(query.name != undefined){
            
            if(query.name.length > 0){
                //console.log(" query.name= " + query.name);

                var queryResult = [];

                res.writeHead(200, {
                    'Content-Type' : types['json'] || 'application/json'
                });

                (async () => {
                    const db = require("./db");
                    //console.log('Começou!');
                    queryResult = await db.searchCustomer( {name: query.name});
                    //console.log(queryResult);

                    jsonReturn = {};
                    for(index in queryResult[0]){
                        jsonReturn[index] = [];
                        //console.log(index);
                    }
                    
                    for(let i = 0 ; i < queryResult.length ; i++){
                        for(index in queryResult[0]){
                            jsonReturn[index].push(queryResult[i][index]);
                        }                
                    }
                    
                    stringJsonResponse = JSON.stringify(jsonReturn);
                    
                    res.end(stringJsonResponse);
                })();
            }
            else{
                //console.log("zero length name");
                res.writeHead(200, {
                    'Content-Type' : types['json'] || 'application/json'
                });
                res.end("{}");
            }
        }
        else{
            res.writeHead(404);
            res.end();
        }
    }
}