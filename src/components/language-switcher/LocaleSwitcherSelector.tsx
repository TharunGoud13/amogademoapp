'use client';

import clsx from 'clsx';
import { useTransition } from 'react';
import { Locale } from '@/i18n/config';
import { setUserLocale } from '@/services/locale';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label
}: Props) {
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className="relative">
      <Select defaultValue={defaultValue} onValueChange={onChange}>
      <SelectTrigger className="bg-secondary flex gap-2.5">
          <FontAwesomeIcon className='text-primary' icon={faGlobe}/>
          <h1>{defaultValue.toUpperCase()}</h1>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
            >
            {item.label}
            </SelectItem>
          ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}