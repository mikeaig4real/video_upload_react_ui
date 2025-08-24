import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Edit3, Check, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import type { User } from "@/types/user";

// todo: Use CustomForm component
export default function User() {
  const { user, setUser } = useStore();
  const [profile, setProfile] = useState<User>(user!);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(profile.username);

  const onSave = () => {
    setUser(profile);
  };

  const hasProfileChanged = JSON.stringify(profile) !== JSON.stringify(user);

  const handleProfileChange = (field: keyof User, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleUsernameEdit = () => {
    setTempUsername(profile.username);
    setIsEditingUsername(true);
  };

  const handleUsernameSave = () => {
    setProfile((prev) => ({ ...prev, username: tempUsername }));
    setIsEditingUsername(false);
  };

  const handleUsernameCancel = () => {
    setTempUsername(profile.username);
    setIsEditingUsername(false);
  };

  const handleSave = () => {
    onSave();
  };

  const getInitials = (user: User) => {
    return user?.firstName && user?.lastName
      ? `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(
          0
        )}`.toUpperCase()
      : user.username?.charAt(0).toUpperCase() || "JD";
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl mx-auto relative bg-transparent border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {hasProfileChanged ? "Modified" : "Saved"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={profile.avatar || ""}
                  alt={profile.username}
                />
                <AvatarFallback className="text-lg">
                  {getInitials(user!)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-center gap-2">
              {isEditingUsername ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="text-center font-semibold"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUsernameSave();
                      if (e.key === "Escape") handleUsernameCancel();
                    }}
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleUsernameSave}
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleUsernameCancel}
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h3 className="text-xl font-semibold">@{profile.username}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleUsernameEdit}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) =>
                  handleProfileChange("firstName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) =>
                  handleProfileChange("lastName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile.email} readOnly />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={profile.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) =>
                  handleProfileChange("location", e.target.value)
                }
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => handleProfileChange("website", e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
          <Separator />
        </CardContent>

        {hasProfileChanged && (
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setProfile(user!);
                setIsEditingUsername(false);
              }}
            >
              Reset Changes
            </Button>
            <Button onClick={handleSave}>Save Profile</Button>
          </CardFooter>
        )}
      </Card>
    </TooltipProvider>
  );
}
