import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const UpdateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const settings = await prisma.siteSetting.findMany();
  const result: Record<string, string> = {};
  settings.forEach((s) => { result[s.key] = s.value; });
  return NextResponse.json(result);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();
  const validated = UpdateSettingSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json({ error: "INVALID_PARAMS", details: validated.error.issues }, { status: 400 });
  }

  const { key, value } = validated.data;
  const setting = await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  await prisma.auditLog.create({
    data: { action: "SETTING_UPDATED", entity: "SiteSetting", entityId: setting.id, metadata: { key, value } },
  });

  return NextResponse.json(setting);
}
