"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const redirectTo = searchParams.get("redirect") || "/profile";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError("Неверный email или пароль");
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { data: existingProfiles, error: phoneCheckError } = await supabase
      .from("profiles")
      .select("id")
      .eq("phone", phone)
      .limit(1);

    if (phoneCheckError) {
      setError("Ошибка проверки телефона. Попробуйте позже.");
      setLoading(false);
      return;
    }

    if (existingProfiles && existingProfiles.length > 0) {
      setError("Пользователь с таким телефоном уже существует");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data?.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        phone,
        full_name: fullName,
        role: "user",
      });

      if (profileError) {
        setError("Ошибка создания профиля. Попробуйте позже.");
        setLoading(false);
        return;
      }
    }

    setMessage(
      "Регистрация прошла успешно! Проверьте email для подтверждения аккаунта."
    );
    setLoading(false);
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error: phoneError } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (phoneError) {
      setError("Ошибка отправки кода. Проверьте номер телефона.");
      setLoading(false);
      return;
    }

    setMessage("Код подтверждения отправлен на ваш телефон");
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center uppercase tracking-wider">
        {mode === "login" ? "Вход" : "Регистрация"}
      </h1>

      <Tabs
        value={mode}
        onValueChange={(v) => {
          setMode(v as "login" | "register");
          setError("");
          setMessage("");
        }}
      >
        <TabsList className="w-full mb-6">
          <TabsTrigger value="login" className="flex-1">
            Вход
          </TabsTrigger>
          <TabsTrigger value="register" className="flex-1">
            Регистрация
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          {message && (
            <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm mb-4">
              {message}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="loginEmail">Email</Label>
              <Input
                id="loginEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="loginPassword">Пароль</Label>
              <Input
                id="loginPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Загрузка..." : "Войти"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Или войдите по номеру телефона
            </p>
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <Label htmlFor="phoneLogin">Телефон</Label>
                <Input
                  id="phoneLogin"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+375 (29) 123-45-67"
                  required
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Отправка..." : "Получить код"}
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="register">
          {message && (
            <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm mb-4">
              {message}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="regName">ФИО *</Label>
              <Input
                id="regName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="regPhone">Телефон *</Label>
              <Input
                id="regPhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+375 (29) 123-45-67"
              />
            </div>
            <div>
              <Label htmlFor="regEmail">Email *</Label>
              <Input
                id="regEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="regPassword">Пароль *</Label>
              <Input
                id="regPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}