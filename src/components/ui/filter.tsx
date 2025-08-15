'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Calendar as CalendarIcon, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Field =
  | { label: string; name: string; type: 'text' | 'number' | 'email' }
  | { label: string; name: string; type: 'dateRange' }
  | { label: string; name: string; type: 'select'; options: { label: string; value: string }[] }

type FilterPanelProps = {
  fields: Field[]
  onApply?: (values?: Record<string, unknown>) => void
  defaultOpen?: boolean
  labelWidthClass?: string
}

export function FilterPanel({
  fields,
  onApply,
  defaultOpen = true,
  labelWidthClass = 'w-32',
}: FilterPanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  const initialValues = useMemo(() => {
    const initialValues: Record<string, unknown> = {}

    fields.forEach(field => {
      if (field.type === 'dateRange') {
        initialValues[field.name] = [undefined, undefined]
      } else {
        initialValues[field.name] = ''
      }
    })

    return initialValues
  }, [fields])

  const [values, setValues] = useState<Record<string, unknown>>(initialValues)

  useEffect(() => setValues(initialValues), [])

  const setField = (name: string, val: unknown) => {
    const next = { ...values, [name]: val }
    setValues(next)
  }

  const handleReset = () => {
    setValues(initialValues)
    onApply?.()
  }

  const mid = Math.ceil(fields.length / 2)
  const left = fields.slice(0, mid)
  const right = fields.slice(mid)

  return (
    <div className="w-full">
      <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
        <CollapsibleTrigger asChild>
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-50 hover:text-yellow-400 px-6"
            >
              Filter
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-3 rounded-lg p-4">
            <div className="mb-2 flex justify-between">
              <Label className="font-bold text-lg">Filter</Label>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary"
                onClick={() => setOpen(false)}
              >
                Sembunyikan
                <ChevronUp size={256} />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[left, right].map((col, ci) => (
                <div key={ci} className="flex flex-col gap-2">
                  {col.map((f) => {
                    if (f.type === 'dateRange') {
                      const [start, end] =
                        (values[f.name] as [
                          Date | undefined,
                          Date | undefined
                        ]) || []
                      return (
                        <div key={f.name} className={`flex items-center gap-2`}>
                          <Label className={`${labelWidthClass} min-w-0`}>
                            {f.label}
                          </Label>
                          <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="justify-start text-left font-normal w-full rounded-sm"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {start
                                    ? format(start, 'dd/MM/yyyy')
                                    : 'Pilih Tanggal'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent align="start" className="p-0">
                                <Calendar
                                  mode="single"
                                  selected={start}
                                  onSelect={(d) => setField(f.name, [d, end])}
                                />
                              </PopoverContent>
                            </Popover>

                            <span className="text-sm text-muted-foreground">
                              s/d
                            </span>

                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="justify-start text-left font-normal w-full rounded-sm"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {end
                                    ? format(end, 'dd/MM/yyyy')
                                    : 'Pilih Tanggal'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent align="start" className="p-0">
                                <Calendar
                                  mode="single"
                                  selected={end}
                                  onSelect={(d) => setField(f.name, [start, d])}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      )
                    }

                    if (f.type === 'select') {
                      return (
                        <div key={f.name} className="flex items-center gap-2">
                          <Label className={`${labelWidthClass} min-w-0`}>
                            {f.label}
                          </Label>
                          <Select
                            value={String(values[f.name] ?? '')}
                            onValueChange={(val) => setField(f.name, val)}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder={`Pilih ${f.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {f.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    }

                    // Text/number/email
                    return (
                      <div key={f.name} className="flex items-center gap-2">
                        <Label className={`${labelWidthClass} min-w-0`}>
                          {f.label}
                        </Label>
                        <Input
                          type={f.type}
                          value={String(values[f.name])}
                          onChange={(e) => setField(f.name, e.target.value)}
                          placeholder={`Masukkan ${f.label}`}
                          className="flex-1"
                        />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-500"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button onClick={() => onApply?.(values)}>Terapkan</Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
