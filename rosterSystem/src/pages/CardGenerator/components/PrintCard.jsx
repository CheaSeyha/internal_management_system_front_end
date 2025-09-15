import React, { forwardRef } from "react";
import VIP from "./VIP";

const PrintCard = forwardRef(({ entries = [] }, ref) => {
  if (!entries || entries.length === 0) return null; // ✅ Safety check

  return (
    <div className="flex flex-wrap justify-start gap-0 p-5 w-full" ref={ref}>
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className={
            entry.card_type === "CAR CARD"
              ? "w-full flex justify-center py-4 "
              : `w-auto ${true ? "-mx-[1.1px] -my-[2px]" : "mx-2 my-2"}`
          }
          id={`card-${entry.id}`}
        >
          <VIP
            key={entry.card_type_id}
            index={index}
            block={entry.block}
            cardType={entry.card_type}
            id={entry.card_type_id}
            image={entry.imageBlob}
            name={entry.card_name}
          />
        </div>
      ))}
    </div>
  );
});

export default PrintCard;
