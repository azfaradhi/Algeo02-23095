'use client';

import { useEffect, useState } from 'react';
import { fetchGreeting } from '../services/api';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [greeting, setGreeting] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getGreeting = async () => {
      const data = await fetchGreeting();
      setGreeting(data.Hello);
    };
    getGreeting();
  }, []);

  const handleRedirect = (path: string) => {
    router.push(path);
  }

  return (
    <div>
      <p>Greeting: {greeting}</p>
      <button onClick={() => handleRedirect('/audioPage')}>Go to Audio Page</button>
      <button onClick={() => handleRedirect('/imagePage')}>Go to Image Page</button>
    </div>
  );
}