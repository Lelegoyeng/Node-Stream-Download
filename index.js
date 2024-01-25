const axios = require('axios');
const fs = require('fs');
const path = require('path');

const data = [
    { url: 'https://media0.giphy.com/media/4SS0kfzRqfBf2/giphy.gif' },
    { url: 'https://media0.giphy.com/media/4SS0kfzRqfBf2/giphy.gif' },
    { url: 'https://media0.giphy.com/media/4SS0kfzRqfBf2/giphy.gif' },
];

const downloadDirectory = path.join(__dirname, 'download'); // Jalur ke folder download

const downloadFile = async (url, filename) => {
    const writer = fs.createWriteStream(path.join(downloadDirectory, filename)); // Meng

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    const totalSize = parseInt(response.headers['content-length'], 10);
    let downloadedSize = 0;

    response.data.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const progress = (downloadedSize / totalSize) * 100;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Downloading... ${Math.round(progress)}%`);
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

const loop = async () => {
    for (let i = 0; i < data.length; i++) {
        const result = data[i];
        const filename = path.basename(result.url).split('.')[0] + i + '.gif';
        try {
            console.log(`Downloading ${result.url} to ${filename}`);
            await downloadFile(result.url, filename);
            console.log(`File downloaded successfully: ${filename}`);
        } catch (error) {
            console.error(`Error downloading ${result.url}:`, error.message);
        }
    }
};

loop();
