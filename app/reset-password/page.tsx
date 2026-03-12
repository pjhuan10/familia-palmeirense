"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    setMsg("Senha atualizada com sucesso. Faça login novamente.");
    setLoading(false);
  }

  return (
    <div style={{maxWidth:420,margin:"100px auto",fontFamily:"sans-serif"}}>
      <h2>Definir nova senha</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
          style={{width:"100%",padding:10,marginBottom:10}}
        />

        <button
          type="submit"
          disabled={loading}
          style={{width:"100%",padding:10}}
        >
          {loading ? "Atualizando..." : "Salvar nova senha"}
        </button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  );
}
