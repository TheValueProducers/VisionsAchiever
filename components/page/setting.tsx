"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmail, handleChangePassword } from "@/app/actions/setting";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/components/context/themeWrapper";
import { useLanguageContext } from "@/components/context/languageWrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SettingPage() {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { isDark, toggleTheme } = useThemeContext();
  const { language, setLanguage, t } = useLanguageContext();
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);


  useEffect(() => {
    const loadEmail = async () => {
      try {
        const result = await getEmail();
        setEmail(result ?? "");
      } catch (error) {
        console.error("Failed to load email:", error);
      }
    };

    loadEmail();
  }, []);

  async function handleSubmitPasswordChange() {
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError(t("passwordMismatch"));
      return;
    }

    setIsChangingPassword(true);
    try {
      await handleChangePassword(currentPassword, newPassword);
      setPasswordSuccess(t("passwordChangeSuccess"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Incorrect current password") {
        setPasswordError(t("incorrectPassword"));
      } else {
        setPasswordError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("account")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[180px_1fr]">
            <Label htmlFor="email">{t("email")}</Label>
            <p id="email" className="text-sm text-muted-foreground">
              {email}
            </p>
          </div>

          <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[180px_1fr]">
            <Label htmlFor="notification-switch">{t("notification")}</Label>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <span className="text-sm text-muted-foreground">
                {notificationsOn ? t("on") : t("off")}
              </span>
              <Switch
                id="notification-switch"
                checked={notificationsOn}
                onCheckedChange={setNotificationsOn}
                aria-label="Toggle notifications"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[180px_1fr]">
            <Label>{t("changePassword")}</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between md:w-auto">
                  {t("changePassword")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setShowChangePassword((prev) => !prev)}>
                  {showChangePassword ? t("hideChangePassword") : t("changePassword")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {showChangePassword ? (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[220px_1fr]">
                <Label htmlFor="current-password">{t("enterCurrentPassword")}</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[220px_1fr]">
                <Label htmlFor="new-password">{t("enterNewPassword")}</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[220px_1fr]">
                <Label htmlFor="confirm-new-password">{t("confirmPassword")}</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-green-600">{passwordSuccess}</p>
              )}

              <Button
                type="button"
                disabled={isChangingPassword}
                onClick={() => void handleSubmitPasswordChange()}
              >
                {t("changePassword")}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("preference")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          

          <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[180px_1fr]">
            <Label htmlFor="notification-switch">{t("darkMode")}</Label>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <span className="text-sm text-muted-foreground">
                {isDark ? t("on") : t("off")}
              </span>
              <Switch
                id="notification-switch"
                checked={isDark}
                onCheckedChange={() => {
                  void toggleTheme();
                }}
                aria-label="Toggle dark mode"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[180px_1fr]">
  <Label>{t("language")}</Label>

  <Select value={language} onValueChange={(value) => { void setLanguage(value as any) }}>
    <SelectTrigger className="w-full md:w-[200px]">
      <SelectValue placeholder={t("selectLanguage")} />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="english">{t("english")}</SelectItem>
      <SelectItem value="vietnamese">{t("vietnamese")}</SelectItem>
      <SelectItem value="spanish">{t("spanish")}</SelectItem>
      <SelectItem value="chinese">{t("chinese")}</SelectItem>
    </SelectContent>
  </Select>
</div>

         

         
        </CardContent>
      </Card>
    </div>
  );
}
