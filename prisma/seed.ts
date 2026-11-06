import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@funreveal.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@FunReveal2024!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // 1. Seed admin user
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "FunReveal SuperAdmin",
      isActive: true,
    },
    create: {
      email: adminEmail,
      name: "FunReveal SuperAdmin",
      passwordHash,
      isActive: true,
    },
  });

  console.log(`✅ Seeded Admin User: ${admin.email}`);

  // 2. Seed default site settings
  const defaultSettings = [
    { key: "default_price_paise", value: "500" }, // ₹5
    { key: "site_name", value: "FunReveal" },
    { key: "site_tagline", value: "Discover. Calculate. Unlock." },
    { key: "contact_email", value: "support@funreveal.com" },
    { key: "contact_phone", value: "+91 98765 43210" },
    { key: "contact_address", value: "Bangalore, Karnataka, India (Editable in Settings)" },
    { key: "tool_love_calculator_enabled", value: "true" },
    { key: "tool_friendship_calculator_enabled", value: "true" },
    { key: "tool_future_partner_enabled", value: "true" },
    { key: "tool_marriage_compatibility_enabled", value: "true" },
    { key: "tool_lucky_number_enabled", value: "true" },
    { key: "tool_best_friend_test_enabled", value: "true" },
    { key: "tool_personality_test_enabled", value: "true" },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log(`✅ Seeded ${defaultSettings.length} site settings`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
