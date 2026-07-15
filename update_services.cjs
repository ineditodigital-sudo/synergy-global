const https = require('https');

const API_URL = 'https://synergy.inedito.digital/api.php';

// Fetch current content
https.get(API_URL, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const content = JSON.parse(data);
        
        // Update the services items
        content.services = content.services || {};
        content.services.items = [
            { id: 1, title: 'Supply Chain & Distribution', desc: 'Sourcing, production, and distribution of goods throughout the Americas’ supply chain.', image: '/services/service1.png' },
            { id: 2, title: 'Trade & Investment Promotion', desc: 'Trade and investment promotion.', image: '/services/service2.png' },
            { id: 3, title: 'Investor Representation', desc: 'Representation of real estate and industrial investors.', image: '/services/service3.png' },
            { id: 4, title: 'Corporate Formation', desc: 'Formation of corporate entities in the United States, Canada, and Mexico.', image: '/services/service1.png' },
            { id: 5, title: 'Business Advocacy', desc: 'Advocacy for all businesses and real estate related companies in the U.S. and Mexico.', image: '/services/service2.png' },
            { id: 6, title: 'Legal Services', desc: 'Legal services in Mexico and abroad.', image: '/services/service3.png' }
        ];

        // Ensure header title/subtitle are correct
        content.services.header = content.services.header || {};
        content.services.header.title = 'Our Services';
        content.services.header.subtitle = 'The services, advice, and counsel we provide to our clients include:';

        // POST back to server
        const payload = JSON.stringify(content);
        const req = https.request(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (postRes) => {
            let postData = '';
            postRes.on('data', chunk => postData += chunk);
            postRes.on('end', () => {
                console.log('Update response:', postData);
            });
        });

        req.on('error', e => console.error(e));
        req.write(payload);
        req.end();
    });
}).on('error', e => console.error(e));
