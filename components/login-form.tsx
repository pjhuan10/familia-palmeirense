"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setMessage("Conta criada com sucesso. Agora faça login com seu e-mail e senha.");
      setMode("login");
      setSenha("");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setMessage("E-mail ou senha inválidos. Se essa conta foi criada antes por link mágico, use 'Esqueci minha senha'.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
    setLoading(false);
  }

  async function handleResetPassword() {
    if (!email) {
      setMessage("Digite seu e-mail para redefinir a senha.");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Enviamos um e-mail para redefinir sua senha.");
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-8 shadow-[0_10px_40px_rgba(22,163,74,0.10)]">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-700">
          Família Palmerense
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          {mode === "login" ? "Entrar no sistema" : "Criar conta"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {mode === "login"
            ? "Entre com e-mail e senha para acessar o controle de empréstimos."
            : "Crie uma conta para acessar o sistema da família."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "register" ? (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Nome</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-green-500"
            />
          </div>
        ) : null}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-green-500"
          />
        </div>

        <div className="mb-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Senha</label>
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-green-500"
          />
        </div>

        {mode === "login" ? (
          <div className="mb-4 text-right">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm font-semibold text-green-700 hover:text-green-800"
            >
              Esqueci minha senha
            </button>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
        >
          {loading
            ? "Carregando..."
            : mode === "login"
              ? "Entrar"
              : "Criar conta"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}

      <div className="mt-6 text-center text-sm text-slate-600">
        {mode === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setMessage("");
          }}
          className="font-semibold text-green-700 hover:text-green-800"
        >
          {mode === "login" ? "Criar agora" : "Entrar"}
        </button>
      </div>
    </div>
  );
}
