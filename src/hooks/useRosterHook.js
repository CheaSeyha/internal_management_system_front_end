import { useState } from "react";
import axios from "@/api/axios.js";

export default function useRosterHook() {
    const [roster, setRoster] = useState([]);
    const [rosterLoading, setRosterLoading] = useState(false);

    const fetchRoster = async (month, year) => {
        setRosterLoading(true);
        try {
            const res = await axios.get('roster', {
                params: {
                    month: month,
                    year: year,
                }
            });
            setRoster(res.data);
            return res.data;
        } catch (e) {
            throw new e;
        } finally {
            setRosterLoading(false);
        }
    }

    return {
        roster,
        rosterLoading,
        fetchRoster
    }
}