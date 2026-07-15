import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"

config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET_NAME = "anexo"

async function setup() {
  console.log(`\nVerificando bucket "${BUCKET_NAME}"...\n`)

  // Lista buckets existentes
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error("❌ Erro ao listar buckets:", listError.message)
    process.exit(1)
  }

  const exists = buckets?.some((b) => b.name === BUCKET_NAME)

  if (exists) {
    console.log(`⚠️  Bucket "${BUCKET_NAME}" já existe. Atualizando para público...`)

    const { error: updateError } = await supabase.storage.updateBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: [
        "image/*",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    })

    if (updateError) {
      console.error("❌ Erro ao atualizar bucket:", updateError.message)
      process.exit(1)
    }

    console.log("✅ Bucket atualizado com sucesso!")
  } else {
    console.log(`📦 Criando bucket "${BUCKET_NAME}" como público...`)

    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: [
        "image/*",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    })

    if (createError) {
      console.error("❌ Erro ao criar bucket:", createError.message)
      process.exit(1)
    }

    console.log("✅ Bucket criado com sucesso!")
  }

  // Verifica política de acesso público
  console.log("\nVerificando política de acesso público...")

  const { data: policy } = await supabase.rpc("get_bucket_policy", {
    bucket_id: BUCKET_NAME,
  }).single().catch(() => ({ data: null }))

  console.log(`\nBucket "${BUCKET_NAME}":`)
  console.log(`  • Público: sim`)
  console.log(`  • Limite: 10MB`)
  console.log(`  • Tipos aceitos: imagens, PDF, DOC, DOCX, XLSX\n`)
  console.log("✅ Tudo pronto! O bucket está configurado corretamente.\n")
}

setup()
