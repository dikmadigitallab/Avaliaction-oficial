import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

const BUCKET = "anexo"
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const formId = formData.get("formId") as string | null
    const questionId = formData.get("questionId") as string | null

    if (!file || !formId || !questionId) {
      return NextResponse.json(
        { error: "Arquivo, formId e questionId são obrigatórios" },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo deve ter no máximo 10MB" },
        { status: 400 }
      )
    }

    // Gera nome único: formId/questionId/timestamp.ext
    const ext = file.name.split(".").pop() || "bin"
    const fileName = `${formId}/${questionId}/${Date.now()}.${ext}`

    // Converte File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload para Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      })

    if (error) {
      console.error("Erro no upload Supabase:", error)
      return NextResponse.json(
        { error: "Erro ao enviar arquivo" },
        { status: 500 }
      )
    }

    // Gera URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(data.path)

    return NextResponse.json({
      url: urlData.publicUrl,
      name: file.name,
      type: file.type,
      size: file.size,
    })
  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json(
      { error: "Erro ao processar upload" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const path = searchParams.get("path")

    if (!path) {
      return NextResponse.json(
        { error: "path é obrigatório" },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .remove([path])

    if (error) {
      console.error("Erro ao deletar:", error)
      return NextResponse.json(
        { error: "Erro ao deletar arquivo" },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Erro ao deletar:", error)
    return NextResponse.json(
      { error: "Erro ao processar exclusão" },
      { status: 500 }
    )
  }
}
