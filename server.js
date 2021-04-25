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

jsonReturn =  {
    "NOME" : [],
    "CODIGO" : [],
    "COMPL": [],
    "DATA": [],
    "LISTA": [],
    "SITUACAO": []
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
       
    }else{   // We have a http query!
        
        console.log('html query');

        query = parse(req.url,true).query;
        
        //console.log(query);

        var queryResult = [];

        res.writeHead(200, {
            'Content-Type' : types['json'] || 'application/json'
        });

        (async () => {
            const db = require("./db");
            //console.log('Começou!');
            [queryResult] = await db.searchCustomer( {name: query.name});
            //console.log(queryResult[0]);

            
            jsonReturn.NOME = [];
            jsonReturn.CODIGO = [];
            jsonReturn.COMPL = [];
            jsonReturn.DATA = [];
            jsonReturn.LISTA = [];
            jsonReturn.SITUACAO  = [];
        
            for(let i = 0 ; i < queryResult.length ; i++){
                jsonReturn.NOME.push(queryResult[i].NOME);
                jsonReturn.CODIGO.push(queryResult[i].CODIGO);
                jsonReturn.COMPL.push(queryResult[i].COMPLEMENTO);
                jsonReturn.DATA.push(queryResult[i].DATA);
                jsonReturn.LISTA.push(queryResult[i].LISTA);
                jsonReturn.SITUACAO.push(queryResult[i].SITUACAO);
                //console.log(queryResult[i].NOME);
            }
             
            stringJson = JSON.stringify(jsonReturn);
            
            //console.log(">>>>" + stringJson);
            res.end(stringJson);
        })();

        

       

    }
}