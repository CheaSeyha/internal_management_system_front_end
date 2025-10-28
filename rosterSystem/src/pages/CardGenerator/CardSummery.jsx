import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";

import CardOfAmount from "./components/CardOfAmount";

function CardIcome() {
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
    { id: 1, amount: 73, cardType: "car" },
    { id: 2, amount: 37, cardType: "vip" },
    { id: 3, amount: 346, cardType: "staff" },
    { id: 4, amount: 23, cardType: "construction" },
    { id: 5, amount: 0, cardType: "tuktuk" },
    { id: 6, amount: 45, cardType: "delivery" },
  ];

  return (
    <>
      <div className="filter-button-controller">
        
      </div>
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
                <CardOfAmount amount={card.amount} cardType={card.cardType} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </>
  );
}

export default CardIcome;
