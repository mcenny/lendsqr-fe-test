import type { User } from '@/types/user'
import './GeneralDetails.scss'

interface Props {
  user: User
}

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="general-details__field">
      <span className="general-details__label">{label}</span>
      <span className="general-details__value">{value}</span>
    </div>
  )
}

export default function GeneralDetails({ user }: Props) {
  const { username, profile, education, socials, guarantors } = user
  return (
    <div className="general-details">
      <section className="general-details__section">
        <h3 className="general-details__section-title">Personal Information</h3>
        <div className="general-details__grid">
          <Field label="Full Name" value={username} />
          <Field label="Phone Number" value={profile.phoneNumber} />
          <Field label="Email Address" value={profile.emailAddress} />
          <Field label="BVN" value={profile.bvn} />
          <Field label="Gender" value={profile.gender} />
          <Field label="Marital Status" value={profile.maritalStatus} />
          <Field label="Children" value={profile.children} />
          <Field label="Type of Residence" value={profile.typeOfResidence} />
        </div>
      </section>

      <section className="general-details__section">
        <h3 className="general-details__section-title">Education and Employment</h3>
        <div className="general-details__grid">
          <Field label="Level of Education" value={education.levelOfEducation} />
          <Field label="Employment Status" value={education.employmentStatus} />
          <Field label="Sector of Employment" value={education.sectorOfEmployment} />
          <Field label="Duration of Employment" value={education.durationOfEmployment} />
          <Field label="Office Email" value={education.officeEmail} />
          <Field label="Monthly Income" value={education.monthlyIncome} />
          <Field label="Loan Repayment" value={education.loanRepayment} />
        </div>
      </section>

      <section className="general-details__section">
        <h3 className="general-details__section-title">Socials</h3>
        <div className="general-details__grid">
          <Field label="Twitter" value={socials.twitter} />
          <Field label="Facebook" value={socials.facebook} />
          <Field label="Instagram" value={socials.instagram} />
        </div>
      </section>

      {guarantors.map((g, i) => (
        <section key={i} className="general-details__section">
          <h3 className="general-details__section-title">Guarantor</h3>
          <div className="general-details__grid">
            <Field label="Full Name" value={g.fullName} />
            <Field label="Phone Number" value={g.phoneNumber} />
            <Field label="Email Address" value={g.emailAddress} />
            <Field label="Relationship" value={g.relationship} />
          </div>
        </section>
      ))}
    </div>
  )
}
