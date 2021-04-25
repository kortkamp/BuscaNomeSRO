privateConfigs = require('../privateConfigsSRO');


async function connect(){
    if(global.connetion && global.connection.state !== 'disconnected')
        return global.connetion;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection(privateConfigs.getConnectString());
    console.log("Conected to Mysql!");
    global.connection = connection;
    return connection;
}


async function searchCustomer(customer){
    const conn = await connect();
    const sql = privateConfigs.getSearchQuery();

    res = await conn.query(sql, [customer.name]);
    conn.end();
    return res;
}
 
module.exports = {searchCustomer}