"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Briefcase, Contact } from "lucide-react";
import SettingsCard from "@/components/settings/SettingsCard";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { useProfile } from "@/hooks/useProfile";
import { useAlertStore } from "@/store/useAlertStore";
import { accountPhone, apiErrorMessage, updateProfileInfo, UserProfile } from "@/lib/profile";

/** Account phone_code is an ISO country code (e.g. "sa"); fall back to Saudi Arabia. */
const dialCodeCountry = (code?: string | null) =>
  code && /^[a-z]{2}$/i.test(code.trim()) ? code.trim().toLowerCase() : "sa";
import { cn } from "@/lib/utils";

interface FormState {
  job_title: string;
  years_of_experience: string;
  contact_email: string;
  contact_phone: string;
  location: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Contact fields default to the account email / phone until the user sets them. */
function toFormState(profile: UserProfile | null): FormState {
  return {
    job_title: profile?.job_title ?? "",
    years_of_experience:
      profile?.years_of_experience !== null && profile?.years_of_experience !== undefined
        ? String(profile.years_of_experience)
        : "",
    contact_email: profile?.contact_email || profile?.email || "",
    contact_phone: profile?.contact_phone || accountPhone(profile),
    location: profile?.location ?? "",
  };
}

const inputClass =
  "h-11 w-full rounded-[8px] border border-[#D5D7DA] bg-[#FCFCFC] px-3.5 text-[14px] text-[#111827] shadow-[0_1px_2px_rgba(10,13,18,0.05)] outline-none transition placeholder:font-light placeholder:text-[#818282] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15 disabled:opacity-60";

export default function ProfileSettingsPage() {
  const t = useTranslations("settings.profile");
  const locale = useLocale();
  const { showAlert } = useAlertStore();
  const { profile, setProfile, loading } = useProfile();

  const [form, setForm] = useState<FormState>(() => toFormState(null));
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [initialised, setInitialised] = useState(false);

  // Fill the form once the fresh profile is loaded
  useEffect(() => {
    if (!loading && profile && !initialised) {
      setForm(toFormState(profile));
      setInitialised(true);
    }
  }, [loading, profile, initialised]);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    const years = form.years_of_experience.trim();
    if (years && (!/^\d+$/.test(years) || Number(years) > 60)) {
      next.years_of_experience = t("errors.years");
    }
    if (form.contact_email.trim() && !EMAIL_REGEX.test(form.contact_email.trim())) {
      next.contact_email = t("errors.email");
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // PhoneInput returns just the dial code ("+966") when the number is empty
    const phone = form.contact_phone.replace(/\s/g, "");
    const hasPhone = phone.replace(/^\+\d{1,4}$/, "").length > 0;

    setSaving(true);
    try {
      const updated = await updateProfileInfo(
        {
          job_title: form.job_title.trim() || null,
          years_of_experience: form.years_of_experience.trim()
            ? Number(form.years_of_experience.trim())
            : null,
          contact_email: form.contact_email.trim() || null,
          contact_phone: hasPhone ? phone : null,
          location: form.location.trim() || null,
        },
        locale
      );
      setProfile(updated);
      showAlert(t("saved"), true);
    } catch (error) {
      showAlert(apiErrorMessage(error, t("saveFailed")), false);
    } finally {
      setSaving(false);
    }
  };

  const disabled = saving || (loading && !profile);

  const field = (
    key: keyof FormState,
    label: string,
    input: React.ReactNode,
    hint?: string
  ) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={key} className="text-[16px] text-[#414651]">
        {label}
      </label>
      {input}
      {errors[key] ? (
        <p className="text-[13px] text-[#F04438]">{errors[key]}</p>
      ) : (
        hint && <p className="text-[13px] text-[#64748B]">{hint}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 lg:gap-10" noValidate>
      <SettingsCard
        icon={<Briefcase className="h-5 w-5" strokeWidth={2} />}
        title={t("professional.title")}
        description={t("professional.description")}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {field(
            "job_title",
            t("fields.jobTitle"),
            <input
              id="job_title"
              type="text"
              maxLength={255}
              value={form.job_title}
              onChange={(e) => update("job_title", e.target.value)}
              placeholder={t("placeholders.jobTitle")}
              disabled={disabled}
              className={inputClass}
            />
          )}
          {field(
            "years_of_experience",
            t("fields.years"),
            <input
              id="years_of_experience"
              type="number"
              inputMode="numeric"
              min={0}
              max={60}
              value={form.years_of_experience}
              onChange={(e) => update("years_of_experience", e.target.value)}
              placeholder={t("placeholders.years")}
              disabled={disabled}
              className={cn(inputClass, errors.years_of_experience && "border-[#F04438]")}
            />
          )}
        </div>
      </SettingsCard>

      <SettingsCard
        icon={<Contact className="h-5 w-5" strokeWidth={2} />}
        title={t("contact.title")}
        description={t("contact.description")}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {field(
            "contact_email",
            t("fields.email"),
            <input
              id="contact_email"
              type="email"
              dir="ltr"
              value={form.contact_email}
              onChange={(e) => update("contact_email", e.target.value)}
              placeholder={t("placeholders.email")}
              disabled={disabled}
              className={cn(inputClass, "text-start", errors.contact_email && "border-[#F04438]")}
            />
          )}
          {field(
            "contact_phone",
            t("fields.phone"),
            <PhoneNumberInput
              key={initialised ? "ready" : "loading"}
              defaultCountry={dialCodeCountry(profile?.phone_code)}
              value={form.contact_phone}
              onChange={(phone) => update("contact_phone", phone)}
              disabled={disabled}
            />
          )}
          <div className="md:col-span-2">
            {field(
              "location",
              t("fields.location"),
              <input
                id="location"
                type="text"
                maxLength={255}
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder={t("placeholders.location")}
                disabled={disabled}
                className={inputClass}
              />
            )}
          </div>
        </div>
        <p className="mt-4 text-[13px] text-[#64748B]">{t("contact.hint")}</p>
      </SettingsCard>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={disabled}
          className="flex h-10 min-w-[140px] items-center justify-center gap-2 rounded-[10px] bg-[#101828] px-[22px] text-[16px] text-[#FCFCFC] transition-colors hover:bg-[#1F2937] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] disabled:opacity-60"
        >
          {saving && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
          {t("save")}
        </button>
      </div>
    </form>
  );
}
