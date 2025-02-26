import { useState } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const openModal = (component: React.ReactNode) => {
    setContent(component);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 300); // Allow animation to finish before removing content
  };

  return { isOpen, content, openModal, closeModal };
}
