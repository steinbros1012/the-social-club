export type PaymentStatus = 'pending' | 'paid' | 'scholarship' | 'canceled' | 'refunded'
export type RegistrationStatus = 'incomplete' | 'complete' | 'waitlist' | 'canceled'

export interface RegistrationFormData {
  // Participant
  participantFirstName: string
  participantLastName: string
  participantDob: string
  participantEmail: string
  participantPhone: string
  // Caregiver
  caregiverFirstName: string
  caregiverLastName: string
  caregiverRelationship: string
  caregiverEmail: string
  caregiverPhone: string
  // Emergency
  emergencyContactName: string
  emergencyContactPhone: string
  // Preferences
  accommodationNotes: string
  dietaryNotes: string
  // Scholarship
  scholarshipRequested: boolean
}
