// Configuration: The RSS Feeds
// We use api.rss2json.com to convert XML feeds to JSON and bypass CORS issues.
const FEED_URLS = {
    analytics: 'https://blog.google/products/marketingplatform/analytics/rss/',
    looker: 'https://cloud.google.com/feeds/looker-release-notes.xml' 
};

// Note: rss2json has a free tier limit. For a personal dashboard, it is usually sufficient.
const API_BASE = 'https://api.rss2json.com/v1/api.json?rss_url=';

// Update the "Last Updated" timestamp
document.getElementById('last-updated').innerText = `Last updated: ${new Date().toLocaleString()}`;

async function fetchFeed(feedName, url, elementId) {
    const container = document.getElementById(elementId);
    
    try {
        const response = await fetch(`${API_BASE}${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status === 'ok') {
            container.innerHTML = ''; // Clear loader
            
            data.items.forEach(item => {
                const date = new Date(item.pubDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                });

                // Create HTML for each item
                const article = document.createElement('div');
                article.className = 'feed-item';
                
                // Clean up description (remove images/complex HTML for cleaner look)
                const cleanDesc = item.description.replace(/<img[^>]*>/g, "").replace(/<[^>]+>/g, ' ').substring(0, 150) + '...';

                article.innerHTML = `
                    <span class="item-date">${date}</span>
                    <a href="${item.link}" target="_blank" class="item-title">${item.title}</a>
                    <p class="item-desc">${cleanDesc}</p>
                `;
                
                container.appendChild(article);
            });
        } else {
            throw new Error('Feed status failed');
        }
    } catch (error) {
        console.error(`Error fetching ${feedName}:`, error);
        container.innerHTML = `
            <div style="padding: 1rem; color: red; text-align: center;">
                Failed to load updates.<br>
                <a href="${url}" target="_blank">Click here to view feed directly</a>
            </div>
        `;
    }
}

// Initialize feeds
fetchFeed('Google Analytics', FEED_URLS.analytics, 'ga-feed');
fetchFeed('Looker', FEED_URLS.looker, 'looker-feed');
