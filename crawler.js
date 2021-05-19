function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// not implemented yet

async function getObjectCustomerName(code){
    console.log("++++")
    await timeout(1000);
    return("Random Name for code "+ code)
}


module.exports = {getObjectCustomerName}