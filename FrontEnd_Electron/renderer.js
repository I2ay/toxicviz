let Chart = require('chart.js');
let labels = ['Toxic', 'Severely Toxic', 'Obscene', 'Threat', 'Insult', 'Identity Hate'];

function get(comment) {
    return new Promise ((resolve, reject) => {
        setTimeout(() => {
            let formData = new FormData();
            formData.append("comment", comment);
            fetch('http://127.0.0.1:5000/', {
                method: 'post',
                body: formData
            })
            .then(res => {
                resolve(res);
            })
            .catch(err =>{
                reject(err);
            });
        })
    })     
}


function toPercent(str, places=2) {
    let num = parseFloat(str);
    str = (num * 100).toFixed(places);
    return str+'%';
}

let ctx = document.getElementById('barChart').getContext('2d');
let barChart = new Chart(ctx, {
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

let ctxDnt = document.getElementById('donutChart').getContext('2d');
let donutChart = new Chart(ctxDnt, {
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

let ctxRdr = document.getElementById('radarChart').getContext('2d');
let radarChart = new Chart(ctxRdr, {
    type: 'radar',
    data: {
        labels: labels,
        datasets: []
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        // legend: {display: false},
        scale: {
            ticks: {
                min: 0,
                max: 1,
                // Include a % sign in the ticks
                callback: function(value, index, values) {
                    return toPercent(value,0);
                }
            }
        },
        tooltips: {
            callbacks: {
                // Change to %
                label: function(context) {
                    let value = context.value || '';                    
                    return labels[context.index]+": "+toPercent(value);
                },
                title: function(context, data) {
                    return data.datasets[context[0].datasetIndex].label;
                }
            }
        }
    }
});

let pointBackgroundColors=[];
let ctxLn = document.getElementById('lineChart').getContext('2d');
let lineChart = new Chart(ctxLn, {
    type: 'line',
    data: {
        datasets: [{
            data:[],
            backgroundColor: "rgba(200,0,0,0.4)",            
            pointBackgroundColor: pointBackgroundColors,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {display: false},
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 1,                    
                    autoSkip: true,
                    maxTicksLimit: 10,
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

function addEntry(chart, data, comment) {
    chart.data.labels.push(comment);
    chart.data.datasets[0].data.push(data);
    let r = data*255;
    chart.data.datasets[0].pointBackgroundColor.push(`rgba(${r},${255-r},0,1)`)
    chart.update();
}


function addData(chart, data, comment) {
    let r = getAvg(data)*255;
    let bgClr =`rgba(${r},${255-r},0,0.2)`;
    let brdClr =`rgba(${r},${255-r},0,1)`;
    let dataset = {
        label: comment,        
        backgroundColor: bgClr,
        borderColor: brdClr,
        data: data
    }
    chart.data.datasets.push(dataset);
    chart.update();
}

function removeData(chart) {
    // chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
function editData(chart, data) {
    chart.data.datasets[0].data = data;
    chart.update();
}

function getAvg(data) {    
    let total = 0;
    for (let i =0; i< data.length; i++) {            
        let num = parseFloat(data[i]);
        total+=num;
    }
    return total/6;
}

const btnGet = document.getElementById('get');
btnGet.addEventListener('click', function () {
    let comment = document.getElementById("comment").innerHTML
    get(comment)
    .then(res => res.json())
    .then(res=>{
        let data = [res.toxic, res.severe_toxic, res.obscene, res.threat, res.insult, res.identity_hate];
        editData(barChart, data);//bar
        editData(donutChart, data);//bar
        total=getAvg(data);
        //cut off label at 15 chars
        if (comment.length>15) {
            comment = comment.substring(0, 13)+"...";
        }

        addData(radarChart, data, comment);//radar
        addEntry(lineChart, total, comment)//line
    })
    .catch(err=>{
        console.log(err)
    })
})
const btnClear = document.getElementById('clear');
btnClear.addEventListener('click', function () {    
    radarChart.data.datasets = [];
    radarChart.update();
    barChart.data.datasets[0].data = [];
    barChart.update();
    lineChart.data.datasets[0].data = [];
    lineChart.data.datasets[0].pointBackgroundColor = [];
    lineChart.data.labels = [];
    lineChart.update();
    donutChart.data.datasets[0].data= [];
    donutChart.update();
})