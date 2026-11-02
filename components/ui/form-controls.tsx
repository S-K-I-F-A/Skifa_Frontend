import { Children, cloneElement, isValidElement, useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const controlClass =
  "w-full rounded-sm border-2 border-black bg-white px-3 py-2.5 font-sans text-sm text-black outline-none transition-shadow placeholder:text-muted-foreground focus:shadow-[4px_4px_0_#000] disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500";

export function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  const generatedId = useId();
  const items = Children.toArray(children);
  const input = items.find(
    (child) =>
      isValidElement<{ id?: string }>(child) &&
      [FormInput, FormTextarea, Dropdown].includes(
        child.type as typeof FormInput,
      ),
  );
  const id = isValidElement<{ id?: string }>(input)
    ? input.props.id || generatedId
    : undefined;
  return (
    <div className="block">
      {id ? (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-black"
        >
          {label}
        </label>
      ) : (
        <span className="mb-1.5 block text-sm font-medium text-black">
          {label}
        </span>
      )}
      {items.map((child) =>
        child === input && isValidElement<{ id?: string }>(child)
          ? cloneElement(child, { id })
          : child,
      )}
      {hint ? (
        <span className="block text-sm text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}
export function FormInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${controlClass} ${className}`} {...props} />;
}

export function FormTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`${controlClass} min-h-28 resize-y ${className}`}
      {...props}
    />
  );
}

export function Dropdown({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${controlClass} ${className}`} {...props}>
      {children}
    </select>
  );
}
export const primaryButtonClass =
  "inline-flex items-center justify-center rounded-sm border-2 border-black bg-black px-5 py-3 font-sans text-sm font-medium text-white transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000] focus-visible:outline-none focus-visible:shadow-[4px_4px_0_#000] disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-sm border-2 border-black bg-white px-5 py-3 font-sans text-sm font-medium text-black transition-all hover:bg-black hover:text-white focus-visible:outline-none focus-visible:shadow-[4px_4px_0_#000]";
