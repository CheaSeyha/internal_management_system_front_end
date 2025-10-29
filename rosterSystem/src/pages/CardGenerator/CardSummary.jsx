import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";

import CardOfAmount from "./components/CardOfAmount";
import { ChartBarInteractive } from "../../components/charts/ChartBarInteractive";
import { ChartAreaGradient } from "../../components/charts/ChartAreaGradient";
import { CalendarRangePicker } from "../../components/CalendarRangePicker";

function CardSummary() {
  const [getDate, setDate] = useState(null);

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

  const cards = [
    { moneyAmount: 283, cardType: "car", cardAmount: 235 },
    { moneyAmount: 234, cardType: "vip", cardAmount: 234 },
    { moneyAmount: 1257, cardType: "staff", cardAmount: 45 },
    { moneyAmount: 345, cardType: "construction", cardAmount: 234 },
    { moneyAmount: 2342, cardType: "tuktuk", cardAmount: 456 },
    { moneyAmount: 45, cardType: "delivery", cardAmount: 345 },
  ];
  useEffect(() => {
    console.log(getDate);
  }, [getDate]);
  return (
    <div className="space-y-5">
      <div className="filter-button-controller w-full lg:w-[240px]">
        <CalendarRangePicker
          onChange={(range) => {
            setDate(range);
          }}
        />
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
            {cards.map((card) => (
              <SwiperSlide key={card.id} className="!w-auto flex-shrink-0">
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                  }}
                >
                  <CardOfAmount moneyAmount={card.moneyAmount} cardType={card.cardType} cardAmount={card.cardAmount} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
      <div className="div grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartBarInteractive />
        <ChartAreaGradient
          tittle={"Income From Card"}
          description={"Compare Chart Of Card Income"}
          percent={8}
          start_end_date={"Jan - Dec 2025"}
        />
      </div>
    </div>
  );
}

export default CardSummary;
