// banner colors, picked per workspace so it keeps the same color everywhere
const WORKSPACE_COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-violet-600",
  "bg-teal-600",
];

function workspaceColor(id: string): string {
  const sum = [...id].reduce((total, char) => total + char.charCodeAt(0), 0);
  return WORKSPACE_COLORS[sum % WORKSPACE_COLORS.length];
}

export default workspaceColor;
