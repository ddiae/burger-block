export const setupTeacherShortcut = (onTrigger: () => void): (() => void) => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.shiftKey && e.key === 'T') {
      onTrigger();
    }
  };
  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
};
