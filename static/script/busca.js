
function search(){
    name = document.getElementById("name").value;

    $.getJSON("?name=" + name, 
        function(data) {
            updateData(data);
        });
}

function updateData(data){
    $('#response').html("");
    for(count in data.name){
        console.log(data);
        $('#response').append(data.name[count]+'<br>');
    }

}
