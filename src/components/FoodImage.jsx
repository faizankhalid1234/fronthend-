const FALLBACK =
  "https://www.themealdb.com/images/media/meals/xwurrw1503067129.jpg";

function FoodImage({ src, alt, className = "", loading = "lazy" }) {
  const resolved = src || FALLBACK;

  return (
    <img
      src={resolved}
      alt={alt}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(e) => {
        if (e.currentTarget.src !== FALLBACK) {
          e.currentTarget.src = FALLBACK;
        }
      }}
      className={`h-full w-full bg-gray-input object-cover ${className}`}
    />
  );
}

export default FoodImage;
