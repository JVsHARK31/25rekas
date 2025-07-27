import { db } from "./db";
import { users, rkasFields, rkasStandards, rkasActivities } from "@shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Starting database seed...");

  try {
    // Check if admin user exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@rkas.com"))
      .limit(1);

    if (existingAdmin.length === 0) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash("123456", 10);
      const [adminUser] = await db
        .insert(users)
        .values({
          username: "admin",
          email: "admin@rkas.com",
          password: hashedPassword,
          fullName: "Administrator",
          role: "super_admin",
          schoolName: "SMPN 25 Jakarta",
          isActive: true,
        })
        .returning();

      console.log("✓ Admin user created:", adminUser.email);
    } else {
      console.log("✓ Admin user already exists");
    }

    // Create sample RKAS fields if they don't exist
    const existingFields = await db.select().from(rkasFields).limit(1);
    
    if (existingFields.length === 0) {
      const fields = [
        { kodeBidang: "01", namaBidang: "KURIKULUM" },
        { kodeBidang: "02", namaBidang: "KESISWAAN" },
        { kodeBidang: "03", namaBidang: "SARANA & PRASARANA" },
        { kodeBidang: "04", namaBidang: "HUMAS & KEHUMASAN" },
        { kodeBidang: "05", namaBidang: "TATA USAHA" },
      ];

      const insertedFields = await db.insert(rkasFields).values(fields).returning();
      console.log("✓ RKAS fields created:", insertedFields.length);

      // Create sample standards for the first field
      const kurikulumField = insertedFields.find(f => f.kodeBidang === "01");
      if (kurikulumField) {
        const standards = [
          {
            fieldId: kurikulumField.id,
            kodeStandar: "1",
            namaStandar: "Pengembangan Standar Kompetensi Lulusan",
          },
          {
            fieldId: kurikulumField.id,
            kodeStandar: "2",
            namaStandar: "Pengembangan Standar Isi",
          },
          {
            fieldId: kurikulumField.id,
            kodeStandar: "3",
            namaStandar: "Pengembangan Standar Proses",
          },
        ];

        const insertedStandards = await db.insert(rkasStandards).values(standards).returning();
        console.log("✓ RKAS standards created:", insertedStandards.length);

        // Get admin user for sample activities
        const adminUser = await db
          .select()
          .from(users)
          .where(eq(users.email, "admin@rkas.com"))
          .limit(1);

        if (adminUser.length > 0 && insertedStandards.length > 0) {
          const standardIsi = insertedStandards.find(s => s.kodeStandar === "2");
          if (standardIsi) {
            // Create sample activities for years 2024-2030
            const activities = [];
            for (let year = 2024; year <= 2030; year++) {
              activities.push({
                standardId: standardIsi.id,
                kodeGiat: `01.3.02.01.2.00${year - 2023}`,
                namaGiat: `Pengembangan Perpustakaan ${year}`,
                subtitle: `Pembelian buku dan peralatan perpustakaan tahun ${year}`,
                kodeDana: "3.02.01",
                namaDana: "BOP Reguler",
                tw1: (25000000 * (year - 2023)).toString(),
                tw2: (30000000 * (year - 2023)).toString(),
                tw3: (20000000 * (year - 2023)).toString(),
                tw4: (25000000 * (year - 2023)).toString(),
                total: (100000000 * (year - 2023)).toString(),
                realisasi: "0",
                status: year === 2024 ? "approved" as const : "draft" as const,
                createdBy: adminUser[0].id,
              });

              activities.push({
                standardId: standardIsi.id,
                kodeGiat: `01.3.02.01.2.10${year - 2023}`,
                namaGiat: `Pelatihan Guru Kurikulum ${year}`,
                subtitle: `Workshop dan seminar pengembangan kurikulum tahun ${year}`,
                kodeDana: "3.02.02",
                namaDana: "BOS Reguler",
                tw1: (15000000 * (year - 2023)).toString(),
                tw2: "0",
                tw3: (15000000 * (year - 2023)).toString(),
                tw4: "0",
                total: (30000000 * (year - 2023)).toString(),
                realisasi: "0",
                status: year === 2024 ? "approved" as const : "draft" as const,
                createdBy: adminUser[0].id,
              });
            }

            const insertedActivities = await db.insert(rkasActivities).values(activities).returning();
            console.log("✓ Sample activities created:", insertedActivities.length);
          }
        }
      }
    } else {
      console.log("✓ RKAS fields already exist");
    }

    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seed()
    .then(() => {
      console.log("Seed completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}

export { seed };