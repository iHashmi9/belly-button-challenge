// Initializes the page with a default plot
function init() {
  // Assuming you have an initial sample ID (e.g., 940)
  updatePlots(940);
}

/// Call updatePlots() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", function () {
  let selectedSample = d3.select("#selDataset").property("value");
  console.log(selectedSample);  // Move this line inside the event listener
  updatePlots(selectedSample);
});

// This function is called when a dropdown menu item is selected
function updatePlots(selectedSample) {
  // Fetch data from the specified URL
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(responseData => {
    // Assuming responseData is an object with properties: names, metadata, samples
    // If your data structure is different, adjust accordingly

    // Extract the selected sample data
    let selectedData = responseData.samples.find(sample => sample.id === selectedSample);

    // Check if selectedData is defined before accessing its properties
    if (selectedData) {
      // Update the bar chart
      let barTrace = {
        x: selectedData.sample_values.slice(0, 10).reverse(),
        y: selectedData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
        text: selectedData.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      };

      let barData = [barTrace];

      let barLayout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU ID" }
      };

      Plotly.newPlot("chart", barData, barLayout);

      // Update the bubble chart
      let bubbleTrace = {
        x: selectedData.otu_ids,
        y: selectedData.sample_values,
        mode: 'markers',
        marker: {
          size: selectedData.sample_values,
          color: selectedData.otu_ids,
          colorscale: 'Viridis'
        },
        text: selectedData.otu_labels
      };

      let bubbleData = [bubbleTrace];

      let bubbleLayout = {
        title: 'Bubble Chart for Each Sample',
        xaxis: { title: 'OTU IDs' },
        yaxis: { title: 'Sample Values' },
        showlegend: false
      };

      Plotly.newPlot('bubble', bubbleData, bubbleLayout);

      // Update the sample metadata display
      let metadataDiv = d3.select("#sample-metadata");
      metadataDiv.html("");

      // Find the selected metadata
      let selectedMetadata = responseData.metadata.find(meta => meta.id === parseInt(selectedSample));

      if (selectedMetadata) {
        // Iterate through metadata and append key-value pairs to the HTML
        Object.entries(selectedMetadata).forEach(([key, value]) => {
          metadataDiv.append("p").text(`${key}: ${value}`);
        });

        // Log information to the console
        console.log("Metadata:", selectedMetadata);
      } else {
        metadataDiv.append("p").text("Metadata not available for the selected sample.");
        console.warn("Metadata not found for the selected ID:", selectedSample);
      }
    } else {
      console.error("Sample data not found for the selected ID:", selectedSample);
    }
  }).catch(error => {
    console.error("Error fetching data:", error);
  });
}

// Call init() to initialize the page with a default plot
//init();