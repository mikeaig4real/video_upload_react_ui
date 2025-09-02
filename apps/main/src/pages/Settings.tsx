import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SettingItem } from "@shared/types/settings";
import { useStore } from "@/store/useStore";

export default function Settings() {
  const { appSettings, setAppSettings } = useStore();
  const [currentSettings, setCurrentSettings] =
    useState<SettingItem[]>(appSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const onSave = () => {
    setAppSettings(currentSettings);
  };

  useEffect(() => {
    const changed = currentSettings.some(
      (current, index) => current.isOn !== appSettings[index]?.isOn
    );
    setHasChanges(changed);
  }, [appSettings, currentSettings]);

  const handleToggle = (index: number) => {
    setCurrentSettings((prev) =>
      prev.map((setting, i) =>
        i === index ? { ...setting, isOn: !setting.isOn } : setting
      )
    );
  };

  const handleSave = () => {
    onSave();
    setHasChanges(false);
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl mx-auto relative bg-transparent border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
        <CardContent className="space-y-6">
          {currentSettings.map((setting, index) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium leading-none">
                    {setting.title}
                  </h4>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{setting.extraInfo}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch
                checked={setting.isOn}
                onCheckedChange={() => handleToggle(index)}
              />
            </div>
          ))}

          {hasChanges && (
            <div className="pt-4 border-t">
              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
