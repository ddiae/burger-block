// 한글 조사 선택: 마지막 글자 받침 유무에 따라 올바른 조사 반환
function hasBatchim(char: string): boolean {
  const code = char.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return false;
  return (code - 0xAC00) % 28 !== 0;
}

function lastChar(str: string): string {
  return str[str.length - 1] ?? '';
}

export function josa(word: string, form: '이/가' | '을/를' | '은/는' | '으로/로'): string {
  const batchim = hasBatchim(lastChar(word));
  switch (form) {
    case '이/가':    return batchim ? '이' : '가';
    case '을/를':    return batchim ? '을' : '를';
    case '은/는':    return batchim ? '은' : '는';
    case '으로/로':  return batchim ? '으로' : '로';
  }
}
