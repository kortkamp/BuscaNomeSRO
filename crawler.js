const axios = require('axios');
const querystring = require('querystring');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const url = 'http://app.correiosnet.int/rastreamento/sro';





// faz o body baseando-se na primeira resposta de pesquisa
function makeBody(data,codObjeto){

    const position = data.search("','PO','")

    //console.log(data)
    //console.log(`posição : ${position}`)

    codOperacao =  'PO';
    codRegistro =  data.substring(position + 8,position + 18);
    tipoRegistro = data.substring(position + 21 , position + 22);
    dataCriacao = data.substring(position + 25, position + 44);


    const body = {
        opcao:'DETALHESINTRA',
        idioma: '001',
        ambiente: 'INTRA',
        codItem: codObjeto,
        codOperacao: 'PO',
        codRegistro:codRegistro,
        tipoRegistro:tipoRegistro,
        dataCriacao:dataCriacao,
        portal:'intra'
    }

    return body;
}

function searchName(data){
    const dataString = String(data)


    const initPosition = dataString.indexOf('Destinat',0) + 25;

    
    const finalPosition = dataString.indexOf('</TD>', initPosition) - 5;

    const name = dataString.substring(initPosition,finalPosition);
    return name;
}



async function getObjectCustomerName(codObjeto){

    axios.post(url,querystring.stringify({
        opcao: 'PESQUISA',
        portal: 'intra',
        objetos: codObjeto
      }),{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      }).then(result => {

          //console.log(`${result.data}`)

          const body = makeBody(result.data,codObjeto);


          axios.post(url,querystring.stringify(body),{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(result =>{

              const name = searchName(result.data)
              console.log(name)
              return name;
          })
          
      });
}

async function getObjectCustomerName2(code){
    console.log("++++")

    if(Math.random > 0.2){

        console.log('throw error')
        throw new Error('rand0m simulated error');
    }
    await timeout(10);
    return("Random Name for code "+ code)
}


module.exports = {getObjectCustomerName}