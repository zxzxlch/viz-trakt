import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import Autosuggest from 'react-autosuggest';
import { useDebouncedState } from '../lib/hooks';
import { ISearchResult } from '../pages/api/search';
import theme from './search-box.module.css';

export default function SearchBox() {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQueryDebounced, setSearchQuery] = useDebouncedState('', 500);
  const { data: suggestions = [], error } = useSWR(
    `/api/search?${new URLSearchParams({ q: searchQuery }).toString()}`,
  );

  const onSuggestionsFetchRequested = ({ value, reason }) => {
    // Don't change search query if user pressed up/down, if not suggestions will change
    if (reason === 'input-changed' || reason === 'input-focused') setSearchQueryDebounced(value);
    return suggestions;
  };

  const onSuggestionsClearRequested = () => {
    setSearchQuery('');
  };

  const getSuggestionValue = (suggestion: ISearchResult) => {
    return suggestion.title;
  };

  const renderInputComponent = (inputProps) => (
    <div className={theme.inputGroup}>
      <div className={theme.searchIcon}>
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input {...inputProps} />
    </div>
  );

  const renderSuggestion = (suggestion: ISearchResult, { query, isHighlighted }) => {
    const { slug, title, year, mediaType } = suggestion;
    return (
      <Link href={`/shows/${slug}`}>
        <a className="flex items-center">
          <div className="flex-none w-12 mr-2 text-xs font-semibold tracking-wide uppercase text-gray-400">
            {mediaType == 'movie' ? 'Movie' : 'Show'}
          </div>
          <div className="flex-1 text-lg">{`${title} (${year})`}</div>
        </a>
      </Link>
    );
  };

  const inputProps = {
    placeholder: 'Search movie or TV show',
    value: inputValue,
    onChange: (_e, { newValue }) => {
      setInputValue(newValue);
    },
  };

  return (
    <Autosuggest
      theme={theme}
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderInputComponent={renderInputComponent}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  );
}
