type Unit = "B" | "KB" | "MB" | "GB" | "TB";

const unitMap: Record<Unit, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
};

export function convertSize(value: number, from: Unit, to: Unit): number {
  if (!(from in unitMap) || !(to in unitMap)) {
    throw new Error(
      `Invalid unit. Allowed: ${Object.keys(unitMap).join(", ")}`
    );
  }
  const inBytes = value * unitMap[from];
  return inBytes / unitMap[to];
}
