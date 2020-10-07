async function stringToArray() {

    inputText = getInput();
  
    // split words into array
    var inputArray = inputText.split(' '); 
    var toxicness;

    // Print out array of words
    for (var i in inputArray){
        toxicness = await computeToxicity(inputArray[i]);
        if (toxicness>0.75){
        document.getElementById("firstLine").innerHTML += "<span style='color: #FF0000;'>" + inputArray[i] + " </span> ";
        }
        else{
        document.getElementById("firstLine").innerHTML += inputArray[i] + " ";
        }
    }
}

function computeToxicity(comment){
    return new Promise(function(resolve){
    
        var toxicity;
        get(comment)
        .then(res => res.json())
        .then(res=>{
            let data = [res.toxic, res.severe_toxic, res.obscene, res.threat, res.insult, res.identity_hate];
            toxicity = data[0];
            resolve(toxicity);
        })
        .catch(err=>{
            console.log(err)
        }) 
        
    })

}
// Returns text from textbox
function getInput() {
  return document.getElementById("comment").innerHTML;
}


