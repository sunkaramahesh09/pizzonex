const image2 = "https://res.cloudinary.com/ddn1qjenm/image/upload/v1773162067/pizzonex/pizza-bbq-chicken.jpg";

type Props = {
  pizzaPreview: React.ReactNode;
  optionsSection: React.ReactNode;
  orderSummary: React.ReactNode;
};

export default function CustomBuilderLayout({
  pizzaPreview,
  optionsSection,
  orderSummary,
}: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 🔴 TOP SECTION */}
      <div className="h-[30vh] md:h-[45vh] relative overflow-hidden bg-[#ffffff]">
        {/* Semicircle */}
        <div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: "min(90vh, 90vw)",
            height: "min(90vh, 90vw)",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {pizzaPreview}
        </div>
        <img src={image2} alt="Pizza" className="w-full h-full object-cover" />
      </div>

      {/* 🔵 BOTTOM SECTION */}
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Options Section */}
        <div className="flex-1 p-4 md:p-6">{optionsSection}</div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 p-4 md:p-6">{orderSummary}</div>
      </div>
    </div>
  );
}
