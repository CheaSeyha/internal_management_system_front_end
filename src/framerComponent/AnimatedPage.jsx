import { motion } from 'framer-motion';

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}  // Starts 100px below (hidden)
      animate={{ opacity: 1, y: 0 }}    // Slides up to normal position
      exit={{ opacity: 0, y: -100 }}    // Exits by sliding up (fading out)
      transition={{ 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]       // Smoother easing (optional)
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;