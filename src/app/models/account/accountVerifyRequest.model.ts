export class AccountVerifyRequest {
    emailVerifyToken: string;

    constructor(emailVerifyToken: string) {
        this.emailVerifyToken = emailVerifyToken;
    }
}

