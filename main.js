// Register the Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch(function(error) {
        console.error('Service Worker registration failed:', error);
    });
}

// Create a new Web Worker instance
const worker = new Worker('worker.js');
// Specify the API URL for fetching the amiibo data
const apiUrl = 'https://www.amiiboapi.com/api/amiibo/';

// Send the API URL to the worker
worker.postMessage(apiUrl);

// Store the fetched data to use for filtering
let amiiboData = [];

// Listen for messages from the worker
worker.onmessage = function(event) {
    const data = event.data;
    if (data.error) {
        console.error('Error fetching data:', data.error);
return; }
    // Log the processed data or display it on the page
    //console.log('Processed data:', data);
    // Store the full data for filtering
    amiiboData = data;
    // Initially display the full list of amiibos
    displayData(amiiboData);
};

// Function to display the processed data in the DOM
function displayData(data, searchTerm) {
    const output = document.getElementById('output');
    output.innerHTML = '';
    data.forEach(item => {
        const div = document.createElement('div');
        let myName = item.name;
        let myGameSeries = item.gameSeries;
        let myAmiiboSeries = item.amiiboSeries;

        if (searchTerm) {
            myName = highlightMatches(myName, searchTerm);
            myGameSeries = highlightMatches(myGameSeries, searchTerm);
            myAmiiboSeries = highlightMatches(myAmiiboSeries, searchTerm);
        }

        let myContent = `
            <p>Name: ${myName}</p>
            <p>Game Series: ${myGameSeries}</p>
            <p>Amiibo Series: ${myAmiiboSeries}</p>
        `;
        div.innerHTML = myContent;

        // Create an image element for each Amiibo
        const img = document.createElement('img');
        img.src = item.image; // Amiibo image URL from the API
        img.alt = item.name;

        div.appendChild(img);
        output.appendChild(div);
    });
}

// Add event listener for search input
document.getElementById('search').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    // Filter the amiibo data based on the search term
    const filteredData = amiiboData.filter(amiibo =>
        amiibo.name.toLowerCase().includes(searchTerm) ||
        amiibo.gameSeries.toLowerCase().includes(searchTerm) ||
        amiibo.amiiboSeries.toLowerCase().includes(searchTerm)
    );
    // Display the filtered data
    displayData(filteredData, event.target.value);
});

// Function to wrap matched terms with a span
function highlightMatches(text, term) {
    //console.log(text, term)
    const regex = new RegExp(`(${term})`, 'gi'); // 'g' for global, 'i' for case-insensitive
    
    return text.replace(regex, (match) => {
      return `<span style="background-color: yellow;">${match}</span>`; // Wrap in a span without changing the case
    });
  }