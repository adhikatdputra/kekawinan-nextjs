/** Convert newline characters to HTML <br> tags */
export function nl2br(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(/\n/g, "<br>");
}
