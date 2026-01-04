import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import useBlocks from "../../Blocks/Hook/useBlocks"
import { toast } from "sonner"

export default function AddBlock({ onRefresh, buildings = [] }) {
    const [open, setOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState("");
    const [roomName, setRoomName] = useState("");
    const { addRoom, loading } = useBlocks();

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!selectedBuilding) {
            toast.error("Please select a building");
            return;
        }
        if (!roomName.trim()) {
            toast.error("Please enter a room name");
            return;
        }

        const success = await addRoom(selectedBuilding, roomName);

        if (success) {
            setRoomName("");
            setSelectedBuilding("");
            setOpen(false);
            if (onRefresh) onRefresh();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" className="ml-1 h-full"> <Plus /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={(e) => {
                    e.stopPropagation();
                    handleSubmit(e);
                }}>
                    <DialogHeader>
                        <DialogTitle>Add Room</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                            <Label htmlFor="building-name">Select Building</Label>
                            <Select
                                value={selectedBuilding}
                                onValueChange={setSelectedBuilding}
                            >
                                <SelectTrigger id="building-name" className="w-full">
                                    <SelectValue placeholder="Select a Building" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Buildings</SelectLabel>
                                        {buildings.map((b) => (
                                            <SelectItem key={b.building} value={b.building}>
                                                {b.building}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="room-name">Room Name</Label>
                            <Input
                                id="room-name"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="e.g. 101"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
