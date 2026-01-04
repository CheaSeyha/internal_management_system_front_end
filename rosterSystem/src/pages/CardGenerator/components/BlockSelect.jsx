import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState, useMemo, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function BlockSelect({ blocks = [], onSelect, onRemove, selectedBlocks = [] }) {
    const [search, setSearch] = useState("");
    const [view, setView] = useState("all"); // 'all' or 'custom'
    const [customGroups, setCustomGroups] = useState(() => {
        const saved = localStorage.getItem("cardgen-custom-blocks");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse custom blocks", e);
                return [];
            }
        }
        return [];
    });
    const [newGroupName, setNewGroupName] = useState("");

    // Save custom groups to local storage whenever they change
    useEffect(() => {
        localStorage.setItem("cardgen-custom-blocks", JSON.stringify(customGroups));
    }, [customGroups]);

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
            setSearch("");
        } else {
            if (onRemove) onRemove(building);
        }
    };

    const handleRoomCheck = (checked, building, room) => {
        const roomValue = `${building}-${room}`;
        if (checked) {
            onSelect(roomValue);
            setSearch("");
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

    const handleSaveGroup = () => {
        if (!newGroupName.trim()) {
            toast.error("Please enter a name for the group");
            return;
        }
        if (safeSelectedBlocks.length === 0) {
            toast.error("No blocks selected to save");
            return;
        }

        const newGroup = {
            id: Date.now(),
            name: newGroupName,
            blocks: safeSelectedBlocks
        };

        setCustomGroups([...customGroups, newGroup]);
        setNewGroupName("");
        toast.success("Custom Group saved!");
    };

    const handleApplyGroup = (group) => {
        // We need to iterate through the saved blocks and apply them.
        // The structure of saved blocks is the same as safeSelectedBlocks: [{ building, rooms: [] }]

        group.blocks.forEach(b => {
            if (b.rooms.length === 0) {
                // Whole building
                onSelect(b.building);
            } else {
                // Specific rooms
                b.rooms.forEach(room => {
                    onSelect(`${b.building}-${room}`);
                });
            }
        });
        toast.success(`Applied group: ${group.name}`);
    };

    const handleDeleteGroup = (id) => {
        setCustomGroups(customGroups.filter(g => g.id !== id));
        toast.success("Group deleted");
    };

    return (
        <Popover>
            <div className="label">
                <span className="label-text">
                    Select Blocks
                </span>
            </div>
            <PopoverTrigger asChild>
                <div role="button" tabIndex={0} className="flex min-h-[40px] w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer h-auto flex-wrap gap-2">
                    {safeSelectedBlocks.length > 0 ? (
                        safeSelectedBlocks.map((b) => (
                            <span key={b.building} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1 animate-in fade-in zoom-in duration-300">
                                {b.building}
                                {b.rooms && b.rooms.length > 0 ? (
                                    b.rooms.map((room) => (
                                        <div key={room} className="flex items-center">
                                            <span>-{room}</span>
                                            <div
                                                role="button"
                                                className="hover:bg-red-500 hover:text-white rounded-full p-0.5 cursor-pointer transition-colors ml-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRemove && onRemove(b.building, room);
                                                }}
                                            >
                                                <X size={12} />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        role="button"
                                        className="hover:bg-red-500 hover:text-white rounded-full p-0.5 cursor-pointer transition-colors ml-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove && onRemove(b.building);
                                        }}
                                    >
                                        <X size={14} />
                                    </div>
                                )}
                            </span>
                        ))
                    ) : (
                        <span className="text-muted-foreground">Select Blocks</span>
                    )}
                </div>
            </PopoverTrigger>

            <PopoverContent className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }} align="start">
                <div className="p-2 border-b">
                    <div className="flex gap-2 mb-2">
                        <Button
                            variant={view === 'all' ? "default" : "outline"}
                            size="sm"
                            onClick={() => setView('all')}
                            className="flex-1"
                        >
                            All Blocks
                        </Button>
                        <Button
                            variant={view === 'custom' ? "default" : "outline"}
                            size="sm"
                            onClick={() => setView('custom')}
                            className="flex-1"
                        >
                            Custom Blocks
                        </Button>
                    </div>

                    {view === 'all' && (
                        <Input
                            autoFocus
                            placeholder="Search blocks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-8"
                        />
                    )}
                </div>

                <div className="max-h-[300px] overflow-y-auto p-2 pt-0 space-y-2 mt-2">
                    {view === 'all' ? (
                        filteredBlocks.length === 0 ? (
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
                        )
                    ) : (
                        // Custom Blocks View
                        <div className="space-y-4 pt-1">
                            {/* Create New Group Section */}
                            <div className="p-3 border rounded-md bg-secondary/20 space-y-2">
                                <Label className="text-xs font-semibold">Save Current Selection as Group</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Group Name (e.g., Merged X)"
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                        className="h-8"
                                    />
                                    <Button size="sm" onClick={handleSaveGroup} disabled={safeSelectedBlocks.length === 0}>
                                        <Plus size={16} />
                                    </Button>
                                </div>
                                {safeSelectedBlocks.length === 0 && (
                                    <p className="text-[10px] text-muted-foreground">Select blocks from "All Blocks" tab first.</p>
                                )}
                            </div>

                            {/* Saved Groups List */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold px-1">Saved Groups</Label>
                                {customGroups.length === 0 ? (
                                    <p className="text-sm text-center text-muted-foreground py-4">No saved custom groups yet.</p>
                                ) : (
                                    customGroups.map(group => (
                                        <div key={group.id} className="flex items-center justify-between p-2 rounded-md border hover:bg-accent/50 group">
                                            <div
                                                className="flex-1 cursor-pointer"
                                                onClick={() => handleApplyGroup(group)}
                                            >
                                                <div className="font-medium text-sm">{group.name}</div>
                                                <div className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                                                    {group.blocks.map(b => b.building + (b.rooms.length ? `(${b.rooms.length})` : '')).join(', ')}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-red-500"
                                                onClick={() => handleDeleteGroup(group.id)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
