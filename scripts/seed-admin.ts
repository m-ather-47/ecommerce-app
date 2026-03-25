import * as dotenv from "dotenv";
import { db, users } from "../src/lib/db";
import { eq } from "drizzle-orm";
import { generateId } from "../src/lib/db/utils";

dotenv.config({ path: ".env.local" });

async function seedAdmin() {
  try {
    const adminEmail = "ather@gmail.com";

    // Check if user already exists
    const existingUserResult = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    let user = existingUserResult[0];

    if (user) {
      // Update existing user to admin
      await db
        .update(users)
        .set({ role: "admin", updatedAt: new Date() })
        .where(eq(users.id, user.id));
      console.log(`\nUpdated existing user "${adminEmail}" to admin role`);
    } else {
      // Create a placeholder admin user
      // Note: neonAuthId will be updated when the user signs up
      await db.insert(users).values({
        id: generateId(),
        neonAuthId: `admin_${Date.now()}`,
        email: adminEmail,
        name: "Ather",
        role: "admin",
        phone: null,
        shippingAddress: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`\nCreated admin user with email: ${adminEmail}`);
    }

    console.log("\n=================================");
    console.log("Admin User Details:");
    console.log("=================================");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ather`);
    console.log(`Role: admin`);
    console.log("=================================");
    console.log("\nIMPORTANT: Sign up at /auth/register with these credentials,");
    console.log("then run this script again to grant admin role.");
    console.log("=================================\n");

    console.log("Done!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
