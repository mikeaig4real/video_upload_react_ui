import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Settings } from "lucide-react";
import {
  type VideoFilters,
  type OrderBy,
  type Order,
} from "@/types/video_filters";
import type { UploadedVideo } from "@/types/uploaded_video";
import { VIDEO_FILTER_DEFAULTS } from "@/assets/filters";

interface VideoFiltersProps {
  onFiltersChange: (filters: VideoFilters) => void;
  debounceDelay?: number;
  isLoading?: boolean;
}

const UPLOAD_STATUS_OPTIONS: {
  value: UploadedVideo["upload_status"];
  label: string;
}[] = [
  { value: "idle", label: "Idle" },
  { value: "uploading", label: "Uploading" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "error", label: "Error" },
];

const VIDEO_LABEL_OPTIONS: { value: UploadedVideo["label"]; label: string }[] =
  [
    { value: "240p", label: "240p" },
    { value: "360p", label: "360p" },
    { value: "480p", label: "480p" },
    { value: "720p", label: "720p" },
    { value: "1080p", label: "1080p" },
    { value: "4K", label: "4K" },
  ];

const ORDER_BY_OPTIONS: { value: OrderBy; label: string }[] = [
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" },
];

const ORDER_OPTIONS: { value: Order; label: string }[] = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

/* TODO: 
refactor to probably use react-hook form with zod, 
only allow filter button to be clickable to open if there are no active uploads or loading is false
sync this component functionality with state and check fields properly
*/
export default function VideoFiltersComponent({
  onFiltersChange,
  debounceDelay = 2000,
  isLoading = false,
}: VideoFiltersProps) {
  const [filters, setFilters] = useState<VideoFilters>(VIDEO_FILTER_DEFAULTS);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedOnFiltersChange = useCallback(
    (newFilters: VideoFilters) => {
      const timeoutId = setTimeout(() => {
        onFiltersChange(newFilters);
      }, debounceDelay);

      return () => clearTimeout(timeoutId);
    },
    [onFiltersChange, debounceDelay]
  );

  useEffect(() => {
    const cleanup = debouncedOnFiltersChange(filters);
    return cleanup;
  }, [filters, debouncedOnFiltersChange]);

  const updateFilter = useCallback(
    (key: keyof VideoFilters, value: string | unknown) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value === "" ? undefined : value,
      }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters(VIDEO_FILTER_DEFAULTS);
  }, []);

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (
        key === "limit" ||
        key === "page" ||
        key === "order_by" ||
        key === "order"
      ) {
        return false; // Don't count pagination/sorting as active filters
      }
      return value !== undefined && value !== "";
    }).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="absolute top-[-0.5rem] right-4 z-60">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all absolute top-[-1rem] right-4 z-50"
            >
              <Settings className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          >
            <Card className="w-80 bg-background/95 backdrop-blur-sm border shadow-xl dark:bg-black">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                    </CardTitle>
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className=" dark:bg-black space-y-8 max-h-96 overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                      },
                    },
                  }}
                >
                
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="mb-2"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm">
                        Search Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="Search..."
                        value={filters.title || ""}
                        onChange={(e) => updateFilter("title", e.target.value)}
                        disabled={isLoading}
                        className="h-8"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="mb-2"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm">
                        Video Type
                      </Label>
                      <Input
                        id="type"
                        placeholder="e.g., mp4, avi..."
                        value={filters.type || ""}
                        onChange={(e) => updateFilter("type", e.target.value)}
                        disabled={isLoading}
                        className="h-8"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="mb-2"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm">Upload Status</Label>
                      <Select
                        value={filters.upload_status || "idle"}
                        onValueChange={(value) =>
                          updateFilter("upload_status", value || undefined)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-black">
                          <SelectItem value={"all"}>All Statuses</SelectItem>
                          {UPLOAD_STATUS_OPTIONS.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value!}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="mb-2"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm">Video Label</Label>
                      <Select
                        value={filters.label || "personal"}
                        onValueChange={(value) =>
                          updateFilter("label", value || undefined)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All labels" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-black">
                          <SelectItem value="personal">All Labels</SelectItem>
                          {VIDEO_LABEL_OPTIONS.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value!}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="mb-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_public"
                        checked={filters.is_public === true}
                        onCheckedChange={(checked) =>
                          updateFilter("is_public", checked ? true : undefined)
                        }
                        disabled={isLoading}
                      />
                      <Label htmlFor="is_public" className="text-sm">
                        Public only
                      </Label>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="mb-2"
                  >
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                      <div className="space-y-2">
                        <Label className="text-sm">Sort By</Label>
                        <Select
                          value={filters.order_by}
                          onValueChange={(value: OrderBy) =>
                            updateFilter("order_by", value)
                          }
                          disabled={isLoading}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-black">
                            {ORDER_BY_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Order</Label>
                        <Select
                          value={filters.order}
                          onValueChange={(value: Order) =>
                            updateFilter("order", value)
                          }
                          disabled={isLoading}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-black">
                            {ORDER_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="mb-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="limit" className="text-sm">
                          Limit
                        </Label>
                        <Input
                          id="limit"
                          type="number"
                          min="1"
                          max="100"
                          value={filters.limit}
                          onChange={(e) =>
                            updateFilter(
                              "limit",
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                          disabled={isLoading}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="page" className="text-sm">
                          Page
                        </Label>
                        <Input
                          id="page"
                          type="number"
                          min="1"
                          value={filters.page}
                          onChange={(e) =>
                            updateFilter(
                              "page",
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                          disabled={isLoading}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
