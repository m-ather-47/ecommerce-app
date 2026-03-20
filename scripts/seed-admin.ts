import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const UserSchema = new mongoose.Schema(
  {
    neonAuthId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    phone: { type: String },
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    const adminEmail = "ather@gmail.com";

    // Check if user already exists
    let user = await User.findOne({ email: adminEmail });

    if (user) {
      // Update existing user to admin
      user.role = "admin";
      await user.save();
      console.log(`\nUpdated existing user "${adminEmail}" to admin role`);
    } else {
      // Create a placeholder admin user
      // Note: neonAuthId will be updated when the user signs up
      user = await User.create({
        neonAuthId: `admin_${Date.now()}`,
        email: adminEmail,
        name: "Ather",
        role: "admin",
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
    console.log("\nIMPORTANT: Sign up at /auth/sign-up with these credentials,");
    console.log("then run this script again to grant admin role.");
    console.log("=================================\n");

    await mongoose.disconnect();
    console.log("Done!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
