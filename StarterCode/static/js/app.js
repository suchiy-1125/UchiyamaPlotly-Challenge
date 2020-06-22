// var url = "sample.json";

function getPlot(id) {

    d3.json("samples.json").then((data) => {
        // console.log(data);

        //get wfreq
        var md = data.metadata.filter(s => s.id.toString() === id)[0];
        var wfreq = md.wfreq

        // console.log(wfreq);

        //filter sample values by id
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        //get the top 10 from sample values
        var sample_values = samples.sample_values.slice(0, 10).reverse();
        // console.log(sample_values)
        //get the top 10 otu_ids
        var otu_top = samples.otu_ids.slice(0, 10).reverse();
        
        //Show otu_ids in desired form for the bar graph
        var otu_ids = otu_top.map(d => "OTU " + d);
        // console.log(otu_ids)
        //get the top 10 labels for the graph
        var labels = samples.otu_labels.slice(0, 10);
        // console.log(labels)
        //Trace for Bar Chart
        var trace1 = {
            x: sample_values,
            y: otu_ids,
            text: labels,
            type: "bar",
            orientation: "h",
            marker:{
                color:"lightblue"
            }
        };
        var data1 = [trace1];

        // Define the plot layout
        var layout = {
            title: "Top 10 OTU",
            yaxis: { tickmode: "linear" },
            height: 600,
            
        };

        // Create the bar plot
        Plotly.newPlot("bar", data1, layout);

        //Trace for Bubble Chart
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_ids
        };

        //Layout for bubble chart
        var layout_b = {
            xasis: { title: "OTU ID" },
            height: 600,
            width: 1000
        };

        var data2 = [trace2]

        Plotly.newPlot("bubble", data2, layout_b);

        //Gauge Chart

        var data_g = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(wfreq),
            title: { text: 'Belly Button Washing Frequency' },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                    { range: [0, 1], color: "#E0BBE4"},
                    { range: [1, 2], color:"#957DAD"},
                    { range: [2, 3], color:"#D291BC"},
                    { range: [3, 4], color:"FEC8D8"},
                    { range: [4, 5], color:"FFDFD3"},
                    { range: [5, 6], color:"#C1BBDD"},
                    { range: [6, 7], color:"#DABFDE"},
                    { range: [7, 8], color:"FFDCF4"},
                    { range: [8, 9], color:"DCFFFB"}
                ],
                bar:{color:"white"}             
            },
            

        }];
        var layout_g = {
            width: 800,
            height: 600,
        };
        Plotly.newPlot("gauge", data_g, layout_g);
    });
};

//Function to get the necessary data

function getInfo(id) {
    //read the json file
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // console.log(metadata);

        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        var demoInfo = d3.select("#sample-metadata");
        // console.log(demoInfo)
        // console.log(result)
        //empty the demographic info each time
        demoInfo.html("");

        Object.entries(result).forEach((key) => {
            // console.log(key[0])
            // console.log(key[1])
            demoInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
};

//created the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
};

//create the function for the intitial data rendering
function init() {
    //select dropdown menu
    var dropdown = d3.select("#selDataset");
    //read the data
    d3.json("samples.json").then((data) => {
        console.log(data)

        //get the id data to the dropdown menu
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");

            //call the functions to display the data and plots to the page
            getPlot(data.names[0]);
            getInfo(data.names[0]);
        })
    })

}
init();


