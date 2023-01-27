import { UserProfile } from "./userProfile.model";

export class UserSession {
    userProfile: UserProfile;

    constructor(userProfile: UserProfile) {
        this.userProfile = userProfile;
    }

    public get isLoggedIn() {
        return this.userProfile.accountId ? true : false;
    }
}