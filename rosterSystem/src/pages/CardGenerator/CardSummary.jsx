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

function CardSummary() {
  const [getDate, setDate] = useState(null);
  const { fetchSummary, cardSummary, loadings, error } = useCardHook();

  const cardContainerVariants = {
    hidden: { opacity: 0 },

    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,

        delayChildren: 0.2,
      },
    },
  };

  const handleChange = (range) => {
    const formatDate = (isoString) => {
      const date = new Date(isoString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    };

    const formattedRange = {
      from: formatDate(range.from),
      to: formatDate(range.to),
    };

    console.log("🗓 Selected Range:", formattedRange);
    // ✅ update state

    setDate(formattedRange);
    // ✅ call fetchSummary using the new range immediately
    fetchSummary(formattedRange.from, formattedRange.to);
  };

  const getDefaultDate = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
    return {
      from: formatDate(firstDay),
      to: formatDate(lastDay),
    };
  };

  // Inside your CardSummary component

  useEffect(() => {
    const defaultDate = getDefaultDate(); // call the function
    console.log("📅 Default month range:", defaultDate);
    // Set state if needed
    setDate(defaultDate);
    // Call your fetchSummary from hook
    fetchSummary(defaultDate.from, defaultDate.to);
  }, []); // run once on mount

  const restartDate = () => {
    const defaultDate = getDefaultDate(); // call the function
    console.log("📅 Default month range:", defaultDate);
    // Set state if needed
    setDate(defaultDate);
    // Call your fetchSummary from hook
    fetchSummary(defaultDate.from, defaultDate.to);
  };

  if (loadings) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return (
    <div className="space-y-5">
      <div className="all-button flex gap-2">
        <div className="filter-button-controller w-full lg:w-[240px]">
          <CalendarRangePicker onChange={handleChange} />
        </div>

        <Button variant="outline" onClick={restartDate}>
          <RotateCcw className="" />
        </Button>
      </div>

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

                    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
          description={"Cards created by type over time"}
          title={"Card Summary Chart"}
        />
        <ChartBarInteractive
          title="Card Creator Overview"
          description="All cards by creator name"
          data={cardSummary.ChartBarInteractive.summaryData}
          chartConfig={cardSummary.ChartBarInteractive.config}
        />
      </div>
    </div>
  );
}

export default CardSummary;
