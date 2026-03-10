import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xtxcprqdwrwtnmihhmrn.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY no ambiente.");
  process.exit(1);
}

const [,, nome, email, senha, roleArg] = process.argv;

if (!nome || !email || !senha) {
  console.error(
    'Uso: node create-family-user.mjs "Nome" "email@exemplo.com" "Senha123!" [admin|member]'
  );
  process.exit(1);
}

const role = roleArg === "admin" ? "admin" : "member";

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data: listData, error: listError } = await admin.auth.admin.listUsers();

if (listError) {
  console.error("Erro ao listar usuários:", listError.message);
  process.exit(1);
}

const existingUser = listData.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

if (existingUser) {
  const { error: updateError } = await admin.auth.admin.updateUserById(existingUser.id, {
    email,
    password: senha,
    email_confirm: true,
    user_metadata: {
      nome,
      role,
    },
  });

  if (updateError) {
    console.error("Erro ao atualizar usuário existente:", updateError.message);
    process.exit(1);
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({
      nome,
      email,
      role,
    })
    .eq("id", existingUser.id);

  if (profileError) {
    console.error("Usuário atualizado no Auth, mas houve erro ao atualizar profile:", profileError.message);
    process.exit(1);
  }

  console.log(`Usuário existente atualizado com sucesso: ${email} (${role})`);
  process.exit(0);
}

const { data: createdData, error: createError } = await admin.auth.admin.createUser({
  email,
  password: senha,
  email_confirm: true,
  user_metadata: {
    nome,
    role,
  },
});

if (createError) {
  console.error("Erro ao criar usuário:", createError.message);
  process.exit(1);
}

const userId = createdData.user?.id;

if (!userId) {
  console.error("Usuário criado, mas sem id retornado.");
  process.exit(1);
}

const { error: profileError } = await admin.from("profiles").upsert({
  id: userId,
  nome,
  email,
  role,
});

if (profileError) {
  console.error("Usuário criado no Auth, mas houve erro ao criar/atualizar profile:", profileError.message);
  process.exit(1);
}

console.log(`Usuário criado com sucesso: ${email} (${role})`);
