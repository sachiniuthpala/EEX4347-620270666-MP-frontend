// src/components/TestConnection.js
import { useEffect } from 'react';

const TestConnection = () => {
    useEffect(() => {
        const testBackend = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/test');
                const data = await response.json();
                console.log('Backend response:', data);
            } catch (error) {
                console.error('Connection error:', error);
            }
        };

        testBackend();
    }, []);

    return <div>Testing backend connection...</div>;
};

export default TestConnection;

