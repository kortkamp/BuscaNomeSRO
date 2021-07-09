
const crawler = require("./crawler");
const db = require("./db");
var crypto = require('crypto');

async function fillLdiCustomers(ldiNumber,firstObjectOrder){
    let orderNumber = firstObjectOrder;

    console.log('ldi:' + ldiNumber + ' order:' + firstObjectOrder)

    let objectListReturn = await getObjectsFromLdi(ldiNumber);

    for(let obj of objectListReturn){
        //console.log("fill >> " + obj.LTD_ITEMCODE)
        await fillObjectCustomerName(obj.LTD_ITEMCODE,orderNumber++)
    }
}

async function getObjectsFromLdi(ldiNumber){


    

    let ldiEventCode;
    let LdiEveString = (await db.getLdiEventFromLdiNumber(ldiNumber))
    if(LdiEveString){
        ldiEventCode = LdiEveString.EVE_ID_EVENTO;
    }else{
        // LDI not found
    }
    //console.log(ldiEventCode)
    return await db.getObjectsFromLdiEvent(ldiEventCode)

    
}

async function fillObjectCustomerName(objectCode,orderNumber){

    // get customer name on Web
    let customerName = await crawler.getObjectCustomerName(objectCode).catch((err)=>{
        console.log(`Error :  ${err}`)
    });
    console.log(`customerName from crawler: ${customerName}`)
    
    if(customerName){
        let csCode = await createCustomerEntry(customerName,orderNumber)
    
        if( await isCustomerCodePending(objectCode)){
            console.log( " update csCode "+ await db.updateCustomerCodeInObjectEntry(objectCode,csCode))
            console.log("update name")
        }
        // put name on db
    }
    
    return("done for "+ objectCode)
}

async function  isCustomerCodePending(objectCode){
    let customerCode = await db.getCustomerFromObject(objectCode)
    
    if(customerCode)
        if(customerCode.LTD_CUSTOMERCODE)
            return false;
        else
            return true;

    return false;
}

function generateCsCode(customerName){
    let datetime = new Date();
    return crypto.createHash('md5').update(customerName + datetime).digest('hex');
}


/*
async function getCustomerEntry(customerName){
    // if not exists , create it
    // return CS_CODE
    let hash = crypto.createHash('md5').update(customerName).digest('hex');

}
*/
async function createCustomerEntry(customerName,orderNumber){

    
    let csCode = generateCsCode(customerName)
    console.log("createCustomerEntry " + await db.insertCustomer(customerName, orderNumber, csCode))

 
    return csCode
}


module.exports = {fillObjectCustomerName,fillLdiCustomers}