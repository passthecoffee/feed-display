// Constants
const rssFeedURL = 'https://podcasts.files.bbci.co.uk/p05cmk38.rss';
const itemsPerPage = 5;

// Variables
let currentOffset = 0;
let podcastItems = [];

// DOM Elements
const podcastContainer = document.getElementById('podcast-container');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

// Fetch the RSS feed data
fetch(rssFeedURL)
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        
        podcastItems = Array.from(items).map(item => {
            return {
                title: item.querySelector('title').textContent,
                description: item.querySelector('description').textContent,
                listen: item.querySelector('enclosure').getAttribute('url'),
                image: item.querySelector('rss channel image')?.getAttribute('href'),
                duration: item.querySelector('duration')?.textContent,
                date: new Date(item.querySelector('pubDate').textContent),
            };
        });

        updatePodcastDisplay();
    })
    .catch(error => console.error('Error fetching RSS feed:', error));

// Function to update the displayed podcast items
function updatePodcastDisplay() {
    const startIndex = currentOffset * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedItems = podcastItems.slice(startIndex, endIndex);

    // Clear the container
    podcastContainer.innerHTML = '';

    // Display the items
    displayedItems.forEach(item => {
        const itemDiv = document.createElement('ul');
        itemDiv.innerHTML = `
        <div class="artwork"><img src="${item.image}"/></div>
        <div class="music-content">
          <div class="title">${item.title}</div>
          <div class="date">${item.date}</div> | 
          <div class="duration">${item.duration}sec</div>
          <div class="description"> <p>${item.description}</p>
          <br><a href="${item.listen}">Read More ></a> </div>
        </div>
        <div class="audio">
            <audio controls>
                <source src="${item.listen}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        </div>

        <!-- Add other HTML elements for displaying additional data -->
        `;
        podcastContainer.appendChild(itemDiv);
    });

    // Disable/Enable navigation buttons based on the offset
    prevButton.disabled = currentOffset === 0;
    nextButton.disabled = endIndex >= podcastItems.length;
}

// Event listeners for navigation buttons
prevButton.addEventListener('click', () => {
    if (currentOffset > 0) {
        currentOffset--;
        updatePodcastDisplay();
    }
});

nextButton.addEventListener('click', () => {
    if (currentOffset < Math.ceil(podcastItems.length / itemsPerPage) - 1) {
        currentOffset++;
        updatePodcastDisplay();
    }
});
