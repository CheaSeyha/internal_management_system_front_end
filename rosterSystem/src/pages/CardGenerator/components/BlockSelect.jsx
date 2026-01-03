import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState, useMemo } from "react"
import { X } from "lucide-react"

export default function BlockSelect({ blocks = [], onSelect, onRemove, selectedBlocks = [] }) {
    const [search, setSearch] = useState("");

    const safeSelectedBlocks = Array.isArray(selectedBlocks) ? selectedBlocks : [];

    // Check if building or any of its rooms are selected
    const isBuildingSelected = (buildingName) => {
        const found = safeSelectedBlocks.find(b => b.building === buildingName);
        return !!found;
    };

    const isRoomSelected = (buildingName, roomName) => {
        const found = safeSelectedBlocks.find(b => b.building === buildingName);
        return !!(found && found.rooms.includes(roomName));
    };

    const handleBuildingCheck = (checked, building) => {
        if (checked) {
            onSelect(building);
        } else {
            if (onRemove) onRemove(building);
        }
    };

    const handleRoomCheck = (checked, building, room) => {
        const roomValue = `${building}-${room}`;
        if (checked) {
            onSelect(roomValue);
        } else {
            if (onRemove) onRemove(building, room);
        }
    };

    const filteredBlocks = useMemo(() => {
        if (!search) return blocks;
        return blocks.filter(b =>
            b.building.toLowerCase().includes(search.toLowerCase()) ||
            b.room.some(r => r.toLowerCase().includes(search.toLowerCase()))
        );
    }, [blocks, search]);

    return (
        <Popover>
            <label className="label">
                <span className="label-text">
                    Select Blocks
                </span>
            </label>
            <PopoverTrigger asChild>
                <div role="button" tabIndex={0} className="flex min-h-[40px] w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer h-auto flex-wrap gap-2">
                    {safeSelectedBlocks.length > 0 ? (
                        safeSelectedBlocks.map((b) => {
                            if (b.rooms.length === 0) {
                                return (
                                    <span key={b.building} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                                        {b.building}
                                        <div
                                            role="button"
                                            className="hover:bg-red-500 hover:text-white rounded-full p-0.5 cursor-pointer transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemove && onRemove(b.building);
                                            }}
                                        >
                                            <X size={14} />
                                        </div>
                                    </span>
                                )
                            }
                            return b.rooms.map(room => (
                                <span key={`${b.building}-${room}`} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                                    {`${b.building}-${room}`}
                                    <div
                                        role="button"
                                        className="hover:bg-red-500 hover:text-white rounded-full p-0.5 cursor-pointer transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove && onRemove(b.building, room);
                                        }}
                                    >
                                        <X size={14} />
                                    </div>
                                </span>
                            ))
                        })
                    ) : (
                        <span className="text-muted-foreground">Select Blocks</span>
                    )}
                </div>
            </PopoverTrigger>

            <PopoverContent className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }} align="start">
                <div className="p-2">
                    <Input
                        placeholder="Search blocks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-2"
                    />
                </div>

                <div className="max-h-[300px] overflow-y-auto p-2 pt-0 space-y-2">
                    {filteredBlocks.length === 0 ? (
                        <p className="text-sm text-center text-muted-foreground p-2">No blocks found.</p>
                    ) : (
                        filteredBlocks.map((block) => (
                            <div key={block.building} className="space-y-1">
                                {/* Building Row */}
                                <div className={`flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent/50 ${isBuildingSelected(block.building) ? 'bg-accent' : ''}`}>
                                    <Checkbox
                                        id={`building-${block.building}`}
                                        checked={isBuildingSelected(block.building)}
                                        onCheckedChange={(checked) => handleBuildingCheck(checked, block.building)}
                                    />
                                    <Label
                                        htmlFor={`building-${block.building}`}
                                        className="flex-1 cursor-pointer font-semibold"
                                    >
                                        {block.building}
                                    </Label>
                                </div>

                                {/* Rooms List */}
                                {block.room && block.room.length > 0 && (
                                    <div className="ml-6 space-y-1 border-l-2 border-muted pl-2">
                                        {block.room.map((room) => {
                                            const roomValue = `${block.building}-${room}`;
                                            const checked = isRoomSelected(block.building, room);

                                            // Hide rooms that don't match search if search is active (unless building matches)
                                            if (search &&
                                                !room.toLowerCase().includes(search.toLowerCase()) &&
                                                !block.building.toLowerCase().includes(search.toLowerCase())) {
                                                return null;
                                            }

                                            return (
                                                <div key={room} className="flex items-center gap-2 px-2 py-1 rounded-sm hover:bg-accent/50">
                                                    <Checkbox
                                                        id={`room-${roomValue}`}
                                                        checked={checked}
                                                        onCheckedChange={(isChecked) => handleRoomCheck(isChecked, block.building, room)}
                                                    />
                                                    <Label
                                                        htmlFor={`room-${roomValue}`}
                                                        className="flex-1 cursor-pointer text-sm"
                                                    >
                                                        {room}
                                                    </Label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
