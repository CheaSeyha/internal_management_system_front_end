import { useState, useEffect } from "react";

import axios from "../../../../api/axios";

export const useCardHook = () => {
  const [cardTypes, setCardTypes] = useState([]);

  const [cardSummary, setCardSummary] = useState({
    cards_data: [],
    ChartAreaInteractive: { data: [], config: {} },
    ChartBarInteractive: { summaryData: [], config: {} },
  });

  const [loadings, setLoadings] = useState(false);

  const [error, setError] = useState(false);
  const [errorMsx, setErrorMsx] = useState("");

  const fetchSummary = async (start_date, end_date) => {
    setLoadings(true);
    try {
      const response = await axios.post("/cards_summary", {
        start_date,
        end_date,
      });

      setCardSummary(response.data.data || []);
    } catch (error) {
      setError(true);
      setErrorMsx(error)
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

  return { fetchSummary, cardSummary, cardTypes, loadings, error,errorMsx };
};
