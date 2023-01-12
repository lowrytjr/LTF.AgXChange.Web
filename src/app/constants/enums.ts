export enum LoginState {
  init, 
  emailSubmit
}

export enum CreateAccountState {
  collectUserInformation, 
  submitUserInformation,
  collectPasswordInformation, 
  submitPasswordInformation
}