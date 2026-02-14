import { useEffect, useRef, useState } from "react";
import { type ReactNode } from "react";

type DropdownItem = {
  label: ReactNode;
  onClick: () => void;
};

type DropdownProps = {
  items: DropdownItem[];
  children: React.ReactNode; // 👈 custom button
};

export default function Dropdown({ items, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Trigger */}
      <div onClick={() => setOpen(prev => !prev)}>
        {children}
      </div>

      {/* Menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-[150px] rounded-md bg-white shadow-xl">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-gray-600 text-m font-bold hover:bg-gray-100"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
