const USER_NAME_KEY = 'brainfit40_user_name';

export function getUserName(): string {
  try {
    const saved = localStorage.getItem(USER_NAME_KEY);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch {
    // ignore
  }
  return '';
}

export function saveUserName(name: string): void {
  try {
    localStorage.setItem(USER_NAME_KEY, name.trim());
  } catch {
    // ignore
  }
}
