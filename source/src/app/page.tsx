import { useEffect, useState } from 'react';
import { fetchGreeting } from '../services/api';

export default function HomePage() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = async () => {
      const data = await fetchGreeting();
      setGreeting(data.Hello);
    };
    getGreeting();
  }, []);

  return (
    <div>
      <p>Greeting: {greeting}</p>
    </div>
  );
}