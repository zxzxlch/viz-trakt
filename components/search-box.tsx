import React, { useState, useEffect } from 'react';
import useSWR from 'swr';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const { data, error } = useSWR(`/api/search?${new URLSearchParams({ q: query }).toString()}`);

  useEffect(() => {
    console.log('response: ');
    console.log(data);
  });

  return (
    <input
      type="search"
      placeholder="Search"
      className="w-full h-12 px-3 py-2 border-4 rounded-lg text-xl focus:outline-none focus:ring-1 focus:border-blue-300"
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
