import { Component } from "react";
import { toast } from "sonner";
import ErrorDisplay from "@/components/ErrorDisplay";

export default class AppErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    toast.error(error.message || "Unexpected error");
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay />;
    }
    return this.props.children;
  }
}
