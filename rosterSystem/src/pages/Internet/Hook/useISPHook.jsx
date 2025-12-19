import { useState } from "react";
import axios from "../../../api/axios";
import { toast } from "sonner";

export default function useISPHook() {
    const [isps, setIsps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    // --- Fetch all ISPs ---
    const fetchISPs = async () => {
        setFetching(true);
        try {
            const response = await axios.get("/isp/all_isps");
            if (response.data.success) {
                setIsps(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch ISPs");
            }
        } catch (error) {
            toast.error(error.message || "Error fetching ISPs");
        } finally {
            setFetching(false);
        }
    };

    // --- Add ISP ---
    const addISP = async (isp_name) => {
        if (!isp_name?.trim()) {
            toast.error("ISP name is required");
            return null;
        }
        setLoading(true);
        try {
            const response = await axios.post("/isp/add_isp", { isp_name });
            if (response.data?.success) {
                toast.success(response.data.message || "ISP added successfully");
                const newISP = response.data.data;
                setIsps((prev) => [...prev, newISP]);
                return newISP;
            } else {
                toast.error(response.data?.message || "Failed to add ISP");
                return null;
            }
        } catch (error) {
            // Check for validation errors from Laravel if any
            const errorMsg = error.response?.data?.errors?.isp_name?.[0] ||
                error.response?.data?.message ||
                error.message ||
                "Error adding ISP";
            toast.error(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // --- Update ISP ---
    const updateISP = async (isp_id, isp_name) => {
        if (!isp_id || !isp_name?.trim()) {
            toast.error("ISP ID and name are required");
            return false;
        }
        setLoading(true);
        try {
            const response = await axios.put(`/isp/update_isp/${isp_id}`, { isp_name });
            if (response.data?.success) {
                toast.success(response.data.message || "ISP updated successfully");
                setIsps((prev) =>
                    prev.map((isp) => (isp.id === isp_id ? response.data.data : isp))
                );
                return true;
            } else {
                toast.error(response.data?.message || "Failed to update ISP");
                return false;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.errors?.isp_name?.[0] ||
                error.response?.data?.message ||
                error.message ||
                "Error updating ISP";
            toast.error(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // --- Delete ISP ---
    const deleteISP = async (isp_id) => {
        if (!isp_id) return false;
        setLoading(true);
        try {
            const response = await axios.delete(`/isp/delete_isp/${isp_id}`);
            if (response.data?.success) {
                toast.success(response.data.message || "ISP deleted successfully");
                setIsps((prev) => prev.filter((isp) => isp.id !== isp_id));
                return true;
            } else {
                toast.error(response.data?.message || "Failed to delete ISP");
                return false;
            }
        } catch (error) {
            toast.error(error.message || "Error deleting ISP");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        isps,
        loading,
        fetching,
        fetchISPs,
        addISP,
        updateISP,
        deleteISP,
    };
}
