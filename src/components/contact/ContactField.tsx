type ContactFieldProps = {
  id: string;
  name: "name" | "email" | "subject" | "message";
  label: string;
  value: string;
  error?: string;
  maxLength: number;
  type?: "text" | "email" | "textarea";
  autoComplete?: string;
  rows?: number;
  onChange: (value: string) => void;
};

const inputClass =
  "w-full rounded-md border border-border bg-bg px-3 py-2 text-fg outline-none focus:border-accent";

export function contactFieldErrorId(field: string) {
  return `contact-${field}-error`;
}

export default function ContactField({
  id,
  name,
  label,
  value,
  error,
  maxLength,
  type = "text",
  autoComplete,
  rows = 6,
  onChange,
}: ContactFieldProps) {
  const describedBy = error ? contactFieldErrorId(name) : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required
          maxLength={maxLength}
          className={inputClass}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required
          maxLength={maxLength}
          className={inputClass}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error ? (
        <p id={contactFieldErrorId(name)} className="m-0 text-sm text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
