import React, { useState, useEffect } from 'react';

const ChangeLog = () => {
    const [changelogContent, setChangelogContent] = useState('');

    useEffect(() => {
        const fetchChangelog = async () => {
            try {
                const response = await fetch('src/CHANGELOG.md');
                const content = await response.text();
                setChangelogContent(content);
            } catch (error) {
                // console.log('Error fetching changelog:', error);
            }
        };

        fetchChangelog();
    }, []);

    return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <pre style={{ fontSize: '14px', lineHeight: '1.5', margin: '10px', fontFamily: 'Verdana', overflow: 'auto', width: '100%', height: '100%' }}>
                {changelogContent}
            </pre>
        </div>
    );
};

export default ChangeLog;
