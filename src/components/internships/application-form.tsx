"use client";

import { useState, type FormEvent } from "react";
import {
  DEGREE_LEVELS,
  SKILL_OPTIONS,
  type DegreeLevel,
  type SkillOption,
} from "@/lib/internships";

interface FormState {
  name: string;
  email: string;
  phone: string;
  school: string;
  degreeLevel: DegreeLevel;
  major: string;
  graduation: string;
  availabilityStart: string;
  availabilityEnd: string;
  skills: SkillOption[];
  skillsOther: string;
  whyRiccc: string;
  experience: string;
  resumeUrl: string;
  portfolioUrl: string;
  heardAbout: string;
  website: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  school: "",
  degreeLevel: DEGREE_LEVELS[0],
  major: "",
  graduation: "",
  availabilityStart: "",
  availabilityEnd: "",
  skills: [],
  skillsOther: "",
  whyRiccc: "",
  experience: "",
  resumeUrl: "",
  portfolioUrl: "",
  heardAbout: "",
  website: "",
};

export function InternshipApplicationForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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

    if (form.skills.length === 0 && !form.skillsOther.trim()) {
      setErrorMsg("Select at least one skill or describe other relevant skills.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      <div className="py-12 space-y-4">
        <p className="text-2xl font-bold text-rush-dark-green">Application submitted</p>
        <p className="text-rush-on-surface-variant">
          Thank you. We will review applications after the December 1 deadline and
          follow up by email.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-rush-surface-container-high border-none focus:ring-2 focus:ring-rush-teal rounded-sm p-4 text-rush-on-surface placeholder:text-rush-on-surface-variant/50 transition-all outline-none";

  const labelClass =
    "font-mono text-[0.7rem] uppercase tracking-widest text-rush-on-surface-variant block mb-2";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label="Summer internship application form"
    >
      {/* Honeypot */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="internship-name" className={labelClass}>
            Full Name
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="internship-phone" className={labelClass}>
            Phone
          </label>
          <input
            id="internship-phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="(312) 555-0100"
            maxLength={40}
            className={inputClass}
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="internship-school" className={labelClass}>
            School / University
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="internship-degree" className={labelClass}>
            Degree Level
          </label>
          <select
            id="internship-degree"
            name="degreeLevel"
            value={form.degreeLevel}
            onChange={handleChange}
            className={inputClass}
            required
          >
            {DEGREE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="internship-major" className={labelClass}>
            Major / Program
          </label>
          <input
            id="internship-major"
            name="major"
            type="text"
            required
            value={form.major}
            onChange={handleChange}
            placeholder="Biostatistics, Computer Science, …"
            maxLength={200}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="internship-graduation" className={labelClass}>
          Expected Graduation (month / year)
        </label>
        <input
          id="internship-graduation"
          name="graduation"
          type="text"
          required
          value={form.graduation}
          onChange={handleChange}
          placeholder="May 2028"
          maxLength={40}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="internship-avail-start" className={labelClass}>
            Summer Availability Start
          </label>
          <input
            id="internship-avail-start"
            name="availabilityStart"
            type="text"
            required
            value={form.availabilityStart}
            onChange={handleChange}
            placeholder="May 2027"
            maxLength={40}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="internship-avail-end" className={labelClass}>
            Summer Availability End
          </label>
          <input
            id="internship-avail-end"
            name="availabilityEnd"
            type="text"
            required
            value={form.availabilityEnd}
            onChange={handleChange}
            placeholder="August 2027"
            maxLength={40}
            className={inputClass}
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Relevant Skills</legend>
        <div className="flex flex-wrap gap-3 mb-3">
          {SKILL_OPTIONS.map((skill) => {
            const checked = form.skills.includes(skill);
            return (
              <label
                key={skill}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-sm cursor-pointer text-sm transition-colors ${
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

      <div>
        <label htmlFor="internship-why" className={labelClass}>
          Why RICCC / applied healthcare data science? (~300 words)
        </label>
        <textarea
          id="internship-why"
          name="whyRiccc"
          required
          value={form.whyRiccc}
          onChange={handleChange}
          rows={5}
          placeholder="What draws you to ICU and healthcare data science, and why RICCC?"
          maxLength={2500}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="internship-experience" className={labelClass}>
          Prior research, coursework, or projects
        </label>
        <textarea
          id="internship-experience"
          name="experience"
          required
          value={form.experience}
          onChange={handleChange}
          rows={4}
          placeholder="Briefly describe relevant classes, research, or personal projects."
          maxLength={2500}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="internship-resume" className={labelClass}>
          Resume / CV URL
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
          GitHub or Portfolio URL (optional)
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
        <input
          id="internship-heard"
          name="heardAbout"
          type="text"
          value={form.heardAbout}
          onChange={handleChange}
          placeholder="Professor, LinkedIn, lab website, …"
          maxLength={500}
          className={inputClass}
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
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
        className="w-full bg-rush-dark-green text-white py-4 rounded-sm font-bold text-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Submitting…" : "Submit Application"}
      </button>

      <p className="text-[0.7rem] font-mono text-rush-on-surface-variant uppercase tracking-widest">
        Applications reviewed after the December 1 deadline
      </p>
    </form>
  );
}
