import { UserProfile } from "./userProfile.model";

export class UserSession {
    userProfile: UserProfile;

    constructor(userProfile: UserProfile) {
        this.userProfile = userProfile;
    }

    public get isSessionActive() {
        return (this.userProfile.emailAddress != undefined && this.userProfile.emailAddress.length > 0) ? true : false;
    }

    public get isLoggedIn() {
        return (this.userProfile.accountId != undefined && this.userProfile.accountId.length > 0) ? true : false;
    }
}