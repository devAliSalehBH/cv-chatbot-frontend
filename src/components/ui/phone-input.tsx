"use client";

import * as React from "react";
import { PhoneInput as InternationalPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { cn } from "@/lib/utils";

export interface PhoneNumberInputProps {
  value?: string;
  onChange?: (phone: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
}

const PhoneNumberInput = React.forwardRef<
  HTMLInputElement,
  PhoneNumberInputProps
>(({ className, value, onChange, onBlur, disabled, ...props }, ref) => {
  // Debounce onChange to improve performance
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const handleChange = React.useCallback(
    (phone: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onChange?.(phone);
      }, 50); // Reduced to 50ms for better responsiveness
    },
    [onChange],
  );

  return (
    <div className={cn("w-full", className)}>
      <InternationalPhoneInput
        defaultCountry="sa"
        value={value || ""}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        inputClassName="phone-input-field"
        countrySelectorStyleProps={{
          buttonClassName: "phone-country-button",
          dropdownStyleProps: {
            className: "phone-dropdown",
            listItemClassName: "phone-dropdown-item",
          },
        }}
        style={
          {
            "--react-international-phone-border-radius": "0.5rem",
            "--react-international-phone-border-color": "rgb(229, 231, 235)",
            "--react-international-phone-background-color": "#fff",
            "--react-international-phone-text-color": "rgb(17, 24, 39)",
            "--react-international-phone-font-size": "0.875rem",
            "--react-international-phone-height": "2.75rem",
          } as React.CSSProperties
        }
      />
      <style jsx global>{`
        .react-international-phone-input-container {
          border-radius: 0.5rem !important;
          border: 1px solid rgb(229, 231, 235) !important;
          transition: all 0.2s !important;
          direction: ltr !important;
        }

        .react-international-phone-input-container:focus-within {
          border-color: rgb(59, 130, 246) !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }

        .phone-input-field {
          outline: none !important;
          border: none !important;
          padding: 0.5rem 0.75rem !important;
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
          color: rgb(17, 24, 39) !important;
          background: transparent !important;
          direction: ltr !important;
          text-align: left !important;
        }

        .phone-country-button {
          border: none !important;
          background: transparent !important;
          padding: 0 0.5rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.375rem !important;
        }

        .phone-country-button:hover {
          background-color: rgb(249, 250, 251) !important;
        }

        /* Fix dropdown positioning */
        .react-international-phone-country-selector {
          position: relative !important;
        }

        .phone-dropdown {
          position: absolute !important;
          top: calc(100% + 4px) !important;
          left: 0 !important;
          border: 1px solid rgb(229, 231, 235) !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          max-height: 300px !important;
          overflow-y: auto !important;
          background: white !important;
          z-index: 50 !important;
          min-width: 250px !important;
        }

        .phone-dropdown-item {
          padding: 0.5rem 0.75rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.75rem !important;
          cursor: pointer !important;
          transition: background-color 0.15s !important;
          direction: ltr !important;
        }

        .phone-dropdown-item:hover {
          background-color: rgb(243, 244, 246) !important;
        }

        .phone-dropdown-item[data-selected="true"] {
          background-color: rgb(239, 246, 255) !important;
          color: rgb(29, 78, 216) !important;
        }
      `}</style>
    </div>
  );
});

PhoneNumberInput.displayName = "PhoneNumberInput";

export { PhoneNumberInput };
