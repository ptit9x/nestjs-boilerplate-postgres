export interface ILogin {
  username: string;
  password: string;
}

export interface IGoogleProfile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: {
    value: string;
    type: string;
  }[];
  photos: {
    value: string;
  }[];
}
