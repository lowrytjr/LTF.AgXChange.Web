export class RegistrationState {
    isNewAccount: boolean;
    emailAddress: string;
    screenName: string;

    constructor(isNewAccount: boolean, emailAddress: string, screenName: string) {
        this.isNewAccount = isNewAccount;
        this.emailAddress = emailAddress;
        this.screenName = screenName;
    }
}