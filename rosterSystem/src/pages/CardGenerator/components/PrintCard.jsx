import React, { forwardRef } from "react";
import VIP from "./VIP";

const PrintCard = forwardRef(({ entries = [] }, ref) => {
  if (!entries || entries.length === 0) return null; // ✅ Safety check

  return (
    <div className={`flex flex-wrap justify-start gap-0 p-5 w-full ${entries.length > 1
      ? "print:justify-start"
      : "print:justify-center"
      }`} ref={ref}>
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className={
            entry.cardType === "CAR CARD"
              ? "w-full flex justify-center py-4 print:border-y print:border-dashed print:border-blue-600"
              : entry.cardType === "VIP CARD" ? "-mx-[2.5px] -my-[0.5px]" : "mx-[0.5px] my-[0.5px]"
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
