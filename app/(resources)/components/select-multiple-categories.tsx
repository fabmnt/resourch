'use client'

import {
  Combobox,
  ComboboxAnchor,
  ComboboxBadgeItem,
  ComboboxBadgeList,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import { Tables } from '@/database.types'
import { ChevronDown } from 'lucide-react'

interface SelectMultipleCategoriesProps {
  categories: Tables<'categories'>[]
  selectedCategoriesIds: string[]
  onChange: (value: string[]) => void
}

export function SelectMultipleCategories({
  categories,
  selectedCategoriesIds,
  onChange,
}: SelectMultipleCategoriesProps) {
  return (
    <Combobox
      value={selectedCategoriesIds}
      onValueChange={(e) => onChange(e)}
      className='w-full'
      multiple
    >
      <ComboboxLabel>Categories</ComboboxLabel>
      <ComboboxAnchor className='h-full min-h-10 flex-wrap px-3 py-2'>
        <ComboboxBadgeList>
          {selectedCategoriesIds.map((item) => {
            const option = categories.find((category) => category.id.toString() === item)
            if (!option) return null

            return (
              <ComboboxBadgeItem
                key={item}
                value={item}
              >
                {option.title}
              </ComboboxBadgeItem>
            )
          })}
        </ComboboxBadgeList>
        <ComboboxInput
          placeholder='Select categories...'
          className='h-auto min-w-20 flex-1'
        />
        <ComboboxTrigger className='absolute top-3 right-2'>
          <ChevronDown className='h-4 w-4' />
        </ComboboxTrigger>
      </ComboboxAnchor>
      <ComboboxContent>
        <ComboboxEmpty>No categories found.</ComboboxEmpty>
        {categories.map((category) => (
          <ComboboxItem
            key={category.id}
            value={category.id.toString()}
          >
            {category.title}
          </ComboboxItem>
        ))}
      </ComboboxContent>
    </Combobox>
  )
}
