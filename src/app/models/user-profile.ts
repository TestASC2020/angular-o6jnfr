import { UserProfileOrg } from './user-org';

export class UserProfile {
  avatarURL: string;
  id: string;
  name: string;
  about: string;
  line1: string;
  line2: string;
  city: string;
  email: string;
  country: string;
  region: string;
  employer: string;
  phone: string;
  specialties: Array<any>;
  experiences: Array<any>;
  orgs: Array<UserProfileOrg>;
  rank: number;
  rankCount: number;
  signature: string;

  constructor() {
    this.specialties = new Array<any>();
    this.experiences = new Array<any>();
    this.orgs = new Array<UserProfileOrg>();
  }
}