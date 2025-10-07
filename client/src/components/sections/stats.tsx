import { motion } from "framer-motion";
import AnimatedCounter from "@/components/ui/animated-counter";

export default function Stats() {
  const stats = [
    { number: 15, suffix: "+", label: "Years Industry Experience" },
    { number: 800, suffix: "+", label: "Employees" },
    { number: 87120, suffix: "", label: "Square feet Plant Premises" },
    { number: 20, suffix: "MT", label: "Daily Production (IQF)" },
    { number: 10, suffix: "+", label: "Exported Countries" },
  ];

  return (
    <section className="py-16 bg-ocean-blue text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-coral-accent mb-2">
                <AnimatedCounter
                  end={stat.number}
                  suffix={stat.suffix}
                  duration={2}
                />
              </div>
              <p className="text-sm text-light-marine">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
