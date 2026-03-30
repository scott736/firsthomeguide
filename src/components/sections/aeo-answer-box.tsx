/**
 * AEO Answer Box — a semantic summary block optimized for AI answer extraction.
 *
 * Renders with `role="note"` so the speakable specification picks it up,
 * and uses clear heading patterns ("Quick Answer", "Key Takeaway") that
 * AI crawlers and answer engines prioritize when generating cited responses.
 *
 * Usage in MDX:
 *   import AEOAnswerBox from '../../../../components/sections/aeo-answer-box';
 *   <AEOAnswerBox
 *     question="What is the FHSA?"
 *     answer="The First Home Savings Account (FHSA) is a registered savings account..."
 *     bullets={["$8,000 annual limit", "$40,000 lifetime limit", "Tax-deductible contributions"]}
 *   />
 */

interface AEOAnswerBoxProps {
  /** The question this box answers — renders as a visible heading and maps to schema question text */
  question: string;
  /** A direct, concise answer (1-3 sentences). This is the primary text AI engines extract. */
  answer: string;
  /** Optional bullet points for key facts. Great for featured snippet formatting. */
  bullets?: string[];
  /** Optional label override. Defaults to "Quick Answer". */
  label?: string;
  /** Optional source attribution, e.g. "Government of Canada" */
  source?: string;
  /** Optional source URL for citation */
  sourceUrl?: string;
}

export default function AEOAnswerBox({
  question,
  answer,
  bullets,
  label = 'Quick Answer',
  source,
  sourceUrl,
}: AEOAnswerBoxProps) {
  return (
    <section
      role="note"
      aria-label={label}
      data-aeo-answer="true"
      itemScope
      itemType="https://schema.org/Answer"
      className="aeo-answer-box not-content"
    >
      <div className="aeo-answer-box__header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
        <span className="aeo-answer-box__label">{label}</span>
      </div>

      {question && (
        <p className="aeo-answer-box__question" itemProp="name">
          {question}
        </p>
      )}

      <div itemProp="text">
        <p className="aeo-answer-box__answer">{answer}</p>

        {bullets && bullets.length > 0 && (
          <ul className="aeo-answer-box__bullets">
            {bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>

      {source && (
        <p className="aeo-answer-box__source">
          Source:{' '}
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {source}
            </a>
          ) : (
            source
          )}
        </p>
      )}
    </section>
  );
}
