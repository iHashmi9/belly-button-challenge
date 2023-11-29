
d3.selectAll("#selDataset").on("change", function () {
  let selectedSample = d3.select("#selDataset").property("value");
  updatePlotly(selectedSample);
});

// Define the optionChanged function
function optionChanged(selectedSample) {
  updatePlotly(selectedSample);
}

// Function to update the plots and metadata
function updatePlotly(selectedSample) {
  // Fetch data from the specified URL
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(responseData => {

    // Update the dropdown menu
    updateDropdown(responseData);

    // Extract the selected sample data
    let selectedData = responseData.samples.find(sample => sample.id === selectedSample);

    // Check if selectedData is defined before accessing its properties
    if (selectedData) {
      // Bar chart
      let barTrace = {
        x: selectedData.sample_values.slice(0, 10).reverse(),
        y: selectedData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
        text: selectedData.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      };

      let barData = [barTrace];

      let barLayout = {
        margin: { t: 50, b: 50, l: 100, r: 100 } // Adjusted margins for centering
      };

      Plotly.newPlot("bar", barData, barLayout);

      // Bubble chart
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
        xaxis: { title: 'OTU IDs' },
        showlegend: false,
        margin: { t: 50, b: 50, l: 100, r: 100 } // Adjusted margins for centering
      };

      Plotly.newPlot('bubble', bubbleData, bubbleLayout);

      // Update the sample metadata display
      let metadataDiv = d3.select("#sample-metadata");
      metadataDiv.html("");

      // Find the selected metadata
      let selectedMetadata = responseData.metadata.find(meta => meta.id === parseInt(selectedSample));

      // Check if selectedMetadata is defined before accessing its properties
      if (selectedMetadata) {
        // Iterate through metadata and append key-value pairs to the HTML
        Object.entries(selectedMetadata).forEach(([key, value]) => {
          metadataDiv.append("p").text(`${key}: ${value}`);
        });
      }
    }
  });
}

// Function to update the dropdown menu
function updateDropdown(responseData) {
  let dropdown = d3.select("#selDataset");

  let dropdownOptions = responseData.names;

  // Clear existing options
  dropdown.html("");

  dropdownOptions.forEach(option => {
    dropdown.append("option").text(option).property("value", option);
  });
}

// Call updatePlotly() to initialize the page with a default plot
updatePlotly(940);