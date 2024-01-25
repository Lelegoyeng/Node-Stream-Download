const axios = require('axios');
const fs = require('fs');
const url = 'https://media0.giphy.com/media/4SS0kfzRqfBf2/giphy.gif';
const writer = fs.createWriteStream('image.gif');

axios({
    method: 'get',
    url,
    responseType: 'stream'
}).then((response) => {
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
});

writer.on('finish', () => {
    console.log('\nFile downloaded successfully.');
});

writer.on('error', (err) => {
    console.error(err);
});
