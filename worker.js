// Listen for messages from the main thread
onmessage = function(event) {
    const apiUrl = event.data;
    // Fetch the large JSON file from the Amiibo API
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Process the data (e.g., only keep amiibo with a specific series)
        const processedData = data.amiibo.filter(item => item.amiiboSeries === 'Super Smash Bros.');
        // Send the processed data back to the main thread
        postMessage(processedData);
    })
    .catch(error => {
        // Send the error back to the main thread
        postMessage({ error: error.message });
    });
};