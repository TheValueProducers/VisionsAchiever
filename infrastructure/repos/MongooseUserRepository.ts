import UserModel from "../models/UserModel";
import { UserRepository, CreateUserDTO } from "@/core/ports/UserRepository";
import { User } from "@/core/entities/User";

export class MongooseUserRepository implements UserRepository {
  private mapDoc(doc: any): User {
    return new User({
      _id: doc._id?.toString(),
      email: doc.email,
      hashedPassword: doc.password,
      notification: doc.notification,
      token: doc.token ?? null,
      isVerified: doc.isVerified,
      googleId: doc.googleId,
      provider: doc.provider,
      theme: doc.theme ?? "dark",
      language: doc.language ?? "english",
    });
  }

  async findByEmail(email: string) {
    const doc = await UserModel.findOne({ email }).lean();
    if (!doc) return null;
    return this.mapDoc(doc);
  }

  async findById(id: string) {
    const doc = await UserModel.findById(id).lean();
    if (!doc) return null;
    return this.mapDoc(doc);
  }

  async create(data: CreateUserDTO) {
    const created = await UserModel.create({
      email: data.email,
      password: data.password,
      notification: data.notification,
      token: data.token,
      isVerified: data.isVerified ?? false,
      theme: data.theme ?? "dark",
      language: data.language ?? "english",
    });

    return new User({
      _id: created._id?.toString(),
      email: created.email,
      hashedPassword: created.password,
      notification: created.notification,
      token: created.token,
      isVerified: created.isVerified,
      theme: created.theme,
      language: created.language,
    });
  }

  async findByToken(token: string) {
    const doc = await UserModel.findOne({ token }).lean();
    if (!doc) return null;
    return this.mapDoc(doc);
  }

  async save(user: User) {
    await UserModel.updateOne(
      { email: user.email },
      {
        isVerified: user.isVerified,
        token: user.token,
      }
    );
  }

  async updateTheme(userId: string, theme: string) {
    await UserModel.findByIdAndUpdate(userId, { theme });
  }

  async updateLanguage(userId: string, language: string) {
    await UserModel.findByIdAndUpdate(userId, { language });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
  }
  async findByGoogleId(googleId: string) {
  const doc = await UserModel.findOne({ googleId }).lean();
  if (!doc) return null;
  return this.mapDoc(doc);
}
async linkGoogleAccount(
  userId: string,
  googleId: string,
  name?: string
) {
  const updated = await UserModel.findByIdAndUpdate(
    userId,
    {
      googleId,
      provider: "google",
      ...(name && { name }),
    },
    { new: true } // return updated doc
  ).lean();

  if (!updated) {
    throw new Error("User not found when linking Google account");
  }

  return this.mapDoc(updated);
}
}
