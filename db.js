privateConfigs = require('../privateConfigsSRO');

var stringSimilarity = require("string-similarity");


async function connect(){
    if(global.connetion && global.connection.state !== 'disconnected')
        return global.connetion;

    const mysql = require("mysql2/promise");
    error = "";
    const connection = await mysql.createConnection(privateConfigs.getConnectString())
                        .catch((err) => {
                            console.error(`Database connection error: ${err.message}`);
                            //throw new Error(err);
                            error = `Database connection error: ${err.message}`;

                        });
    //console.log("Conected to Mysql!");
    global.connection = connection;
    return [connection,error];
}

async function getLdiEventFromLdiNumber(ldiNumber){
    const [conn,error] = await connect();
    let queryString = "SELECT EVE_ID_EVENTO from launchtodlvry where LTD_ID = ? ;";
    let [[sqlResponse],[]] = await conn.query(queryString, [ldiNumber]);
    //console.log(queryString + " <= " + ldiNumber)
    conn.end();
    
    return sqlResponse;
    
}

async function getObjectsFromLdiEvent(ldiEventCode){
    const [conn,error] = await connect();
    let queryString = "SELECT LTD_ITEMCODE from LEDITEMLIST where EVE_ID_EVENTO  = ? AND LTD_CUSTOMERCODE IS NULL ORDER BY LTD_GROUPNUMBER ASC ;";
    let [sqlResponse] = await conn.query(queryString, [ldiEventCode]);
    conn.end();
    
    return sqlResponse;

}

async function insertCustomer(customerName, orderNumber, CS_CODE){
    const [conn,error] = await connect();
    let queryString = "insert into DBSROII.CUSTOMER (CS_NAME, CS_PAPERID, CS_ADDRESSCODE, CS_EMAIL, CS_PHONENUMBER, CS_CELLNUMBER, CS_ADDRESSNUMBER, CS_ADDRESSCOMPL , CS_ADDCEP , CS_CODE) values (?, null, null, null, null, null, null, ?, null, ?)"
    let sqlResponse = await conn.query(queryString, [customerName + " " + orderNumber , "Ordem " + orderNumber ,CS_CODE]);
    conn.end();
    console.log(CS_CODE)
    return sqlResponse;
}

async function getCustomerFromObject(objectCode){
    const [conn,error] = await connect();
    let queryString = "SELECT LTD_CUSTOMERCODE FROM leditemlist WHERE LTD_ITEMCODE=?";
    let [[sqlResponse],[]] = await conn.query(queryString, [objectCode]);
    conn.end();
    return sqlResponse;
}

async function updateCustomerCodeInObjectEntry(objectCode,customerCode){
    const [conn,error] = await connect();
    let queryString = "update LEDITEMLIST set LTD_CUSTOMERCODE= ? where LTD_ITEMCODE= ?"
    let sqlResponse = await conn.query(queryString, [customerCode, objectCode]);
    conn.end();
    return sqlResponse;
}

//update DBSROII.LEDITEMLIST set LTD_ITEMCODE='SX299688827BR', LTD_GROUPNUMBER=1, LTD_AR=0, LTD_MP=0, LTD_CUSTOMERCODE='036ca1db4374543a01ab50413c6c636a', EVE_ID_EVENTO='a12f14f27a666e3124905c31b611fc0f', LTD_DD=0, LTD_OD=0, LTD_LASTTIME=null, LTD_COMMENT='', LTD_ITEMDESTINY=1, LTD_DATAHORAOBJETO='2021-05-16 17:02:52', LTD_ORDEMOBJETO=null, LTD_MODOLEITURAOBJETO=null, LTD_USERID=null, LTD_PREPOSTAGEM=null, LTD_VALORAPAGAR=null, LTD_TRIBUTOSAPAGAR=null, LTD_WSNUMBER_LEITURA=107 where LTD_ID_EVENTO='c267bdd108e54c743c3bdedf50e66fc7'

/*
async function selectCustomer(customerName){
    const [conn,error] = await connect();

}
*/


async function searchCustomer(customer){
    const [conn,error] = await connect();
    //console.log("connect returns: " + conn);
    if(conn === undefined){
        return  [{
                    ERRO:error
                }];
    }else{
        const sql = privateConfigs.getSearchQuery();

        var searchName = makeGerenericRegexp(customer.name);
        sqlQueryString = buildSqlQueryString(searchName);

        [sqlResponse] = await conn.query(sqlQueryString, [customer.name]);
        conn.end();

        //console.log(sqlResponse);
        filterEntries(sqlResponse,customer.name);
        return sqlResponse;
    }
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
        //jsonList[index].SIMILARITY *= (name.length)/(jsonList[index].NOME.length+name.length);
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
module.exports = {searchCustomer,insertCustomer,getCustomerFromObject,updateCustomerCodeInObjectEntry,getObjectsFromLdiEvent,getLdiEventFromLdiNumber}