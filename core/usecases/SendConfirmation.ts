import { UserRepository } from "../ports/UserRepository";
import { EmailSender } from "../ports/EmailSender";
import { buildVerificationLink } from "@/lib/emailConfig";

export class SendConfirmation {
	constructor(
		private readonly users: UserRepository,
		private readonly emailSender: EmailSender
	) {}

	async execute(email: string) {
		if (!email) {
			throw new Error("Missing verification email");
		}

		const user = await this.users.findByEmail(email);

		if (!user) {
			throw new Error("User not found");
		}

		const token =
			typeof crypto !== "undefined" && (crypto as any).randomUUID
				? (crypto as any).randomUUID()
				: Date.now().toString();

		user.token = token;
		user.isVerified = false;

		await this.users.save(user);

		const verifyLink = buildVerificationLink(token);
		await this.emailSender.sendVerification(verifyLink, email);

		return { success: true };
	}
}
