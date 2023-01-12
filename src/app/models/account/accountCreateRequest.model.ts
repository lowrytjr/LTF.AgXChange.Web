export class AccountCreateRequest {
    accountRequestToken: string | undefined;
    password: string | undefined;
    verifyPassword: string | undefined;

    constructor(accountRequestToken: string, password: string, verifyPassword: string) {
        this.accountRequestToken = accountRequestToken;
        this.password = password;
        this.verifyPassword = verifyPassword;
    }
}