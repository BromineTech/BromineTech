import { useState, useRef } from "react";
import { Plus, Minus } from "lucide-react";

export default function InviteMembersDialog({
  open = false,
  onOpenChange,
  onSubmit,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (emails: string[]) => void;
}) {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddEmail = () => {
    if (validateEmail(currentEmail)) {
      if (editingIndex !== null) {
        const updatedEmails = [...emails];
        updatedEmails[editingIndex] = currentEmail;
        setEmails(updatedEmails);
        setEditingIndex(null);
      } else {
        setEmails([currentEmail, ...emails]);
      }
      setCurrentEmail("");
      setError(null);
    } else {
      setError("Please enter a valid email address");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleEditEmail = (index: number) => {
    setCurrentEmail(emails[index]);
    setEditingIndex(index);
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setCurrentEmail("");
      setEditingIndex(null);
    }
  };

  const handleDone = () => {
    onSubmit?.(emails);
    onOpenChange?.(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#121216] bg-opacity-80"
      onClick={() => onOpenChange?.(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="bg-[#000000] text-sm text-gray-200 border border-neutral-700 rounded-lg shadow-lg p-6 sm:max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="dialog-title"
          className="text-xl font-semibold text-center text-gray-100 mb-2"
        >
          Invite Members
        </h2>
        <div className="flex flex-col gap-4 py-4">
          {/* Scrollable list of emails */}
          <div className="relative h-48">
            <div
              ref={scrollRef}
              className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              role="list"
            >
              <div className="space-y-2 pb-4">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-gray-700 rounded p-2 bg-neutral-900"
                    role="listitem"
                  >
                    <input
                      type="email"
                      value={email}
                      disabled={editingIndex !== index}
                      onChange={(e) => {
                        const updatedEmails = [...emails];
                        updatedEmails[index] = e.target.value;
                        setEmails(updatedEmails);
                      }}
                      className="bg-neutral-900 text-gray-200 w-full rounded focus:outline-none focus:ring-1 disabled:cursor-pointer"
                      onClick={() => handleEditEmail(index)}
                      aria-label={`Edit email ${email}`}
                    />
                    <button
                      onClick={() => handleRemoveEmail(index)}
                      className="text-red-500 hover:text-red-400 ml-2"
                      aria-label={`Remove email ${email}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Email input field */}
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Enter email address"
              value={currentEmail}
              onChange={(e) => {
                setCurrentEmail(e.target.value);
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              className="w-full p-2 rounded bg-neutral-700 text-gray-400 placeholder-gray-400"
              aria-label="Email address input"
              aria-invalid={error ? "true" : "false"}
            />
            {error && (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Add button */}
          <button
            onClick={handleAddEmail}
            className="mx-auto flex items-center justify-center h-8 w-8 bg-neutral-900 text-gray-200 border border-neutral-600 rounded-full hover:bg-neutral-700"
            aria-label="Add email"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => onOpenChange?.(false)}
            className="px-4 py-2 border border-neutral-600 text-gray-300 rounded hover:bg-neutral-700"
          >
            Skip
          </button>
          <button
            onClick={handleDone}
            className="px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}