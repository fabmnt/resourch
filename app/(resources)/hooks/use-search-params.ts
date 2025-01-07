import { useQueryState } from 'nuqs'
import { useDebouncedCallback } from 'use-debounce'

export function useQuerySearchParams() {
  const [searchQuery, setSearchQuery] = useQueryState('q', {
    defaultValue: '',
    history: 'push',
    shallow: false,
    parse: (value) => value || '',
  })
  const setSearchQueryDebounced = useDebouncedCallback((query: string) => {
    setSearchQuery(query)
  }, 300)

  return {
    searchQuery,
    setSearchQueryDebounced,
  }
}
