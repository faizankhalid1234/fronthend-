import { FaLeaf, FaShippingFast, FaUtensils, FaUsers } from "react-icons/fa";

const features = [
  {
    icon: FaLeaf,
    title: "Fresh Ingredients",
    description: "Premium quality ingredients prepared daily for authentic flavor.",
  },
  {
    icon: FaShippingFast,
    title: "Fast Delivery",
    description: "Hot meals delivered quickly to your doorstep across the city.",
  },
  {
    icon: FaUtensils,
    title: "Authentic Arabic Taste",
    description: "Traditional recipes crafted with genuine Saudi and Gulf flavors.",
  },
  {
    icon: FaUsers,
    title: "Family Friendly Meals",
    description: "Generous platters and deals perfect for sharing with loved ones.",
  },
];

function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 md:px-5 lg:px-8">
      <h2 className="mb-8 text-[24px] font-bold text-navy md:text-[26px]">
        Why Choose Us
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-[22px] border border-gray-border bg-white p-6 shadow-[0_2px_12px_rgba(26,35,64,0.06)] transition hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(26,35,64,0.1)]"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-light text-orange">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="text-[16px] font-bold text-navy">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-muted">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
