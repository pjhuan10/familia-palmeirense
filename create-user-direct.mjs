import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xtxcprqdwrwtnmihhmrn.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = "pjhuan10@gmail.com";
const password = "SuaSenhaNova123!";
const nome = "Jhuan Pablo";

const { data: listData, error: listError } = await admin.auth.admin.listUsers();

if (listError) {
  console.error("Erro ao listar usuários:", listError.message);
  process.exit(1);
}

const existingUser = listData.users.find((u) => u.email === email);

if (existingUser) {
  const { error: updateError } = await admin.auth.admin.updateUserById(existingUser.id, {
    password,
    email_confirm: true,
    user_metadata: {
      nome,
    },
  });

  if (updateError) {
    console.error("Erro ao atualizar usuário:", updateError.message);
    process.exit(1);
  }

  console.log("Usuário existente atualizado com senha.");
} else {
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      nome,
    },
  });

  if (createError) {
    console.error("Erro ao criar usuário:", createError.message);
    process.exit(1);
  }

  console.log("Usuário criado com sucesso.");
}
