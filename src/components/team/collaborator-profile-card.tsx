import Image from "next/image";
import { type TeamMember, getMemberInitials } from "@/lib/team";
import { BLUR_PLACEHOLDER } from "@/lib/constants";
import {
  MemberSocialLinks,
  hasMemberSocialLinks,
} from "@/components/team/member-social-links";
import { isSafeUrl } from "@/lib/url";

/** Drop template partnership closers; hero copy already states the relationship. */
export function collaboratorBioParagraphs(bio: string): string[] {
  return bio
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter(
      (p) =>
        !/^He partners with RICCC investigators/i.test(p) &&
        !/^She partners with RICCC investigators/i.test(p)
    );
}

function profileLinkLabel(url: string): string {
  try {
    const path = new URL(url).pathname.toLowerCase();
    if (path.includes("/news/") || path.includes("/news-")) return "Rush feature";
    if (path.includes("/faculty/")) return "Rush profile";
  } catch {
    /* ignore */
  }
  return "Rush profile";
}

export function CollaboratorProfileCard({
  member,
  surface = "low",
}: {
  member: TeamMember;
  surface?: "low" | "base";
}) {
  const initials = getMemberInitials(member.name);
  const paragraphs = member.bio ? collaboratorBioParagraphs(member.bio) : [];
  const [lead, ...rest] = paragraphs;
  const showWebsite = Boolean(member.website) && isSafeUrl(member.website!);
  const hasSocials = hasMemberSocialLinks(member) || showWebsite;

  const surfaceClass =
    surface === "low"
      ? "bg-rush-surface-container-low hover:bg-rush-surface-container"
      : "bg-rush-surface hover:bg-rush-surface-container-low";

  return (
    <article
      id={member.slug}
      className={`group scroll-mt-28 rounded-sm px-5 py-6 sm:px-6 sm:py-7 shadow-card-sm transition-colors ${surfaceClass}`}
    >
      <div className="flex items-start gap-4 sm:gap-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-sm overflow-hidden bg-rush-secondary-container/50 ring-1 ring-rush-outline-variant/15">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={`Portrait of ${member.name}`}
              width={1024}
              height={1024}
              sizes="(max-width: 640px) 64px, 80px"
              className="w-full h-full object-cover"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-base sm:text-lg font-bold text-rush-dark-green select-none uppercase">
                {initials}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-xl sm:text-2xl font-bold text-rush-dark-green tracking-tight leading-snug">
            {member.name}
          </h3>
          <p className="mt-2 text-sm text-rush-on-surface-variant leading-relaxed max-w-prose">
            {member.role}
          </p>
        </div>
      </div>

      {lead ? (
        <div className="mt-5 text-base text-rush-on-surface-variant leading-relaxed max-w-prose">
          <p>{lead}</p>
          {rest.length > 0 ? (
            <details className="mt-4 group/details">
              <summary className="font-mono text-xs uppercase tracking-widest text-rush-dark-green cursor-pointer list-none inline-flex items-center gap-2 min-h-11 py-2 hover:opacity-80">
                <span className="border-b border-rush-dark-green/30 group-open/details:border-rush-dark-green">
                  Read full profile
                </span>
              </summary>
              <div className="mt-4 space-y-4 border-t border-rush-outline-variant/15 pt-4">
                {rest.map((para) => (
                  <p key={para.slice(0, 48)}>{para}</p>
                ))}
              </div>
            </details>
          ) : null}
        </div>
      ) : null}

      {hasSocials ? (
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <MemberSocialLinks
            member={member}
            variant="labeled"
            omitKeys={showWebsite ? ["website"] : undefined}
          />
          {showWebsite ? (
            <a
              href={member.website!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-11 font-mono text-xs uppercase tracking-widest text-rush-dark-green border-b border-rush-dark-green/30 pb-0.5 hover:border-rush-dark-green transition-colors"
            >
              {profileLinkLabel(member.website!)}
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
