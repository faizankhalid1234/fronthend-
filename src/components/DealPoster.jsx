function DealPoster({ deal }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f3f4f6]">
      <img
        src={deal.image}
        alt={deal.title || ""}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}

export default DealPoster;
