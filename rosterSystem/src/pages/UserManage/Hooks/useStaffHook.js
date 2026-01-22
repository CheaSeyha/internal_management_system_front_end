// ✅ FULL FIX (Hook + TableUser)
// Put these in their files exactly.

// ===============================
// 1) /Hooks/useStaffHook.js
// ===============================
import { useCallback, useEffect, useState } from "react";
import axios from "../../../api/axios";

const useStaffHook = () => {
    const [staff, setStaff] = useState([]); // ✅ must be array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getStaff = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get("/staff/get_all_staff");

            // ✅ API shape: { success, message, data: [...] }
            if (res.status === 200) {
                setStaff(res.data?.data ?? []); // ✅ set only the array
            } else {
                setStaff([]);
            }
        } catch (err) {
            setError(err);
            setStaff([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ auto fetch once (remove any extra getStaff() calls in component)
    useEffect(() => {
        getStaff();
    }, [getStaff]);

    return { staff, loading, error, refetch: getStaff };
};

export default useStaffHook;
