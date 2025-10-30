import { useState, useEffect } from "react";
import axios from "../../../../api/axios";

export const useCardHook = () => {
  const [cardTypes, setCardTypes] = useState([]);
  const [cardSummary, setCardSummary] = useState([]);
  const [loadings, setLoadings] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async (start_date, end_date) => {
    
    try {
      const response = await axios.post("/cards_summary", {
        start_date,
        end_date,
      });
      setCardSummary(response.data.data || []);
    } catch (error) {
      setError(error);
    } finally {
      setLoadings(false);
    }
  };

  useEffect(() => {
    let isMounted = true; // prevent state updates if component unmounts

    const fetchCardTypes = async () => {
      setLoadings(true);
      setError(null);

      try {
        const response = await axios.get("/cards/get_all_card_type");
        if (isMounted) {
          setCardTypes(response.data.data); // adjust if API returns nested data
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) setLoadings(false);
      }
    };

    fetchCardTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  return { fetchSummary, cardSummary, cardTypes, loadings, error };
};
