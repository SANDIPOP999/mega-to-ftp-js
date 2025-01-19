const { Downloader } = require('megajs');
const ftp = require('basic-ftp');

// Hard-coded FTP credentials
const FTP_CREDENTIALS = {
    host: "upload24.vidoza.net",
    user: "hipanime",
    password: "3b4f17fce0d7b7dca085a86c0452a191",
    secure: false, // Set to true if you require secure FTP
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send({ error: 'Only POST requests are allowed' });
    }

    const { megaLink, desiredFileName } = req.body;

    if (!megaLink || !desiredFileName) {
        return res.status(400).send({ error: 'Mega link and desired file name are required.' });
    }

    try {
        // Download the file from Mega
        const mega = Downloader.fromURL(megaLink);
        const fileBuffer = await new Promise((resolve, reject) => {
            const chunks = [];
            mega.on('data', chunk => chunks.push(chunk));
            mega.on('end', () => resolve(Buffer.concat(chunks)));
            mega.on('error', reject);
        });

        // Connect to the FTP server and upload the renamed file
        const ftpClient = new ftp.Client();
        await ftpClient.access(FTP_CREDENTIALS);

        await ftpClient.uploadFrom(fileBuffer, desiredFileName);
        ftpClient.close();

        res.status(200).send({ message: 'File uploaded successfully with the new name!' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
