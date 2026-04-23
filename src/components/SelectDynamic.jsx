import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

function SelectDynamic({
    selectData = [],
    placeholder = "Select an option",
    value,
    onChange,
    multiple = false,
    loading = false,
    isHasCount = false, // <-- new prop
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [internalValues, setInternalValues] = useState([])
    const wrapperRef = useRef(null)

    const selectedValues = Array.isArray(value) ? value : internalValues

    const selectedText = useMemo(() => {
        if (!selectedValues.length) return placeholder

        const labels = selectData
            .filter((item) => selectedValues.includes(item.value))
            .map((item) => item.data)

        const visibleCount = 2
        if (labels.length <= visibleCount) {
            return labels.join(", ")
        }

        const remainingCount = labels.length - visibleCount
        return `${labels.slice(0, visibleCount).join(", ")} +${remainingCount} more`
    }, [selectedValues, selectData, placeholder])

    const toggleMultiValue = (itemValue) => {
        const nextValues = selectedValues.includes(itemValue)
            ? selectedValues.filter((v) => v !== itemValue)
            : [...selectedValues, itemValue]

        if (!Array.isArray(value)) {
            setInternalValues(nextValues)
        }

        if (onChange) onChange(nextValues)
    }

    useEffect(() => {
        if (!multiple) return

        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [multiple])

    if (multiple) {
        return (
            <div ref={wrapperRef} className="relative w-fit min-w-56">
                <button
                    type="button"
                    disabled={loading}
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="border-input bg-transparent flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className={selectedValues.length ? "text-foreground" : "text-muted-foreground"}>
                        {loading ? "Loading..." : selectedText}
                    </span>
                    <span className="ml-2 text-xs opacity-70">▼</span>
                </button>

                {isOpen && !loading && (
                    <div className="bg-popover absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border p-1 shadow-md">
                        {!selectData.length && (
                            <div className="text-muted-foreground px-2 py-1.5 text-sm">No options available</div>
                        )}
                        {selectData.map((item) => {
                            const checked = selectedValues.includes(item.value)

                            return (
                                <div
                                    key={item.value}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => toggleMultiValue(item.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault()
                                            toggleMultiValue(item.value)
                                        }
                                    }}
                                    className="hover:bg-accent flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm"
                                >
                                    <Checkbox
                                        checked={checked}
                                        onCheckedChange={() => toggleMultiValue(item.value)}
                                        className="pointer-events-none"
                                    />
                                    <span className="flex-1">{item.data}</span>

                                    {/* Count badge */}
                                    {isHasCount && item.count !== undefined && (
                                        <span className="bg-muted text-muted-foreground ml-auto rounded-full px-2 py-0.5 text-xs font-medium">
                                            {item.count}
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        )
    }

    return (
        <Select value={value} onValueChange={onChange} disabled={loading}>
            <SelectTrigger className="w-fit">
                <SelectValue placeholder={loading ? "Loading..." : placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {!selectData.length && (
                        <div className="text-muted-foreground px-2 py-1.5 text-sm">No options available</div>
                    )}
                    {selectData.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            <span className="flex items-center gap-2">
                                <span>{item.data}</span>

                                {/* Count badge */}
                                {isHasCount && item.count !== undefined && (
                                    <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                                        {item.count}
                                    </span>
                                )}
                            </span>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default SelectDynamic