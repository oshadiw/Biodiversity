function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
  init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID: " + result.id);
      PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
      PANEL.append("h6").text("LOCATION: " + result.location);
      PANEL.append("h6").text("GENDER: " + result.gender);
      PANEL.append("h6").text("AGE: " + result.age);
      PANEL.append("h6").text("BBTYPE: " + result.bbtype);
      PANEL.append("h6").text("WFREQ: " + result.wfreq);
    });
}
// Bar chart
function buildCharts(sample) {
    d3.json("samples.json").then((data) => {  
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var topten = result.sample_values.slice(0,10);
        var toptenIDs = result.otu_ids.slice(0,10);        
        var bargraph ={
            y: toptenIDs.sort((a,b)=> b-a),
            x: topten,
            type: "bar",
            orientation: "h",
            text: result.otu_labels
        };
        var layout = {
           yaxis: {
            tickvals: toptenIDs   
           }
        };
        Plotly.newPlot("bar", [bargraph], layout)
        var bargraph = d3.select("#bar")
// Gauge Chart
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var gaugedata = [{
            domain: {x: [0,1], y: [0,1]},
            type: "indicator",
            mode: "gauge+number",
            value: result.wfreq,
            delta: {reference: 380},
            title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 15}},
            gauge:{
                axis: {range: [null, 9]},
                bar: {color: "rosybrown"},
                steps: [
                    {range: [0, .5], color: "blanchedalmond"},
                    {range: [.5, 2.5], color: "bisque"},
                    {range: [2.5, 4.5], color: "antiquewhite"},
                    {range: [4.5, 6.5], color: "beige"},
                    {range: [6.5, 8.5], color: "cornsilk"},
                    {range: [8.5, 10], color: "mistyrose"}
                ],
            }
        }]
        var layout = {width: 450, height: 300, margin: {t:0, b:0}};
        Plotly.newPlot('gauge', gaugedata, layout)
        var gaugedata = d3.select("#gauge")
// Bubble chart
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var results = resultArray[0];
        var bubbles ={
            x: results.otu_ids,
            y: results.sample_values,
            mode: "markers",
            text: results.otu_labels,
            marker: {
                size: results.sample_values,
                color: results.otu_ids 
            }
       };            
            var layout = {
                xaxis: {
                    title: "OTU ID"
                }
            };

        
        Plotly.newPlot("bubble", [bubbles], layout)
        var bubbles = d3.select("#bubble")
    });
}
optionChanged(940);
