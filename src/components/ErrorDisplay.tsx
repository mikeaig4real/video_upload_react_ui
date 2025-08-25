import CustomHeader from "@/components/ui/custom-header";

const ErrorDisplay = ({
  header = null,
  description = null,
}: {
  header?: React.ReactNode;
  description?: React.ReactNode;
}) => {
  return (
    <CustomHeader
      header={header || "Something broke..."}
      description={
        description || "Maybe refresh or go back to previous page..."
      }
    />
  );
};

export default ErrorDisplay;
