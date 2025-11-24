import { NextResponse } from "next/server";
import { generateCutList } from "@/app/lib/builder/cut-list";
import type { BuilderEntity } from "@/app/lib/builder/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entities = (body?.entities ?? []) as BuilderEntity[];
    const cutList = generateCutList(entities);

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      cutList,
    });
  } catch (error) {
    console.error("[export] Failed to generate cut list", error);
    return NextResponse.json(
      { error: "Failed to generate cut list" },
      { status: 400 }
    );
  }
}
