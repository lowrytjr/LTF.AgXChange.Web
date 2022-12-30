export class AuthenticateRequest {
    password: string | undefined;
    emailToken: string | undefined;

    constructor(password: string, emailToken: string) {
        this.password = password;
        this.emailToken = emailToken;
    }
}

