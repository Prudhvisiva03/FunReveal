import { withDb } from "./db";

export const DEFAULT_PRICE_PAISE = 100; // ₹1 INR (100 paise)

export async function getToolPricePaise(): Promise<number> {
  const setting = await withDb(
    (prisma) => prisma.siteSetting.findUnique({ where: { key: "default_price_paise" } }),
    null
  );

  if (setting && setting.value) {
    const parsed = parseInt(setting.value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  const envPrice = process.env.DEFAULT_TOOL_PRICE_PAISE;
  if (envPrice) {
    const parsed = parseInt(envPrice, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return DEFAULT_PRICE_PAISE;
}

export async function isToolEnabled(toolKey: string): Promise<boolean> {
  const setting = await withDb(
    (prisma) => prisma.siteSetting.findUnique({ where: { key: `tool_${toolKey}_enabled` } }),
    null
  );

  if (setting) {
    return setting.value === "true";
  }
  return true;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const settings = await withDb(
    (prisma) => prisma.siteSetting.findMany(),
    []
  );

  if (settings && settings.length > 0) {
    const result: Record<string, string> = {};
    settings.forEach((s) => {
      result[s.key] = s.value;
    });
    return result;
  }

  return {
    default_price_paise: String(DEFAULT_PRICE_PAISE),
    site_name: "FunReveal",
    site_tagline: "Discover. Calculate. Unlock.",
    contact_email: "support@funreveal.com",
  };
}
