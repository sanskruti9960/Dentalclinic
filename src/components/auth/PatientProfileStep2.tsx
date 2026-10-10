import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PatientProfileInput } from '../../types/clinic';
import {
  User,
  Phone,
  Calendar,
  MapPin,
  HeartPulse,
  AlertTriangle,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  LogOut,
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';

interface PatientProfileStep2Props {
  onSuccess?: () => void;
  onGoBack?: () => void;
  onSignOut?: () => void;
}

export const PatientProfileStep2: React.FC<PatientProfileStep2Props> = ({
  onSuccess,
  onGoBack,
  onSignOut
}) => {
  const { currentUser, completePatientProfile, logout, patients } = useClinic();

  // Check if there is an existing patient record linked to this user (for resume support)
  const existingPatient = currentUser?.patientId
    ? patients.find((p) => p.id === currentUser.patientId)
    : null;

  // Form State
  const [name, setName] = useState(existingPatient?.name || currentUser?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState<number>(existingPatient?.age || 28);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>(
    existingPatient?.gender || 'Female'
  );
  const [phone, setPhone] = useState(existingPatient?.phone || currentUser?.phone || '');
  const [address, setAddress] = useState(existingPatient?.address || '');

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState(existingPatient?.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(existingPatient?.emergencyContact?.phone || '');
  const [emergencyRelation, setEmergencyRelation] = useState(
    existingPatient?.emergencyContact?.relation || 'Family'
  );

  // Medical History
  const [bloodGroup, setBloodGroup] = useState(existingPatient?.bloodGroup || 'O+');
  const [medicalAlerts, setMedicalAlerts] = useState<string[]>(
    existingPatient?.medicalAlerts || []
  );
  const [allergies, setAllergies] = useState<string[]>([]);
  const [currentMedications, setCurrentMedications] = useState('');

  // Dental Reason for Visit
  const [reasonForVisit, setReasonForVisit] = useState(
    existingPatient?.chiefComplaint || 'Routine Dental Checkup & Cleaning'
  );
  const [chiefComplaintDetails, setChiefComplaintDetails] = useState('');
  const [previousDentalHistory, setPreviousDentalHistory] = useState(
    existingPatient?.previousDentalHistory || ''
  );

  // Field Touched / Validation States
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [dobTouched, setDobTouched] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);
  const [complaintTouched, setComplaintTouched] = useState(false);
  const [emergencyPhoneTouched, setEmergencyPhoneTouched] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Validations
  const isNameValid = name.trim().length >= 3 && /^[a-zA-Z\s.'-]+$/.test(name.trim());
  const phoneClean = phone.replace(/\D/g, '');
  const isPhoneValid = phoneClean.length >= 10 && phoneClean.length <= 13;
  const isAddressValid = address.trim().length >= 5;
  const isComplaintValid = chiefComplaintDetails.trim().length >= 5 || reasonForVisit.length > 0;
  const isEmergencyPhoneValid = emergencyPhone.trim() === '' || emergencyPhone.replace(/\D/g, '').length >= 10;

  // Auto-calculate age whenever dateOfBirth changes
  useEffect(() => {
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (!isNaN(calculatedAge) && calculatedAge >= 0 && calculatedAge < 125) {
        setAge(calculatedAge);
      }
    }
  }, [dateOfBirth]);

  const availableMedicalConditions = [
    'Hypertension / High Blood Pressure',
    'Type 1 / Type 2 Diabetes',
    'Cardiac Disease / Heart Murmur',
    'Asthma / Respiratory Conditions',
    'Bleeding Disorder / Taking Blood Thinners',
    'Pregnancy (1st, 2nd, or 3rd Trimester)',
    'Currently Undergoing Chemotherapy / Radiation'
  ];

  const availableAllergies = [
    'Penicillin / Amoxicillin',
    'Latex',
    'Local Anesthesia (Lignocaine)',
    'Aspirin / NSAIDs',
    'Sulfa Drugs'
  ];

  const handleToggleCondition = (condition: string) => {
    setMedicalAlerts((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const handleToggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    setNameTouched(true);
    setPhoneTouched(true);
    setAddressTouched(true);
    setComplaintTouched(true);

    if (!currentUser) {
      setErrorMessage('User session expired. Please sign in again.');
      return;
    }

    if (!isNameValid) {
      setErrorMessage('Please enter a valid legal name (at least 3 alphabetic characters).');
      return;
    }

    if (!isPhoneValid) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (!isAddressValid) {
      setErrorMessage('Please provide your residential address for clinical records (at least 5 characters).');
      return;
    }

    if (emergencyPhone && !isEmergencyPhoneValid) {
      setErrorMessage('Emergency contact phone must be a valid 10-digit phone number.');
      return;
    }

    const fullChiefComplaint = chiefComplaintDetails.trim()
      ? `${reasonForVisit}: ${chiefComplaintDetails.trim()}`
      : reasonForVisit;

    const payload: PatientProfileInput = {
      name: name.trim(),
      dateOfBirth: dateOfBirth || undefined,
      age: Math.max(1, age || 25),
      gender,
      phone: phone.trim(),
      address: address.trim(),
      bloodGroup,
      emergencyContactName: emergencyName.trim() || undefined,
      emergencyContactPhone: emergencyPhone.trim() || undefined,
      emergencyContactRelation: emergencyRelation.trim() || undefined,
      medicalAlerts,
      allergies,
      currentMedications: currentMedications.trim() || undefined,
      chiefComplaint: fullChiefComplaint,
      previousDentalHistory: previousDentalHistory.trim() || undefined
    };

    setIsSubmitting(true);
    const result = completePatientProfile(currentUser.id, payload);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to complete profile. Please verify all entries.');
      return;
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  const handleSignOutClick = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-900">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        
        {/* Top Floating Pill Brand Header (Matching website's Navbar aesthetic) */}
        <header className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xs rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onGoBack && (
              <button
                type="button"
                onClick={onGoBack}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                title="Back to Previous Step"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8 2 5 5 5 9c0 3.5 1.5 6 3 9.5.8 1.8 1.5 3.5 4 3.5s3.2-1.7 4-3.5C17.5 15 19 12.5 19 9c0-4-3-7-7-7z" />
              </svg>
            </div>
            <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide">
              Smita Dental
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Verified Account</span>
            </span>
            <button
              type="button"
              onClick={handleSignOutClick}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-1 rounded-full hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Stepper Header Card */}
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/90 shadow-xs p-6 sm:p-8">
          
          {/* Back Navigation Button */}
          <div className="mb-4 flex items-center justify-between">
            {onGoBack ? (
              <button
                type="button"
                onClick={onGoBack}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-indigo-600" />
                <span>Back to Step 1 (Edit Account)</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-slate-500">Step 2 of 2</span>
            )}

            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 px-3 py-0.5 rounded-full">
              Intake Stage
            </span>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1. Account &amp; Email Verified</span>
              </span>
              <span className="text-indigo-600 font-extrabold">2. Patient Clinical Intake</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="w-1/2 bg-emerald-600"></div>
              <div className="w-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Complete Your Patient Profile
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Authenticated Account:{' '}
              <span className="font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {currentUser?.email}
              </span>
              . Please provide your clinical details so Dr. Smita Bevle can review your health alerts and prepare your operatory visit.
            </p>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div
              className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-8">
            
            {/* SECTION 1: Personal & Contact Information */}
            <fieldset className="space-y-4">
              <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 w-full flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-indigo-950 font-black">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>1. Personal &amp; Demographic Details</span>
                </span>
                <span className="text-[10px] text-rose-500 font-bold lowercase">* required fields</span>
              </legend>

              {/* Full Legal Name */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="patient-name" className="block text-xs font-bold text-slate-700">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  {nameTouched && (
                    <span className={`text-[10px] font-bold ${isNameValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isNameValid ? '✓ Valid name' : 'Min 3 letters required'}
                    </span>
                  )}
                </div>
                <input
                  id="patient-name"
                  type="text"
                  required
                  value={name}
                  onBlur={() => setNameTouched(true)}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!nameTouched) setNameTouched(true);
                  }}
                  placeholder="e.g. Ananya Deshmukh"
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                    nameTouched && !isNameValid
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-300 focus:border-indigo-600'
                  }`}
                />
              </div>

              {/* DOB, Age, Gender Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="patient-dob" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="patient-dob"
                    type="date"
                    required
                    value={dateOfBirth}
                    onBlur={() => setDobTouched(true)}
                    onChange={(e) => {
                      setDateOfBirth(e.target.value);
                      if (!dobTouched) setDobTouched(true);
                    }}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="patient-age" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Age (Years) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="patient-age"
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none font-mono transition"
                  />
                </div>

                <div>
                  <label htmlFor="patient-gender" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="patient-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none cursor-pointer transition"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Phone & Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="patient-phone" className="block text-xs font-bold text-slate-700">
                      Mobile Phone Number <span className="text-rose-500">*</span>
                    </label>
                    {phoneTouched && (
                      <span className={`text-[10px] font-bold ${isPhoneValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPhoneValid ? '✓ 10 digits valid' : '10 digits required'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="patient-phone"
                      type="tel"
                      required
                      value={phone}
                      onBlur={() => setPhoneTouched(true)}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (!phoneTouched) setPhoneTouched(true);
                      }}
                      placeholder="+91 98200 44521"
                      className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none font-mono transition ${
                        phoneTouched && !isPhoneValid
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-slate-300 focus:border-indigo-600'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="patient-blood" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Blood Group
                  </label>
                  <select
                    id="patient-blood"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none font-mono cursor-pointer transition"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Residential Address */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="patient-address" className="block text-xs font-bold text-slate-700">
                    Residential Address <span className="text-rose-500">*</span>
                  </label>
                  {addressTouched && (
                    <span className={`text-[10px] font-bold ${isAddressValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isAddressValid ? '✓ Address recorded' : 'Min 5 characters'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    id="patient-address"
                    type="text"
                    required
                    value={address}
                    onBlur={() => setAddressTouched(true)}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (!addressTouched) setAddressTouched(true);
                    }}
                    placeholder="Flat / House No, Street name, City, PIN Code"
                    className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                      addressTouched && !isAddressValid
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-300 focus:border-indigo-600'
                    }`}
                  />
                </div>
              </div>
            </fieldset>

            {/* SECTION 2: Emergency Contact */}
            <fieldset className="space-y-4">
              <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 w-full flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-indigo-950 font-black">
                  <HeartPulse className="w-3.5 h-3.5 text-indigo-600" />
                  <span>2. Emergency Contact Person</span>
                </span>
                <span className="text-[10px] text-slate-400">Recommended</span>
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="emergency-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contact Name
                  </label>
                  <input
                    id="emergency-name"
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="e.g. Ramesh Deshmukh"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="emergency-relation" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Relationship
                  </label>
                  <select
                    id="emergency-relation"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none cursor-pointer transition"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="emergency-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Emergency Phone
                  </label>
                  <input
                    id="emergency-phone"
                    type="tel"
                    value={emergencyPhone}
                    onBlur={() => setEmergencyPhoneTouched(true)}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+91 98200 11111"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none font-mono transition"
                  />
                </div>
              </div>
            </fieldset>

            {/* SECTION 3: Medical History & Alerts */}
            <fieldset className="space-y-4">
              <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 w-full flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-indigo-950 font-black">
                  <AlertTriangle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>3. Health History &amp; Medical Alerts</span>
                </span>
                <span className="text-[10px] text-slate-400">Clinical Safety</span>
              </legend>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Existing Medical Conditions (Click to select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableMedicalConditions.map((condition) => {
                    const isChecked = medicalAlerts.includes(condition);
                    return (
                      <button
                        type="button"
                        key={condition}
                        onClick={() => handleToggleCondition(condition)}
                        className={`p-2.5 rounded-2xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[11px] leading-snug">{condition}</span>
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 ml-1.5" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0 ml-1.5"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Known Drug &amp; Material Allergies
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableAllergies.map((allergy) => {
                    const isChecked = allergies.includes(allergy);
                    return (
                      <button
                        type="button"
                        key={allergy}
                        onClick={() => handleToggleAllergy(allergy)}
                        className={`px-3 py-1.5 rounded-full border text-xs transition cursor-pointer flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{allergy}</span>
                        {isChecked && <CheckCircle2 className="w-3 h-3 text-amber-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="patient-meds" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Medications (Optional)
                </label>
                <input
                  id="patient-meds"
                  type="text"
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  placeholder="e.g. Metformin 500mg, Telmisartan 40mg daily..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none transition"
                />
              </div>
            </fieldset>

            {/* SECTION 4: Dental Concerns & Reason for Visit */}
            <fieldset className="space-y-4">
              <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 w-full flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-indigo-950 font-black">
                  <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                  <span>4. Dental Concerns &amp; Reason for Visit</span>
                </span>
                <span className="text-[10px] text-rose-500 font-bold lowercase">* required</span>
              </legend>

              <div>
                <label htmlFor="reason-visit" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Primary Reason for Visit <span className="text-rose-500">*</span>
                </label>
                <select
                  id="reason-visit"
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none cursor-pointer transition"
                >
                  <option value="Routine Dental Checkup & Cleaning">Routine Dental Checkup &amp; Cleaning</option>
                  <option value="Toothache / Tooth Sensitivity">Toothache / Severe Tooth Sensitivity</option>
                  <option value="Broken Tooth / Dental Filling">Broken Tooth / Damaged Dental Filling</option>
                  <option value="Root Canal Treatment Consultation">Root Canal Treatment (RCT) Consultation</option>
                  <option value="Dental Crown or Bridge">Dental Crown or Bridge Restoration</option>
                  <option value="Dental Implant Consultation">Dental Implant Placement Consultation</option>
                  <option value="Bleeding Gums / Gum Disease">Bleeding Gums / Periodontal Scaling</option>
                  <option value="Orthodontic / Braces & Aligners">Orthodontic / Braces &amp; Aligners</option>
                  <option value="Cosmetic Dentistry / Teeth Whitening">Cosmetic Dentistry / Teeth Whitening</option>
                  <option value="Wisdom Tooth Extraction">Wisdom Tooth Pain / Extraction</option>
                  <option value="Other Dental Concern">Other Dental Concern</option>
                </select>
              </div>

              <div>
                <label htmlFor="chief-details" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Chief Complaint / Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="chief-details"
                  rows={2}
                  required
                  value={chiefComplaintDetails}
                  onBlur={() => setComplaintTouched(true)}
                  onChange={(e) => {
                    setChiefComplaintDetails(e.target.value);
                    if (!complaintTouched) setComplaintTouched(true);
                  }}
                  placeholder="Describe your current symptoms, location of tooth pain, or specific goals for your visit..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="past-dental" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Past Dental Treatment History (Optional)
                </label>
                <input
                  id="past-dental"
                  type="text"
                  value={previousDentalHistory}
                  onChange={(e) => setPreviousDentalHistory(e.target.value)}
                  placeholder="e.g. Fillings 2 years ago, braces completed, extraction..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none transition"
                />
              </div>
            </fieldset>

            {/* Privacy & Confidentiality Notice Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-150 flex items-start gap-3 text-xs text-indigo-950 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-indigo-900 block mb-0.5">Healthcare Confidentiality &amp; Record Protection</span>
                Your dental and medical records are stored securely and accessible only by your treating doctor, Dr. Smita Bevle.
              </div>
            </div>

            {/* Submit & Back Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              {onGoBack && (
                <button
                  type="button"
                  onClick={onGoBack}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Step 1</span>
                </button>
              )}

              <div className="w-full sm:w-auto flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleSignOutClick}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-center"
                >
                  Save &amp; Finish Later
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs transition shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>{isSubmitting ? 'Registering...' : 'Complete Intake & Enter Portal'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400">
          Smita Dental Clinic • Secure Patient Electronic Health Record Intake
        </p>
      </div>
    </div>
  );
};
