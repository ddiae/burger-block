export const TEACHER_KEY = 'burger-block-teacher';

export function isTeacherMode(): boolean {
  return sessionStorage.getItem(TEACHER_KEY) === 'true';
}

export function toggleTeacherMode(): boolean {
  const next = !isTeacherMode();
  sessionStorage.setItem(TEACHER_KEY, String(next));
  return next;
}

export const setupTeacherShortcut = (onToggle: (active: boolean) => void): (() => void) => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.shiftKey && e.key === 'T') {
      const active = toggleTeacherMode();
      onToggle(active);
    }
  };
  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
};
