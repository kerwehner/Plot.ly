function buildPlots(singleId) {
    // Using d3 to Read in samples.json
    d3.json("samples.json").then((importedData) => {
        // Data
        var data = importedData;

        // Array of Metadata & Samples
        var metadata = data.metadata;
        var samples = data.samples;

       // Filter Metadata
       var filterMetadata = metadata.filter(metaObject => metaObject.id == singleId)[0];

        // Selecting Id
       var demographicInfo = d3.select("#sample-metadata");
       // Clearing Any Data
       demographicInfo.html("");
       // Creating Table
        Object.entries(filterMetadata).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });

        // Filter Samples
        var filterSamples = samples.filter(sampleObject => sampleObject.id == singleId)[0];

        // Seeking Sample Values, OTU_Ids, and OTU_Label
        var sampleValues = filterSamples.sample_values;
        var OTU_Ids = filterSamples.otu_ids;
        var OTU_Labels = filterSamples.otu_labels;

        // The Plotly Bar Plot Only Needs the Top 10 Samples
        // Also, we Must Use .reverse Method to Account for Plotly's Defaults
        var top10Samples = sampleValues.slice(0, 10).reverse();
        var top10Otus = OTU_Ids.slice(0, 10).reverse();
        var top10Labels = OTU_Labels.slice(0, 10).reverse();
     
        // Using .map Methis to Return Array of OTU Ids
        var top10OtuIds = top10Otus.map(d => "OTU " + d);

        // Create Trace for Bar Plot
        var trace = {
            x: top10Samples,
            y: top10OtuIds,
            text: top10Labels,
            type: "bar",
            orientation: "h"
        }

        // Create Trace1 for Bubble Chart
        var trace1 = {
            x: OTU_Ids,
            y: sampleValues,
            marker: sampleValues,
            text: OTU_Labels,
            mode: "markers",
            marker: {
                color: OTU_Ids,
                colorscale: 'Earth',
                size: sampleValues
            }
        }
        // Layout for Trace1
        var layout = {
            showlegend: false,
            height: 600,
            width: 930,
            xaxis: {
                title: {
                    text: 'OTU Id'
                }
            }
          }

        var chartData = [trace];
        var chartData1 = [trace1];

        Plotly.newPlot("bar", chartData);
        Plotly.newPlot("bubble", chartData1, layout);
    });
}

// Calling Function to Build Plots
buildPlots();


// Function to Populate Dropdown Menu
function populate() {
    d3.json("samples.json").then((importedData) => {
        var data = importedData;
        // Selecting Id
        var dropDownMenu = d3.select("#selDataset")
        data.names.forEach((value) => {
            // Appending Option Tag to HTML
            var option = dropDownMenu.append("option");
            //Getting and Setting the Value
            option.text(value).property("value", value);
        });
    });
}

// Calling Function to Populate Dropdown Menu
populate();

// Function to Call buildPlots
function optionChanged(name) {
    buildPlots(name);
}