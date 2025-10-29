import {
  Car,
  PersonStanding,
  Crown,
  HelpCircle,
  Pickaxe,
  Navigation,
  PackageOpen,
  SendToBack,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
// 1. Create a style map object
// Store the FULL Tailwind utility classes (e.g., 'bg-blue-500', 'to-green-500')
const cardStyles = {
  car: {
    Icon: Car,
    // FIX: Include 'bg-' and 'to-' prefix in the string
    bgColorClass: "bg-blue-500",
    toColorClass: "to-blue-500",
  },
  staff: {
    Icon: PersonStanding,
    // FIX: Include 'bg-' and 'to-' prefix in the string
    bgColorClass: "bg-green-500",
    toColorClass: "to-green-500",
  },
  vip: {
    Icon: Crown,
    // FIX: Include 'bg-' and 'to-' prefix in the string
    bgColorClass: "bg-yellow-500",
    toColorClass: "to-yellow-500",
  },
  construction: {
    Icon: Pickaxe,
    // FIX: Include 'bg-' and 'to-' prefix in the string
    bgColorClass: "bg-yellow-500",
    toColorClass: "to-yellow-500",
  },
  rolling: {
    Icon: SendToBack,
    // FIX: Include 'bg-' and 'to-' prefix in the string
    bgColorClass: "bg-red-300",
    toColorClass: "to-red-300",
  },
  tuktuk: {
    Icon: Navigation,
    // FIX: Include 'bg-' and 'to-' prefix in the string
    bgColorClass: "bg-red-300",
    toColorClass: "to-red-300",
  },
  delivery: {
    Icon: PackageOpen,
    // FIX: Include 'bg-' and 'to-' prefix in the string
    bgColorClass: "bg-red-300",
    toColorClass: "to-red-300",
  },
};

// A default style for any cardType that doesn't have a specific style
const defaultStyle = {
  Icon: HelpCircle,
  // FIX: Include 'bg-' and 'to-' prefix in the string
  bgColorClass: "bg-gray-500",
  toColorClass: "to-gray-500",
};

// --- NEW CountUp Component for the Amount Display ---
/**
 * Animates a number from 0 up to the endValue.
 * Uses requestAnimationFrame for smooth performance.
 */
function CountUp({ endValue, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // Function that runs on every animation frame
    const animateCount = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      // Calculate progress (0.0 to 1.0)
      const progress = Math.min(elapsed / duration, 1);

      // Interpolate the value and round it down to an integer
      const currentValue = Math.floor(progress * endValue);

      setCount(currentValue);

      if (progress < 1) {
        // Continue animation if not finished
        requestAnimationFrame(animateCount);
      }
    };

    // Start the animation loop
    const animationFrameId = requestAnimationFrame(animateCount);

    // Cleanup: cancel the animation frame when the component unmounts
    return () => cancelAnimationFrame(animationFrameId);
  }, [endValue, duration]);

  // Format the number with commas (e.g., 2347 -> 2,347)
  const formattedCount = new Intl.NumberFormat("en-US").format(count);

  // Use motion.span (optional, but keeps consistency with Framer Motion)
  return <motion.span>{formattedCount}</motion.span>;
}

function CardOfAmount({ cardType, moneyAmount, cardAmount }) {
  // 2. Look up the styles for the current cardType, or use the default
  // Destructure the FULL class names
  const cardItemVariants = {
    hidden: { opacity: 0, x: -80 }, // Start off-screen to the left, invisible
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }, // End at final position, visible
  };
  const { Icon, bgColorClass, toColorClass } =
    cardStyles[cardType] || defaultStyle;

  return (
    <motion.section
      // Apply the card variants here
      variants={cardItemVariants}
      // Ensure the text is white against the dark background
      className={`h-[150px] w-[290px] relative overflow-hidden rounded-lg bg-gradient-to-br  from-gray-200 ${toColorClass} dark:from-gray-700 p-3 text-white shadow-xl`}
    >
      <Icon className="size-30 opacity-15 left-40 text-white absolute" />
      <div className="content flex h-full flex-col justify-between">
        <div className={`h-fit w-fit rounded-lg p-3 ${bgColorClass}`}>
          <Icon className="size-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold">
          $ <CountUp endValue={moneyAmount} duration={1800} />
        </h1>
        <p className="text-sm capitalize text-white darktext-gray-300">
          All <b>{cardType}</b> Cards <b>{cardAmount}</b>
        </p>
      </div>
    </motion.section>
  );
}

export default CardOfAmount;
