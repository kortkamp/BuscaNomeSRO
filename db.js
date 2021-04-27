privateConfigs = require('../privateConfigsSRO');

var stringSimilarity = require("string-similarity");


async function connect(){
    if(global.connetion && global.connection.state !== 'disconnected')
        return global.connetion;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection(privateConfigs.getConnectString());
    //console.log("Conected to Mysql!");
    global.connection = connection;
    return connection;
}


async function searchCustomer(customer){
    const conn = await connect();
    const sql = privateConfigs.getSearchQuery();

    var searchName = makeGerenericRegexp(customer.name);
    sqlQueryString = buildSqlQueryString(searchName);

    [sqlResponse] = await conn.query(sqlQueryString, [customer.name]);
    conn.end();

    //console.log(sqlResponse);
    filterEntries(sqlResponse,customer.name);
    return sqlResponse;
}
 


function buildSqlQueryString(name){
    const sql = privateConfigs.getSearchQuery();
    nameList = name.split(' ');
    let query = "";
    for(let index in nameList){
        //CUSTOMER.CS_NAME REGEXP 'n*m*[aáoóã]rs*c*ç*[eéê]l+[aáoóã]'
        query += "(CUSTOMER.CS_NAME REGEXP '"+ nameList[index] +"')";
        if(index < (nameList.length - 1))
            query += ' OR '
    }
    query = sql.replace('????', query);
    //console.log(query);
    return query;
}

function filterEntries(jsonList, name){
    for(let index in jsonList){
        jsonList[index].SIMILARITY = stringSimilarity.compareTwoStrings(name.toUpperCase(), jsonList[index].NOME.toUpperCase());
        jsonList[index].SIMILARITY *= (name.length)/(jsonList[index].NOME.length+name.length);
        //console.log( (jsonList[index].NOME.length+name.length)/name.length);
       
    }
    jsonList.sort(function(a,b){
        if (a.SIMILARITY > b.SIMILARITY) return -1;
        if (a.SIMILARITY < b.TSSIMILARITYT) return 1;
        return 0;
    });
}

function makeGerenericRegexp(name){
    // sim tá feio pra caramba, mas reaproveitei de um script em vbs que eu já usava.
    regexp  = name.toLowerCase();
    //console.log(regexp);
    regexp = regexp.replace(/ de /g," ")
    regexp = regexp.replace(/ da /g," ")
    regexp = regexp.replace(/ das /g," ")
    regexp = regexp.replace(/ do /g," ")
    regexp = regexp.replace(/ dos /g," ")

    regexp = regexp.replace(/a/g,"aaaaa")
    regexp = regexp.replace(/ã/g,"aaaaa")
    regexp = regexp.replace(/á/g,"aaaaa")
    regexp = regexp.replace(/e/g,"eeeee")
    regexp = regexp.replace(/é/g,"eeeee")
    regexp = regexp.replace(/ê/g,"eeeee")
    regexp = regexp.replace(/i/g,"iiiii")
    regexp = regexp.replace(/í/g,"iiiii")
    regexp = regexp.replace(/o/g,"aaaaa")
    regexp = regexp.replace(/u/g,"uuuuu")
    regexp = regexp.replace(/y/g,"iiiii")
    regexp = regexp.replace(/v/g,"vvvvv")
    regexp = regexp.replace(/w/g,"wwwww")
    regexp = regexp.replace(/ss/g,"s")
    regexp = regexp.replace(/s/g,"sssss")
    regexp = regexp.replace(/c/g,"sssss")
    regexp = regexp.replace(/ç/g,"sssss")
    regexp = regexp.replace(/n/g,"nnnnn")
    regexp = regexp.replace(/m/g,"nnnnn")


    regexp = regexp.replace(/aaaaa/g,"[aáoóã]")
    regexp = regexp.replace(/eeeee/g,"[eéê]")
    regexp = regexp.replace(/iiiii/g,"[iíy]")
    regexp = regexp.replace(/uuuuu/g,"[uúw]")
    regexp = regexp.replace(/vvvvv/g,"[vw]")
    regexp = regexp.replace(/wwwww/g,"[vwu]")
    regexp = regexp.replace(/sssss/g,"s*c*.")
    regexp = regexp.replace(/nnnnn/g,"[mn]")
    // Pesquisa 2 ou 1 letra L
    regexp = regexp.replace(/ll/g,"l")
    regexp = regexp.replace(/l/g,"l+")

    // Pesquisa TH ou T
    regexp = regexp.replace(/t/g,"th")

    // Ignora o H nas pesquisas 
    regexp = regexp.replace(/h/g,"h*")

    //console.log(regexp);
    return regexp;
}
module.exports = {searchCustomer}