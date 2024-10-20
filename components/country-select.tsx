"use client"

import * as React from "react"
import Image from "next/image"
import { CaretSortIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const countries = [
  {
    name: "Antigua and Barbuda",
    code: "AG",
    flag: "🇦🇬",
  },
  {
    name: "Argentina",
    code: "AR",
    flag: "🇦🇷",
  },
  {
    name: "Bahamas",
    code: "BS",
    flag: "🇧🇸",
  },
  {
    name: "Barbados",
    code: "BB",
    flag: "🇧🇧",
  },
  {
    name: "Belize",
    code: "BZ",
    flag: "🇧🇿",
  },
  {
    name: "Bolivia",
    code: "BO",
    flag: "🇧🇴",
  },
  {
    name: "Brazil",
    code: "BR",
    flag: "🇧🇷",
  },
  {
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
  },
  {
    name: "Chile",
    code: "CL",
    flag: "🇨🇱",
  },
  {
    name: "Colombia",
    code: "CO",
    flag: "🇨🇴",
  },
  {
    name: "Costa Rica",
    code: "CR",
    flag: "🇨🇷",
  },
  {
    name: "Cuba",
    code: "CU",
    flag: "🇨🇺",
  },
  {
    name: "Dominica",
    code: "DM",
    flag: "🇩🇲",
  },
  {
    name: "Dominican Republic",
    code: "DO",
    flag: "🇩🇴",
  },
  {
    name: "Ecuador",
    code: "EC",
    flag: "🇪🇨",
  },
  {
    name: "El Salvador",
    code: "SV",
    flag: "🇸🇻",
  },
  {
    name: "Grenada",
    code: "GD",
    flag: "🇬🇩",
  },
  {
    name: "Guatemala",
    code: "GT",
    flag: "🇬🇹",
  },
  {
    name: "Guyana",
    code: "GY",
    flag: "🇬🇾",
  },
  {
    name: "Haiti",
    code: "HT",
    flag: "🇭🇹",
  },
  {
    name: "Honduras",
    code: "HN",
    flag: "🇭🇳",
  },
  {
    name: "Jamaica",
    code: "JM",
    flag: "🇯🇲",
  },
  {
    name: "Mexico",
    code: "MX",
    flag: "🇲🇽",
  },
  {
    name: "Nicaragua",
    code: "NI",
    flag: "🇳🇮",
  },
  {
    name: "Panama",
    code: "PA",
    flag: "🇵🇦",
  },
  {
    name: "Paraguay",
    code: "PY",
    flag: "🇵🇾",
  },
  {
    name: "Peru",
    code: "PE",
    flag: "🇵🇪",
  },
  {
    name: "Saint Kitts and Nevis",
    code: "KN",
    flag: "🇰🇳",
  },
  {
    name: "Saint Lucia",
    code: "LC",
    flag: "🇱🇨",
  },
  {
    name: "Saint Vincent and the Grenadines",
    code: "VC",
    flag: "🇻🇨",
  },
  {
    name: "Suriname",
    code: "SR",
    flag: "🇸🇷",
  },
  {
    name: "Trinidad and Tobago",
    code: "TT",
    flag: "🇹🇹",
  },
  {
    name: "United States",
    code: "US",
    flag: "🇺🇸",
  },
  {
    name: "Uruguay",
    code: "UY",
    flag: "🇺🇾",
  },
  {
    name: "Venezuela",
    code: "VE",
    flag: "🇻🇪",
  },
  {
    name: "Spain",
    code: "ES",
    flag: "🇪🇸",
  },
]

export function CountrySelect({
  value,
  setValue,
}: {
  value: string
  setValue: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between gap-2"
        >
          {value ? (
            <>
              <Image
                src={`https://flag.vercel.app/s/${value.toUpperCase()}.svg`}
                width={16}
                height={12}
                alt="Flag of country"
                className="object-contain"
              />
              {
                countries.find(
                  (country) => country.code.toLowerCase() === value
                )?.name
              }
            </>
          ) : (
            "Select a country..."
          )}
          <CaretSortIcon className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." className="h-9" />
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.code}
                  onSelect={(currentValue) => {
                    setValue(currentValue)
                    setOpen(false)
                  }}
                >
                  <div className="flex gap-2">
                    <Image
                      src={`https://flag.vercel.app/s/${country.code}.svg`}
                      width={16}
                      height={12}
                      alt={`Flag of ${country.name}`}
                      className="object-contain"
                    />
                    {country.name}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
