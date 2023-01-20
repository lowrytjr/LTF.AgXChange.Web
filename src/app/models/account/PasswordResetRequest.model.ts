export class PasswordResetRequest {
    passwordResetToken: string | undefined;
    password: string | undefined;
    verifyPassword: string | undefined;

    constructor(passwordResetToken: string, password: string, verifyPassword: string) {
        this.passwordResetToken = passwordResetToken;
        this.password = password;
        this.verifyPassword = verifyPassword;
    }
}