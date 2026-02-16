import { useEffect, useState } from "react";
import axios from "../../../api/axios";

const usePositionHook = () => {
    const [position, setPosition] = useState([]);
    const [loadingPosition, setLoadingPosition] = useState(false);
    const [errorPosition, setErrorPosition] = useState(null);

    const fetchPosition = async () => {
        try {
            setLoadingPosition(true);
            setErrorPosition(null);

            const res = await axios.get("position/all_positions");
            console.log("Positions API response:", res.data);

            // Handle Laravel-style data wrapping or direct array response
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setPosition(data);
        } catch (err) {
            console.error("Error fetching positions:", err);
            setErrorPosition(err);
            setPosition([]);
        } finally {
            setLoadingPosition(false);
        }
    };

    useEffect(() => {
        fetchPosition();
    }, []);

    return {
        position,
        loadingPosition,
        errorPosition,
    };
};

export default usePositionHook;