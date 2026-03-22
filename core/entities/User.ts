export interface UserProps {
  _id?: string;
  email: string;
  hashedPassword: string;
  notification: boolean;
  token?: string | null;
  isVerified?: boolean;
  googleId?: string;
  provider?: string;
  theme: string;
  language?: UserLanguage;
}

export type UserLanguage = "english" | "vietnamese" | "spanish" | "chinese";

export class User {
  public readonly _id?: string;
  public readonly email: string;
  private hashedPassword: string;
  public notification: boolean;
  public token: string | null;
  public isVerified: boolean;
  public googleId?: string;
  public provider?: string;
  public theme: string;
  public language: UserLanguage;

  constructor(props: UserProps) {
    if (!props.email.includes("@")) {
      throw new Error("Invalid email format");
    }

    if (!props.hashedPassword) {
      throw new Error("Password hash required");
    }

    this._id = props._id;
    this.email = props.email.toLowerCase();
    this.hashedPassword = props.hashedPassword;
    this.notification = props.notification;
    this.token = props.token ?? null;
    this.isVerified = props.isVerified ?? false;
    this.googleId = props.googleId;
    this.provider = props.provider;
    this.theme = props.theme;
    this.language = props.language ?? "english";
  }

  verifyEmail() {
    this.isVerified = true;
    this.token = null;
  }

  enableNotifications() {
    this.notification = true;
  }

  disableNotifications() {
    this.notification = false;
  }
  changeTheme(){
    if (this.theme === "dark") this.theme = "white";
    else this.theme = "dark"
  }

  changeLanguage(language: UserLanguage) {
    this.language = language;
  }

  changePassword(newHashedPassword: string) {
    this.hashedPassword = newHashedPassword;
  }

  getPasswordHash() {
    return this.hashedPassword;
  }
}