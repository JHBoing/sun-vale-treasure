import { useState } from "react";

const ColorValueEnum = {
  Red: 1,
  Orange: 2,
  Yellow: 3,
  Green: 4,
  Blue: 5,
  Violet: 6,
  White: 7,
  Black: 8,
} as const;
type ColorValueEnum = (typeof ColorValueEnum)[keyof typeof ColorValueEnum];

const ColorMap: Record<string, ColorValueEnum> = {
  Red: ColorValueEnum.Red,
  Orange: ColorValueEnum.Orange,
  Yellow: ColorValueEnum.Yellow,
  Green: ColorValueEnum.Green,
  Blue: ColorValueEnum.Blue,
  Violet: ColorValueEnum.Violet,
  White: ColorValueEnum.White,
  Black: ColorValueEnum.Black,
};

type ColorName = keyof typeof ColorMap;
type Inventory = Record<ColorValueEnum, number>;

const ColorHex: Record<ColorName, string> = {
  Red: "#ef4444",
  Orange: "#f59e42",
  Yellow: "#fde047",
  Green: "#22c55e",
  Blue: "#3b82f6",
  Violet: "#a78bfa",
  White: "#f9fafb",
  Black: "#18181b",
};

const cascadeCarry = (board: ColorValueEnum[], index: number, carry: number) => {
  if (carry === 0 || index < 0) return;
  board[index] += carry;

  if (board[index] > 8) {
    board[index] -= 8;
  }
};

function findSolution(
  target: ColorValueEnum,
  slots: ColorValueEnum[],
  inventory: Inventory,
): { slot: number; color: ColorValueEnum }[] {
  const board = [...slots];
  const solution = [];

  for (let i = board.length - 1; i >= 0; i--) {
    const currentColorValue = board[i];
    if (currentColorValue === target) {
      continue;
    }

    for (const color in inventory) {
      const colorValue = parseInt(color) as ColorValueEnum;
      if (inventory[colorValue] > 0) {
        let newColorValue = currentColorValue + colorValue;
        let carry = 0;

        if (newColorValue > 8) {
          carry = 1;
          newColorValue -= 8;
        } else if (newColorValue === 8) {
          carry = 1;
        }

        if (newColorValue === target) {
          solution.push({ slot: i + 1, color: colorValue });
          board[i] = newColorValue;
          cascadeCarry(board, i - 1, carry);
          break;
        }
      }
    }
  }

  if (board[0] !== target) {
    return [];
  }
  return solution;
}

export default function SunValeColorPuzzlePage() {
  const isInventoryDisabled = true;
  const [slots, setSlots] = useState<ColorName[]>(() => {
    const colors = Object.keys(ColorMap) as ColorName[];
    return Array.from({ length: 4 }, () => colors[Math.floor(Math.random() * colors.length)]);
  });

  const [inventory, setInventory] = useState<Inventory>({
    [ColorValueEnum.Red]: 10,
    [ColorValueEnum.Orange]: 10,
    [ColorValueEnum.Yellow]: 10,
    [ColorValueEnum.Green]: 10,
    [ColorValueEnum.Blue]: 10,
    [ColorValueEnum.Violet]: 10,
    [ColorValueEnum.White]: 10,
    [ColorValueEnum.Black]: 10,
  });
  const [target, setTarget] = useState<ColorName>(() => {
    const colors = Object.keys(ColorMap) as ColorName[];
    return colors[Math.floor(Math.random() * colors.length)];
  });
  const [solution, setSolution] = useState<string[]>([]);
  const [hasSolved, setHasSolved] = useState(false);

  const handleSolve = () => {
    const res = findSolution(
      ColorMap[target],
      slots.map((s) => ColorMap[s]),
      inventory,
    );
    setHasSolved(true);
    setSolution(
      res.map(
        (m) =>
          `Slot ${m.slot}: ${Object.keys(ColorMap).find((k) => ColorMap[k as ColorName] === m.color)}`,
      ),
    );
  };

  return (
    <div className="puzzle-page sunvale-shell">
      <div className="sunvale-main section-card">
        <h1 className="page-title">Sun Vale Color Puzzle</h1>
        <div className="puzzle-controls">
          <div className="control-section">
            <h2 className="section-title">Target Color</h2>
            <div className="target-row">
              <div className="color-swatch large" style={{ backgroundColor: ColorHex[target] }} />
              <select
                className="ui-select"
                value={target}
                onChange={(e) => setTarget(e.target.value as ColorName)}
              >
                {Object.keys(ColorMap).map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="control-section">
            <div className="section-header">
              <h2 className="section-title">Slots</h2>
              <div className="row-actions">
                <button className="ui-button secondary" onClick={() => setSlots([...slots, "Black"])} type="button">
                  Add Slot
                </button>
                {slots.length > 1 && (
                  <button className="ui-button secondary" onClick={() => setSlots(slots.slice(0, -1))} type="button">
                    Remove Slot
                  </button>
                )}
              </div>
            </div>
            <div className="slots-row">
              {slots.map((color, idx) => (
                <div key={idx} className="slot-card">
                  <div className="slot-label">Slot {idx + 1}</div>
                  <div className="color-swatch" style={{ backgroundColor: ColorHex[color] }} />
                  <select
                    className="ui-select"
                    value={color}
                    onChange={(e) => {
                      const newSlots = [...slots];
                      newSlots[idx] = e.target.value as ColorName;
                      setSlots(newSlots);
                    }}
                  >
                    {Object.keys(ColorMap).map((colorOption) => (
                      <option key={colorOption} value={colorOption}>
                        {colorOption}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h2 className="section-title">Inventory</h2>
            <div className={`inventory-grid ${isInventoryDisabled ? "is-disabled" : ""}`}>
              {Object.entries(inventory).map(
                ([colorValue, count]) =>
                  count && (
                    <div key={colorValue} className="inventory-item">
                      <div
                        className="color-swatch"
                        style={{
                          backgroundColor:
                            ColorHex[
                              Object.keys(ColorMap).find(
                                (k) => ColorMap[k as ColorName] === (parseInt(colorValue) as ColorValueEnum),
                              ) as ColorName
                            ],
                        }}
                      />
                      <input
                        className="ui-input"
                        type="number"
                        min="0"
                        value={count || 0}
                        disabled={isInventoryDisabled}
                        aria-disabled={isInventoryDisabled}
                        onChange={(e) =>
                          setInventory({
                            ...inventory,
                            [parseInt(colorValue) as ColorValueEnum]: Math.max(0, parseInt(e.target.value) || 0),
                          })
                        }
                      />
                    </div>
                  ),
              )}
            </div>
          </div>

          <button className="ui-button primary" onClick={handleSolve} type="button">
            Solve
          </button>
        </div>
      </div>

      <aside className={`solution-column sunvale-solution-panel ${hasSolved ? "is-visible" : ""}`}>
        {hasSolved ? (
          <div className="section-card solution-card">
            <h2 className="section-title">Solution</h2>
            {solution.length > 0 ? (
              <ol className="solution-list">
                {solution.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            ) : (
              <p>No solution found for the current setup.</p>
            )}
          </div>
        ) : (
          <div className="section-card solution-card solution-placeholder">
            <h2 className="section-title">Solution</h2>
            <p>Click Solve to generate solution steps.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
