import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { builderOptions } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomBuilderLayout from "@/components/CustomBuilderLayout";
import PizzaPreview from "@/components/PizzaPreview";

const steps = ["Base", "Sauce", "Cheese", "Veggies", "Meat"] as const;

const prices: Record<string, number> = {
  base: 99,
  sauce: 30,
  cheese: 50,
  veggie: 20,
  meat: 40,
};

export default function BuilderPage() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({
    base: ["Thin Crust"],
    sauce: [],
    cheese: [],
    veggies: [],
    meat: [],
  });

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const currentStep = steps[step];

  const optionsMap: Record<string, string[]> = {
    Base: builderOptions.bases,
    Sauce: builderOptions.sauces,
    Cheese: builderOptions.cheeses,
    Veggies: builderOptions.veggies,
    Meat: builderOptions.meats,
  };

  const currentOptions = optionsMap[currentStep];
  const key = currentStep.toLowerCase();
  const isMulti = key === "veggies" || key === "meat";

  const toggleOption = (option: string) => {
    setSelections((prev) => {
      const current = prev[key] || [];

      if (isMulti) {
        return {
          ...prev,
          [key]: current.includes(option)
            ? current.filter((o) => o !== option)
            : [...current, option],
        };
      }

      return { ...prev, [key]: [option] };
    });
  };

  const totalPrice =
    (selections.base.length ? prices.base : 0) +
    (selections.sauce.length ? prices.sauce : 0) +
    (selections.cheese.length ? prices.cheese : 0) +
    selections.veggies.length * prices.veggie +
    selections.meat.length * prices.meat;

  const allSelections = Object.values(selections).flat();

  const handleProceed = () => {
    if (
      !selections.base.length ||
      !selections.sauce.length ||
      !selections.cheese.length
    ) {
      toast.error("Please select at least a base, sauce, and cheese");
      return;
    }

    addToCart(
      {
        id: `custom-${Date.now()}`,
        name: "Custom Pizza",
        description: allSelections.join(", "),
        price: totalPrice,
        image: "",
        category: "Custom",
      },
      1,
      allSelections
    );

    toast.success("Custom pizza added to cart!");
    navigate("/cart");
  };

  return (
    <CustomBuilderLayout
      pizzaPreview={
        <PizzaPreview
          selections={selections}
        />
      }
      optionsSection={
        <>
          {/* Step Indicators */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {steps.map((s, i) => {
              // A step is accessible only if all previous steps have at least one selection
              const isStepAccessible = steps
                .slice(0, i)
                .every((prev) => (selections[prev.toLowerCase()] || []).length > 0);
              const hasSelection = (selections[s.toLowerCase()] || []).length > 0;

              return (
                <Button
                  key={s}
                  variant={
                    step === i
                      ? "default"
                      : hasSelection
                      ? "secondary"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => isStepAccessible && setStep(i)}
                  disabled={!isStepAccessible}
                >
                  {hasSelection && (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  {s}
                </Button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">
                    Choose {currentStep} {isMulti && "(multi-select)"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {currentOptions.map((option) => {
                      const selected =
                        (selections[key] || []).includes(option);

                      return (
                        <button
                          key={option}
                          onClick={() => toggleOption(option)}
                          className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                            selected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {option}
                          {selected && (
                            <Check className="inline ml-2 h-4 w-4" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setStep(Math.max(0, step - 1))
                      }
                      disabled={step === 0}
                    >
                      Previous
                    </Button>

                    {step < steps.length - 1 ? (
                      <Button
                        onClick={() => setStep(step + 1)}
                        disabled={(selections[key] || []).length === 0}
                      >
                        Next{" "}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    ) : (
                      <Button onClick={handleProceed}>
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </>
      }
      orderSummary={
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-display">
              Order Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {allSelections.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Start selecting ingredients…
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allSelections.map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>
            )}

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-display text-2xl font-bold text-primary">
                ₹{totalPrice}
              </span>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleProceed}
            >
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      }
    />
  );
}