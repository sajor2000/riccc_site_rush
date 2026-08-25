"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  DEGREE_LEVELS,
  graduationYearOptions,
  HEARD_ABOUT_OPTIONS,
  MAJOR_OPTIONS,
  MONTHS,
  SKILL_OPTIONS,
  SUMMER_END_MONTHS,
  SUMMER_START_MONTHS,
  type DegreeLevel,
  type SkillOption,
} from "@/lib/internships";

interface FormState {
  name: string;
  email: string;
  phone: string;
  school: string;
  degreeLevel: DegreeLevel | "";
  major: string;
  majorOther: string;
  gradMonth: string;
  gradYear: string;
  availStartMonth: string;
  availEndMonth: string;
  skills: SkillOption[];
  skillsOther: string;
  whyRiccc: string;
  experience: string;
  resumeUrl: string;
  portfolioUrl: string;
  heardAbout: string;
  heardAboutOther: string;
  website: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  school: "",
  degreeLevel: "",
  major: "",
  majorOther: "",
  gradMonth: "",
  gradYear: "",
  availStartMonth: "May",
  availEndMonth: "August",
  skills: [],
  skillsOther: "",
  whyRiccc: "",
  experience: "",
  resumeUrl: "",
  portfolioUrl: "",
  heardAbout: "",
  heardAboutOther: "",
  website: "",
};

function wordCount(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

interface Props {
  summerYear: number;
  deadlineLabel: string;
}

function ReqMark() {
  return (
    <span className="text-rush-dark-green" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

export function InternshipApplicationForm({ summerYear, deadlineLabel }: Props) {
  const [form, setForm] = useState<FormState>({
    ...initialForm,
    availStartMonth: "May",
    availEndMonth: "August",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const gradYears = useMemo(() => graduationYearOptions(summerYear), [summerYear]);
  const whyWords = wordCount(form.whyRiccc);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleSkill(skill: SkillOption) {
    setForm((prev) => {
      const has = prev.skills.includes(skill);
      return {
        ...prev,
        skills: has
          ? prev.skills.filter((s) => s !== skill)
          : [...prev.skills, skill],
      };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    if (!form.degreeLevel) {
      setErrorMsg("Select your degree level.");
      setStatus("error");
      return;
    }
    if (!form.major) {
      setErrorMsg("Select your major or program.");
      setStatus("error");
      return;
    }
    if (form.major === "Other" && !form.majorOther.trim()) {
      setErrorMsg("Please describe your major or program.");
      setStatus("error");
      return;
    }
    if (!form.gradMonth || !form.gradYear) {
      setErrorMsg("Select expected graduation month and year.");
      setStatus("error");
      return;
    }
    if (!form.availStartMonth || !form.availEndMonth) {
      setErrorMsg("Select your summer availability window.");
      setStatus("error");
      return;
    }
    if (form.skills.length === 0 && !form.skillsOther.trim()) {
      setErrorMsg("Select at least one skill or describe other relevant skills.");
      setStatus("error");
      return;
    }
    if (whyWords > 350) {
      setErrorMsg("Please keep your interest statement to about 300 words.");
      setStatus("error");
      return;
    }

    const majorValue =
      form.major === "Other" ? form.majorOther.trim() : form.major;
    const heardValue =
      form.heardAbout === "Other"
        ? form.heardAboutOther.trim()
        : form.heardAbout;

    setStatus("sending");
    setErrorMsg("");

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      school: form.school,
      degreeLevel: form.degreeLevel,
      major: majorValue,
      graduation: `${form.gradMonth} ${form.gradYear}`,
      availabilityStart: `${form.availStartMonth} ${summerYear}`,
      availabilityEnd: `${form.availEndMonth} ${summerYear}`,
      skills: form.skills,
      skillsOther: form.skillsOther,
      whyRiccc: form.whyRiccc,
      experience: form.experience,
      resumeUrl: form.resumeUrl,
      portfolioUrl: form.portfolioUrl,
      heardAbout: heardValue,
      website: form.website,
    };

    try {
      const res = await fetch("/api/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setErrorMsg("Network error. Please try again or email us directly.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-12 space-y-4" role="status">
        <p className="text-2xl font-bold text-rush-dark-green">Application submitted</p>
        <p className="text-rush-on-surface-variant">
          Thank you. We will review applications after {deadlineLabel} and follow
          up by email.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-rush-surface-container-high border-none focus:ring-2 focus:ring-rush-teal rounded-sm p-4 text-rush-on-surface placeholder:text-rush-on-surface-variant/50 transition-all outline-none min-h-12";

  const selectClass = `${inputClass} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-12`;
  // Use a simple chevron via inline style background on selects - or just native. Prefer arrow via CSS.
  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23004923'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
  };

  const labelClass =
    "font-mono text-[0.7rem] uppercase tracking-widest text-rush-on-surface-variant block mb-2";

  const sectionClass = "space-y-6 pt-2";
  const sectionTitleClass =
    "text-sm font-bold text-rush-dark-green tracking-tight border-b border-rush-outline-variant/20 pb-2 mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-10"
      aria-label="Summer internship application form"
      noValidate={false}
    >
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="internship-website">Website</label>
        <input
          id="internship-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={handleChange}
        />
      </div>

      <p className="text-xs text-rush-on-surface-variant">
        <span className="text-rush-dark-green font-semibold">*</span> Required
      </p>

      {/* Contact */}
      <fieldset className={sectionClass}>
        <legend className={sectionTitleClass}>Contact</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="internship-name" className={labelClass}>
              Full name
              <ReqMark />
            </label>
            <input
              id="internship-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Alex Rivera"
              maxLength={200}
              className={inputClass}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="internship-email" className={labelClass}>
              Email
              <ReqMark />
            </label>
            <input
              id="internship-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="alex@university.edu"
              maxLength={254}
              className={inputClass}
              autoComplete="email"
            />
          </div>
        </div>
        <div>
          <label htmlFor="internship-phone" className={labelClass}>
            Phone (optional)
          </label>
          <input
            id="internship-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="(312) 555-0100"
            maxLength={40}
            className={inputClass}
            autoComplete="tel"
          />
        </div>
      </fieldset>

      {/* Academics */}
      <fieldset className={sectionClass}>
        <legend className={sectionTitleClass}>Academics</legend>
        <div>
          <label htmlFor="internship-school" className={labelClass}>
            School / university
            <ReqMark />
          </label>
          <input
            id="internship-school"
            name="school"
            type="text"
            required
            value={form.school}
            onChange={handleChange}
            placeholder="Rush University"
            maxLength={200}
            className={inputClass}
            autoComplete="organization"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="internship-degree" className={labelClass}>
              Degree level
              <ReqMark />
            </label>
            <select
              id="internship-degree"
              name="degreeLevel"
              value={form.degreeLevel}
              onChange={handleChange}
              className={selectClass}
              style={selectStyle}
              required
            >
              <option value="" disabled>
                Select…
              </option>
              {DEGREE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="internship-major" className={labelClass}>
              Major / program
              <ReqMark />
            </label>
            <select
              id="internship-major"
              name="major"
              value={form.major}
              onChange={handleChange}
              className={selectClass}
              style={selectStyle}
              required
            >
              <option value="" disabled>
                Select…
              </option>
              {MAJOR_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {form.major === "Other" && (
          <div>
            <label htmlFor="internship-major-other" className={labelClass}>
              Describe your major / program
              <ReqMark />
            </label>
            <input
              id="internship-major-other"
              name="majorOther"
              type="text"
              required
              value={form.majorOther}
              onChange={handleChange}
              maxLength={200}
              className={inputClass}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="internship-grad-month" className={labelClass}>
              Expected graduation month
              <ReqMark />
            </label>
            <select
              id="internship-grad-month"
              name="gradMonth"
              value={form.gradMonth}
              onChange={handleChange}
              className={selectClass}
              style={selectStyle}
              required
            >
              <option value="" disabled>
                Select month…
              </option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="internship-grad-year" className={labelClass}>
              Expected graduation year
              <ReqMark />
            </label>
            <select
              id="internship-grad-year"
              name="gradYear"
              value={form.gradYear}
              onChange={handleChange}
              className={selectClass}
              style={selectStyle}
              required
            >
              <option value="" disabled>
                Select year…
              </option>
              {gradYears.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Availability */}
      <fieldset className={sectionClass}>
        <legend className={sectionTitleClass}>
          Summer {summerYear} availability
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="internship-avail-start" className={labelClass}>
              Available from
              <ReqMark />
            </label>
            <select
              id="internship-avail-start"
              name="availStartMonth"
              value={form.availStartMonth}
              onChange={handleChange}
              className={selectClass}
              style={selectStyle}
              required
            >
              {SUMMER_START_MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m} {summerYear}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="internship-avail-end" className={labelClass}>
              Available through
              <ReqMark />
            </label>
            <select
              id="internship-avail-end"
              name="availEndMonth"
              value={form.availEndMonth}
              onChange={handleChange}
              className={selectClass}
              style={selectStyle}
              required
            >
              {SUMMER_END_MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m} {summerYear}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Skills */}
      <fieldset className={sectionClass}>
        <legend className={sectionTitleClass}>
          Relevant skills
          <ReqMark />
        </legend>
        <p className="text-xs text-rush-on-surface-variant mb-3">
          Select all that apply
        </p>
        <div className="flex flex-wrap gap-3 mb-3">
          {SKILL_OPTIONS.map((skill) => {
            const checked = form.skills.includes(skill);
            return (
              <label
                key={skill}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm cursor-pointer text-sm transition-colors min-h-11 ${
                  checked
                    ? "bg-rush-dark-green text-white"
                    : "bg-rush-surface-container-high text-rush-on-surface hover:bg-rush-surface-container"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleSkill(skill)}
                />
                {skill}
              </label>
            );
          })}
        </div>
        <label htmlFor="internship-skills-other" className={labelClass}>
          Other skills (optional)
        </label>
        <input
          id="internship-skills-other"
          name="skillsOther"
          type="text"
          value={form.skillsOther}
          onChange={handleChange}
          placeholder="e.g. Julia, EHR experience, clinical coursework"
          maxLength={200}
          className={inputClass}
        />
      </fieldset>

      {/* Statement */}
      <fieldset className={sectionClass}>
        <legend className={sectionTitleClass}>Interest &amp; experience</legend>
        <div>
          <label htmlFor="internship-why" className={labelClass}>
            Why healthcare data science / RICCC? (~300 words)
            <ReqMark />
          </label>
          <textarea
            id="internship-why"
            name="whyRiccc"
            required
            value={form.whyRiccc}
            onChange={handleChange}
            rows={5}
            placeholder="What draws you to ICU and healthcare data science in Chicago, and why RICCC?"
            maxLength={2500}
            className={inputClass}
          />
          <p
            className={`mt-2 text-xs tabular-nums ${
              whyWords > 300 ? "text-rush-dark-green font-semibold" : "text-rush-on-surface-variant"
            }`}
            aria-live="polite"
          >
            {whyWords} / ~300 words
          </p>
        </div>

        <div>
          <label htmlFor="internship-experience" className={labelClass}>
            Prior research, coursework, or projects (brief)
            <ReqMark />
          </label>
          <textarea
            id="internship-experience"
            name="experience"
            required
            value={form.experience}
            onChange={handleChange}
            rows={3}
            placeholder="A few sentences on relevant classes, research, or projects."
            maxLength={1200}
            className={inputClass}
          />
        </div>
      </fieldset>

      {/* Materials */}
      <fieldset className={sectionClass}>
        <legend className={sectionTitleClass}>Materials</legend>
        <div>
          <label htmlFor="internship-resume" className={labelClass}>
            Resume / CV URL
            <ReqMark />
          </label>
          <input
            id="internship-resume"
            name="resumeUrl"
            type="url"
            required
            value={form.resumeUrl}
            onChange={handleChange}
            placeholder="https://drive.google.com/…"
            maxLength={500}
            className={inputClass}
          />
          <p className="mt-2 text-xs text-rush-on-surface-variant">
            Link to a publicly viewable PDF (Google Drive, Dropbox, personal site).
          </p>
        </div>

        <div>
          <label htmlFor="internship-portfolio" className={labelClass}>
            GitHub or portfolio URL (optional)
          </label>
          <input
            id="internship-portfolio"
            name="portfolioUrl"
            type="url"
            value={form.portfolioUrl}
            onChange={handleChange}
            placeholder="https://github.com/…"
            maxLength={500}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="internship-heard" className={labelClass}>
            How did you hear about us? (optional)
          </label>
          <select
            id="internship-heard"
            name="heardAbout"
            value={form.heardAbout}
            onChange={handleChange}
            className={selectClass}
            style={selectStyle}
          >
            <option value="">Select…</option>
            {HEARD_ABOUT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        {form.heardAbout === "Other" && (
          <div>
            <label htmlFor="internship-heard-other" className={labelClass}>
              Please specify
            </label>
            <input
              id="internship-heard-other"
              name="heardAboutOther"
              type="text"
              value={form.heardAboutOther}
              onChange={handleChange}
              maxLength={200}
              className={inputClass}
            />
          </div>
        )}
      </fieldset>

      {errorMsg && (
        <p
          className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2"
          role="alert"
        >
          {errorMsg}
        </p>
      )}

      <p className="text-xs text-rush-on-surface-variant leading-relaxed">
        Your application (including contact details and resume link) is emailed to
        RICCC investigators for review and is processed by our email provider. We
        use it only to evaluate internship candidates. Questions:{" "}
        <a
          href="mailto:info@riccc-lab.com"
          className="text-rush-dark-green underline underline-offset-2"
        >
          info@riccc-lab.com
        </a>
        .
      </p>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-rush-dark-green text-white py-4 rounded-sm font-bold text-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-12"
      >
        {status === "sending" ? "Submitting…" : "Submit internship application"}
      </button>

      <p className="text-[0.7rem] font-mono text-rush-on-surface-variant uppercase tracking-widest">
        Reviewed after {deadlineLabel}
      </p>
    </form>
  );
}
