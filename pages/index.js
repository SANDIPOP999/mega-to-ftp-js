import { useState } from 'react';

export default function Home() {
    const [megaLink, setMegaLink] = useState('');
    const [desiredFileName, setDesiredFileName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/handler', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ megaLink, desiredFileName }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('File uploaded successfully!');
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
            <h1>Upload File from Mega to FTP</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Mega Link:
                    <input
                        type="url"
                        value={megaLink}
                        onChange={(e) => setMegaLink(e.target.value)}
                        required
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                </label>
                <label>
                    Desired File Name:
                    <input
                        type="text"
                        value={desiredFileName}
                        onChange={(e) => setDesiredFileName(e.target.value)}
                        required
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                </label>
                <button type="submit" style={{ display: 'block', margin: '20px 0', padding: '10px' }}>
                    Upload File
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
                          }
