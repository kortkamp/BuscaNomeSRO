$("#name").keydown(function(event) {
    if(document.getElementById("name").value.length == 1 && event.keyCode == 8)
        $('#clearInputDiv').css('visibility', 'hidden');
    else
        $('#clearInputDiv').css('visibility', 'visible');
    if (event.keyCode === 13) {
        $("#searchButton").click();
    }
    
});

$('#clearInputDiv').click(function(){
    document.getElementById("name").value = ""; 
    $('#clearInputDiv').css('visibility', 'hidden');
});


function search(){
    name = document.getElementById("name").value;

    $('#response').html("");
    
    $('#response').append("<div id='loadingDiv'>Carregando...</div>");



    $.getJSON("?name=" + name, 
        function(data) {
            //console.log(data);
            updateData(data);
        });
}


/*
    jsonReturn.NOME = [];
    jsonReturn.CODIGO = [];
    jsonReturn.COMPLEMENTO = [];
    jsonReturn.DATA = [];
    jsonReturn.LISTA = [];
    jsonReturn.SITUACAO  = [];
*/

function updateData(jsonData){
    
    function makeHtmlTable(data){
        var keys = [];

        htmlTable = "<table class='table-fill' ><thead><tr>";
        for(let key in data){
            keys.push(key);
            htmlTable += "<th class='text-left'>" + key + "</th>"
        }
        htmlTable += "</tr></thead><tbody class='table-hover'>";
      //  htmlTable = "<table class='table-fill' cellspacing='2' border='1'>\
       //              <tr><td>NOME</td><td>CODIGO</td><td>COMPLEMENTO</td><td>DATA</td><td>LISTA</td><td>SITUACAO</td> </tr>";    
       
        for(var index in data[keys[0]] ){
            htmlTable += "<tr>";
            for(let key in keys){

                htmlTable += "<td class='text-left'>";
                switch(keys[key]){
                    case 'DATA':
                        let date = String(data[keys[key]][index]);
                        htmlTable += date.substr(0,10).split('-').reverse().join('/');
                        break;
                    case 'CODIGO':
                        htmlTable += data[keys[key]][index];
                        break;
                    default:
                        htmlTable += data[keys[key]][index];
                }
                
                htmlTable += "</td>";        
            }
            htmlTable += "</tr>"
        }
        htmlTable += "</tbody></table>"
        htmlTable = htmlTable.replaceAll('null', ' ');
        return htmlTable;
    }

    $('#response').html("");
    
    $('#response').append(makeHtmlTable(jsonData));
   
}
