const axios = require('axios');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const url = 'http://10.8.88.217/rastreamento/sro';





// faz o body baseando-se na primeira resposta de pesquisa
function makeBody(data,codObjeto){

    const position = data.search("','PO','")

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
    const initPosition = data.indexOf('Destinat',0) + 25;
    const finalPosition = data.indexOf('</TD>', initPosition) - 5;

    const nome = data.substring(initPosition,finalPosition);

    return nome;
}



async function getList(codObjeto){
    axios.post(url,{
        opcao: 'PESQUISA',
        portal: 'intra',
        objetos: codObjeto
      }).then(result => {

          const body = makeBody(result.data,codObjeto);

          console.log(body)

          axios.post(url,body).then(result =>{

              const name = searchName(result)
              console.log(name)
              return name;
          })
          

          

      });
}

async function getObjectCustomerName(code){
    console.log("++++")
    await timeout(1000);
    return("Random Name for code "+ code)
}


module.exports = {getObjectCustomerName, getList}