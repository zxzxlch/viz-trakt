import React, { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const { data, error } = useSWR(`/api/search?${new URLSearchParams({ q: query }).toString()}`);

  useEffect(() => {
    console.log('response: ');
    console.log(data);
  });

  return <input type="search" onChange={(e) => setQuery(e.target.value)} />;
}
