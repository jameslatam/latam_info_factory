import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const { text, totalPages } = await extractText(new Uint8Array(arrayBuffer));

    const fullText = Array.isArray(text) ? text.join("\n\n") : text || "";

    return NextResponse.json({
      text: fullText,
      totalPages,
    });
  } catch (err: any) {
    console.error("Erro ao extrair PDF:", err);
    return NextResponse.json(
      { error: "Falha ao processar e extrair o texto do PDF." },
      { status: 500 }
    );
  }
}
