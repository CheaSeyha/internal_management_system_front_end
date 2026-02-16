import { useState } from "react";
import axios from "../../../api/axios";
import { toast } from "sonner";

export default function useBlocks() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); // new state

  // --- Fetch all blocks ---
  const fetchBlocks = async () => {
    setFetching(true);
    try {
      const response = await axios.get("/blocks/all_buildings");
      if (response.data.success) {
        setBlocks(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch buildings");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching buildings");
    } finally {
      setFetching(false);
    }
  };

  const deleteRoom = async (room_name, building_name) => {
    if (!room_name || !building_name) return false;

    setDeleteLoading(true); // start loading
    try {
      const response = await axios.delete(
        `/blocks/delete_room/${room_name}/${building_name}`
      );

      if (response.data?.success) {
        // Remove the room locally from blocks
        setBlocks((prev) =>
          prev.map((b) =>
            b.building === building_name
              ? { ...b, room: b.room.filter((r) => r !== room_name) }
              : b
          )
        );
        toast.success(response.data.message || "Room deleted successfully");
        return true;
      } else {
        toast.error(response.data?.message || "Failed to delete room");
        return false;
      }
    } catch (err) {
      toast.error(err.message || "Error deleting room");
      return false;
    } finally {
      setDeleteLoading(false); // stop loading
    }
  };

  // --- Add Block ---
  const addBlock = async (building_name) => {
    if (!building_name?.trim()) {
      toast.error("Building name is required");
      return null;
    }
    setLoading(true);
    try {
      const response = await axios.post("/blocks/add_building", {
        building_name,
      });
      if (response.data?.success) {
        toast.success(response.data.message || "Block added successfully");
        const newBlock = response.data.data || {
          building: building_name,
          room: [],
        };
        setBlocks((prev) => [...prev, newBlock]);
        return newBlock;
      } else {
        toast.error(
          response.data?.errors?.building_name || "Failed to add block"
        );
        return null;
      }
    } catch (error) {
      toast.error(error.data.message || "Error adding block");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // --- Add Room ---
  const addRoom = async (building_name, room_name) => {
    if (!building_name || !room_name?.trim()) {
      toast.error("Building and Room are required");
      return null;
    }
    setLoading(true);
    try {
      const response = await axios.post("/blocks/add_room", {
        building_name,
        room_name,
      });
      if (response.data?.success) {
        toast.success(response.data.message || "Room added successfully");
        const updatedRoom = response.data.data;
        setBlocks((prev) =>
          prev.map((b) =>
            b.building === updatedRoom.building_name
              ? { ...b, room: [...b.room, updatedRoom.room] }
              : b
          )
        );
        return true;
      } else {
        toast.error("Failed to add room");
        return false;
      }
    } catch (error) {
      toast.error(error.message || "Error adding room");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- Delete single building ---
  const deleteBuilding = async (building_name) => {
    if (!building_name) return;
    setLoading(true);
    try {
      const response = await axios.delete(
        `/blocks/delete_building/${building_name}`
      );
      if (response.data?.success) {
        toast.success(response.data.message || "Building deleted");
        setBlocks((prev) => prev.filter((b) => b.building !== building_name));
        return true;
      } else {
        toast.error("Failed to delete building");
        return false;
      }
    } catch (error) {
      toast.error(error.message || "Error deleting building");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- Delete multiple buildings ---
  const deleteMultipleBuildings = async (buildingNames = []) => {
    if (!buildingNames.length) return;
    setLoading(true);
    try {
      await Promise.all(
        buildingNames.map((name) =>
          axios.delete(`/blocks/delete_building/${name}`)
        )
      );
      toast.success("Buildings deleted successfully");
      setBlocks((prev) =>
        prev.filter((b) => !buildingNames.includes(b.building))
      );
      return true;
    } catch (error) {
      toast.error(error.message || "Error deleting buildings");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    blocks,
    loading,
    fetching,
    deleteLoading, // expose it
    fetchBlocks,
    addBlock,
    addRoom,
    deleteBuilding,
    deleteMultipleBuildings,
    deleteRoom,
  };
}
