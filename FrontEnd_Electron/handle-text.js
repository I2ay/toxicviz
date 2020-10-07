async function stringToArray() {

    inputText = getInput();
  
    // split words into array
    var inputArray = inputText.split(' '); 

    // Print out array of words
    for (var i in inputArray){
        let toxicity = await computeToxicity(inputArray[i]);
        let graphhtml = `        
        <div id = "lchart"><canvas id="donutChartNgram"></canvas> </div>
        <div id = "rchart"><canvas id="barChartNgram"></canvas> </div>        
        `;
        if (toxicity[0]>0.5){
            document.getElementById("firstLine").innerHTML += "<div class='dropdown'><span style='color: #FF0000;'>" + inputArray[i] + " </span> <div class='dropdown-content'><p>"+toxicity+"</p></div></div>";
            console.log(document.getElementById("firstLine").innerHTML)
        }
        else{
            document.getElementById("firstLine").innerHTML += inputArray[i];
        }
        document.getElementById("firstLine").innerHTML += " ";
    }
}

function computeToxicity(comment){
    return new Promise(function(resolve){
    
        var toxicity;
        get(comment)
        .then(res => res.json())
        .then(res=>{
            let data = [res.toxic, res.severe_toxic, res.obscene, res.threat, res.insult, res.identity_hate];
            toxicity = data;
            refreshHoveredElements()
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

function refreshHoveredElements() {
    const hoveredElements = document.getElementsByClassName('dropdown');

    for (let i = 0; i < hoveredElements.length; i++) {
        console.log(i.toString()+"th hovered element")
    
        hoveredElements[i].addEventListener('mouseover', function () {
                console.log("firing")
                let ctxNGram = document.getElementById('barChartNgram').getContext('2d');
                let barChartNgram = new Chart(ctxNGram, {
                    type: 'horizontalBar',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: [],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {display: false},
                        scales: {
                            xAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    max: 1,
                                    // Include a % sign in the ticks
                                    callback: function(value, index, values) {
                                        return toPercent(value,0);
                                    }
                                }
                            }]
                        },
                        tooltips: {
                            callbacks: {
                                // Change to %
                                label: function(context) {
                                    let value = context.value || '';
                                    
                                    return toPercent(value);
                                }
                            }
                        }
                    }
                });

                let ctxDntNgram = document.getElementById('donutChartNgram').getContext('2d');
                let donutChartNgram = new Chart(ctxDntNgram, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: [],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        tooltips: {
                            callbacks: {
                                // Change to %
                                label: function(tooltipItems, data) {
                                    let idx = tooltipItems.index;
                                    let sum = data.datasets[0].data.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
                                    let val = parseFloat(data.datasets[0].data[idx]);
                                    let proportion = val/sum;
                                    return data.labels[idx]+": "+toPercent(proportion);
                                }
                            }
                        }
                    }
                })

            get(hoveredElement.innerHtml)
            .then(res => res.json())
            .then(res=>{
                let data = [res.toxic, res.severe_toxic, res.obscene, res.threat, res.insult, res.identity_hate];
                editData(barChartNgram, data);//bar
                editData(donutChartNgram, data);//bar
            })
            .catch(err=>{
                console.log(err)
            }) 
        })
    }
}