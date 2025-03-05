"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";

export default function VaulDrawer({
  children,
  trigger,
  title,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(!!open);
  }, [open]);

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);
  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="h-fit fixed bottom-0 left-0 right-0 outline-none">
          <div className="p-4 bg-white relative rounded-t-2xl dark:bg-gray-900">
            <div
              aria-hidden
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-50 mb-8 dark:bg-gray-700"
            />
            <div className="max-w-xl mx-auto">
              {title && (
                <Drawer.Title className="text-lg font-medium  mb-8">
                  {title}
                </Drawer.Title>
              )}
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
