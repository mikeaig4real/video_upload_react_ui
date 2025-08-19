import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CardWrapper({
  className = "",
  children = null,
  cardTitle = "",
  cardDescription = "",
}: {
  className?: string;
  children?: React.ReactNode | null;
  cardTitle?: string;
  cardDescription?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl capitalize">{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
