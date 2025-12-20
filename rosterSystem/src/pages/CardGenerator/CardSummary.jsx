import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import CardOfAmount from "./components/CardOfAmount";
import { ChartBarInteractive } from "../../components/charts/ChartBarInteractive";
import { CalendarRangePicker } from "../../components/CalendarRangePicker";
import { useCardHook } from "./components/Hook/useCardHook";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { Button } from "../../components/ui/button";
import { RotateCcw } from "lucide-react";
import { ChartAreaInteractive } from "../../components/charts/ChartAreaInteractive";
import { toast } from "sonner";
function CardSummary() {
  const [getDate, setDate] = useState(null);
  const [totalCardIncome, setTotalCardIncome] = useState(0);
  const { fetchSummary, cardSummary, loadings, error, errorMsx } =
    useCardHook();

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getDefaultDate = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { from: formatDate(firstDay), to: formatDate(lastDay) };
  };

  // Fetch default summary on mount
  useEffect(() => {
    const defaultDate = getDefaultDate();
    setDate(defaultDate);
    fetchSummary(defaultDate.from, defaultDate.to);
  }, []);
  // ✅ When cardSummary updates, recalc total
  useEffect(() => {
    if (cardSummary?.cards_data?.length) {
      const total = cardSummary.cards_data.reduce(
        (sum, card) => sum + (card.moneyAmount || 0),
        0
      );
      setTotalCardIncome(total);
      console.log("Total cards:", total);
    }
  }, [cardSummary]);
  // Called when user selects new date range
  const handleChange = (range) => {
    if (!range?.from || !range?.to) return;

    const fromDate = range.from;
    const toDate = range.to;

    // Calculate difference in days
    const diffTime = toDate.getTime() - fromDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // Check if date range exceeds 1 year (~365 days)
    if (diffDays > 365) {
      toast.error("Max date selection is 1 year or less.");
      return;
    }

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const formattedRange = {
      from: formatDate(fromDate),
      to: formatDate(toDate),
    };

    // Update state
    setDate(formattedRange);

    // Call fetch
    fetchSummary(formattedRange.from, formattedRange.to);
  };
  const calendarRef = React.useRef();
  const restartDate = () => {
    // reset Calendar component
    calendarRef.current?.reset();

    // fetch data for default range
    const defaultDate = getDefaultDate();
    setDate(defaultDate);
    fetchSummary(defaultDate.from, defaultDate.to);
  };
  useEffect(() => {
    if (error) {
      toast.error(errorMsx?.response?.data?.message || "Something went wrong");
      console.log(errorMsx);
    }
  }, [error]);
  return (
    <div className="space-y-5">
      <div className="all-button flex gap-2">
        <div className="filter-button-controller w-full lg:w-[240px]">
          <CalendarRangePicker ref={calendarRef} onChange={handleChange} />
        </div>

        <Button variant="outline" onClick={restartDate}>
          <RotateCcw />
        </Button>
      </div>
      {loadings ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="chart-layout">
            <motion.div
              variants={cardContainerVariants}
              initial="hidden"
              animate="show"
              className="w-full overflow-hidden"
            >
              <Swiper
                modules={[FreeMode, Mousewheel]}
                spaceBetween={16}
                slidesPerView="auto"
                freeMode={true}
                mousewheel={{ forceToAxis: true }}
                grabCursor={true}
                observer={true}
                observeParents={true}
                className="cursor-grab"
              >
                {cardSummary.cards_data.map((card, index) => (
                  <SwiperSlide key={index} className="!w-auto flex-shrink-0">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.3 },
                        },
                      }}
                    >
                      <CardOfAmount
                        moneyAmount={card.moneyAmount}
                        cardType={card.cardType}
                        cardAmount={card.cardAmount}
                      />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </div>
          <div className="chart-container grid grid-cols-1 gap-5">
            <ChartAreaInteractive
              config={cardSummary.ChartAreaInteractive.config}
              data={cardSummary.ChartAreaInteractive.data}
              description={"Cards Created by Type Over Time"}
              title={"Daily Card Creation Summary"}
              totalIncome={totalCardIncome}
            />
            <ChartBarInteractive
              title="Card Creator Overview"
              description="Shows the total number of cards created by each user per day"
              data={cardSummary.ChartBarInteractive.summaryData}
              chartConfig={cardSummary.ChartBarInteractive.config}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default CardSummary;
