import React, { useState, useRef, useEffect } from "react";
import { Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Sample custom fields - in a real app this would come from an API/context
const CUSTOM_FIELDS = [
  { id: "contact.first_name", label: "Contact First Name", category: "Contact" },
  { id: "contact.last_name", label: "Contact Last Name", category: "Contact" },
  { id: "contact.email", label: "Contact Email", category: "Contact" },
  { id: "contact.phone", label: "Contact Phone", category: "Contact" },
  { id: "contact.company", label: "Contact Company", category: "Contact" },
  { id: "user.name", label: "User Name", category: "User" },
  { id: "user.email", label: "User Email", category: "User" },
  { id: "location.name", label: "Location Name", category: "Location" },
  { id: "location.address", label: "Location Address", category: "Location" },
];

interface CustomFieldInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
}

export const CustomFieldInput: React.FC<CustomFieldInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  helperText,
  multiline = false,
  rows = 3,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredFields = CUSTOM_FIELDS.filter(
    (field) =>
      field.label.toLowerCase().includes(search.toLowerCase()) ||
      field.id.toLowerCase().includes(search.toLowerCase())
  );

  const groupedFields = filteredFields.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, typeof CUSTOM_FIELDS>);

  const handleSelectField = (field: (typeof CUSTOM_FIELDS)[0]) => {
    const fieldValue = `{{${field.id}}}`;
    const input = inputRef.current;
    
    if (input) {
      const start = input.selectionStart ?? value.length;
      const end = input.selectionEnd ?? value.length;
      const newValue = value.slice(0, start) + fieldValue + value.slice(end);
      onChange(newValue);
    } else {
      onChange(value + fieldValue);
    }
    
    setIsOpen(false);
    setSearch("");
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="text-sm font-medium text-foreground mb-1.5 block">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {multiline ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="pr-10"
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pr-10"
          />
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "absolute right-2 top-2 p-1.5 rounded hover:bg-muted transition-colors",
            isOpen && "bg-muted"
          )}
          title="Insert custom field"
        >
          <Tag className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {helperText && (
        <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg max-h-[300px] overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search custom fields..."
              className="h-8"
              autoFocus
            />
          </div>

          {/* Fields List */}
          <div className="overflow-y-auto max-h-[240px]">
            {Object.entries(groupedFields).length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No fields found
              </div>
            ) : (
              Object.entries(groupedFields).map(([category, fields]) => (
                <div key={category}>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase bg-muted/50">
                    {category}
                  </div>
                  {fields.map((field) => (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => handleSelectField(field)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{field.label}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {`{{${field.id}}}`}
                      </span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
