export type UserStatus = 'active' | 'inactive' | 'pending' | 'blacklisted'
export type UserTier = 1 | 2 | 3

export interface UserGuarantor {
  fullName: string
  phoneNumber: string
  emailAddress: string
  relationship: string
}

export interface UserProfile {
  phoneNumber: string
  emailAddress: string
  bvn: string
  gender: 'Male' | 'Female'
  maritalStatus: string
  children: string
  typeOfResidence: string
}

export interface UserEducation {
  levelOfEducation: string
  employmentStatus: string
  sectorOfEmployment: string
  durationOfEmployment: string
  officeEmail: string
  monthlyIncome: string
  loanRepayment: string
}

export interface UserSocials {
  twitter: string
  facebook: string
  instagram: string
}

export interface User {
  id: string
  organization: string
  username: string
  email: string
  phoneNumber: string
  dateJoined: string
  status: UserStatus
  profile: UserProfile
  education: UserEducation
  socials: UserSocials
  guarantors: [UserGuarantor] | [UserGuarantor, UserGuarantor]
  userTier: UserTier
  accountBalance: string
  accountNumber: string
  bankName: string
}
