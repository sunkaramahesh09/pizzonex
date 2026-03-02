import { CheckCircle2, Circle } from "lucide-react";

const steps = ["Order Received", "In Kitchen", "Sent to Delivery", "Delivered"];

interface OrderStatusTrackerProps {
  currentStatus: string;
}

export default function OrderStatusTracker({ currentStatus }: OrderStatusTrackerProps) {
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, i) => {
        const isComplete = i <= currentIndex;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
              )}
              <span
                className={`text-[10px] mt-1 text-center leading-tight ${
                  isComplete ? "text-success font-medium" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 rounded ${
                  i < currentIndex ? "bg-success" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
