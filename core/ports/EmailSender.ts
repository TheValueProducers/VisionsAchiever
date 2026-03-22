export interface EmailSender {
  sendVerification(link: string, email: string): Promise<any>;
}
