"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/hooks/use-auth";

interface AuthModalProps {
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
  onClose: () => void;
}

export function AuthModal({ mode, onModeChange, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [consentPd, setConsentPd] = useState(false);
  const [consentOferta, setConsentOferta] = useState(false);
  const [consentDisclaimer, setConsentDisclaimer] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
        onClose();
      } else {
        if (!consentPd || !consentOferta || !consentDisclaimer) {
          setError("Необходимо принять все соглашения");
          setLoading(false);
          return;
        }
        await signUp(
          email,
          password,
          fullName,
          phone,
          consentPd,
          consentOferta,
          consentDisclaimer
        );
        setSuccess(
          "Регистрация прошла успешно! Проверьте email для подтверждения."
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Произошла ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">
          {success}
        </div>
      )}

      {mode === "register" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullName">ФИО</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+375 (29) 123-45-67"
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      {mode === "register" && (
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-2">
            <Checkbox
              id="consentPd"
              checked={consentPd}
              onCheckedChange={(v) => setConsentPd(Boolean(v))}
            />
            <Label
              htmlFor="consentPd"
              className="text-xs text-muted-foreground leading-tight"
            >
              Я даю согласие на обработку персональных данных в соответствии с
              Политикой конфиденциальности
            </Label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="consentOferta"
              checked={consentOferta}
              onCheckedChange={(v) => setConsentOferta(Boolean(v))}
            />
            <Label
              htmlFor="consentOferta"
              className="text-xs text-muted-foreground leading-tight"
            >
              Я принимаю условия Договора публичной оферты
            </Label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="consentDisclaimer"
              checked={consentDisclaimer}
              onCheckedChange={(v) => setConsentDisclaimer(Boolean(v))}
            />
            <Label
              htmlFor="consentDisclaimer"
              className="text-xs text-muted-foreground leading-tight"
            >
              Я ознакомлен с Пользовательским соглашением и принимаю его условия
            </Label>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? "Загрузка..."
          : mode === "login"
          ? "Войти"
          : "Зарегистрироваться"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            Нет аккаунта?{" "}
            <button
              type="button"
              onClick={() => onModeChange("register")}
              className="text-primary hover:underline"
            >
              Зарегистрироваться
            </button>
          </>
        ) : (
          <>
            Уже есть аккаунт?{" "}
            <button
              type="button"
              onClick={() => onModeChange("login")}
              className="text-primary hover:underline"
            >
              Войти
            </button>
          </>
        )}
      </div>
    </form>
  );
}