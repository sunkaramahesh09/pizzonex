import { AnimatePresence, motion } from "framer-motion";
import image1 from "../assets/image2.jpg";

type Props = {
  selections: Record<string, string[]>;
};

export default function PizzaPreview({ selections }: Props) {
  const { base, sauce, cheese, veggies, meat } = selections;
  const format = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: "min(90vh, 90vw)", height: "min(90vh, 90vw)", perspective: 1000 }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Base Layer */}
        <AnimatePresence mode="sync">
          {base[0] && (
            <motion.img
              key={base[0]}
              src={`/images/bases/${format(base[0])}.png`}
              alt="Base"
              initial={{ opacity: 0, rotate: 45, scale: 0.95 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 w-[105%] h-[105%] object-cover"
            />
          )}
        </AnimatePresence>

        {/* Sauce Layer */}
        <AnimatePresence mode="sync">
          {sauce[0] && (
            <motion.img
              key={sauce[0]}
              src={`/images/sauces/${format(sauce[0])}.png`}
              alt="Sauce"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 w-[88%] h-[88%] -translate-x-1/2 -translate-y-1/2 object-contain"
            />
          )}
        </AnimatePresence>

        {/* Cheese Layer */}
        <AnimatePresence mode="sync">
          {cheese[0] && (
            <motion.img
              key={cheese[0]}
              src={`/images/cheese/${format(cheese[0])}.png`}
              alt="Cheese"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </AnimatePresence>

        {/* Veggies (Multi-select) */}
        <AnimatePresence>
          {veggies.map((veg) => (
            <motion.img
              key={veg}
              src={`/images/veggies/${format(veg)}.png`}
              alt={veg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ))}
        </AnimatePresence>

        {/* Meat (Multi-select) */}
        <AnimatePresence>
          {meat.map((m) => (
            <motion.img
              key={m}
              src={`/images/meat/${format(m)}.png`}
              alt={m}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Soft Shadow */}
      <div className="absolute bottom-4 w-48 h-6 bg-black/20 rounded-full blur-md" />
    </div>
  );
}
