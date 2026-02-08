import React, { useState, useMemo } from "react";

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

const cascadeCarry = (
  board: ColorValueEnum[],
  index: number,
  carry: number,
) => {
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
  // Create the board state
  const board = [...slots];
  const solution = [];

  // From the last slot, to first, try to find a piece in the inventory that can be placed there
  // If the piece placed goes over the maximum value, 8, then it turns into the color of the different (sumTotal - 8)
  //  and the next slot changes to currentColorValue + 1

  for (let i = board.length - 1; i >= 0; i--) {
    console.log(board);
    const currentColorValue = board[i];
    if (currentColorValue === target) {
      continue; // already matches target, no need to place anything
    }

    for (const color in inventory) {
      const colorValue = parseInt(color) as ColorValueEnum;
      if (inventory[colorValue] > 0) {
        // Try placing this piece in the slot
        let newColorValue = currentColorValue + colorValue;
        let carry = 0;
        // if newColorValue is equal or exceeds 8, we need to carry over to the next slot
        if (newColorValue > 8) {
          carry = 1;
          newColorValue -= 8;
        } else if (newColorValue === 8) {
          carry = 1;
        }

        // Check if we reached the target
        if (newColorValue === target) {
          solution.push({ slot: i + 1, color: colorValue });
          board[i] = newColorValue;
          console.log(colorValue);

          cascadeCarry(board, i - 1, carry);
          break;
        } else {
          continue;
        }
      }
    }
  }

  if (board[0] !== target) {
    return []; // No solution found
  }
  return solution;
}

// --- Component ---
export default function ColorPuzzle() {
  const [slots, setSlots] = useState<ColorName[]>(() => {
    const colors = Object.keys(ColorMap) as ColorName[];
    return Array.from(
      { length: 4 },
      () => colors[Math.floor(Math.random() * colors.length)],
    );
  });
  // inventory representes the pieces that a player has
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
  const [target, setTarget] = useState<ColorName>(
    Object.keys(ColorMap)[
      Math.floor(Math.random() * Object.keys(ColorMap).length)
    ] as ColorName,
  );
  const [solution, setSolution] = useState<string[] | null>(null);

  const handleSolve = () => {
    const res = findSolution(
      ColorMap[target],
      slots.map((s) => ColorMap[s]),
      inventory,
    );
    setSolution(
      res.map(
        (m) =>
          `Slot ${m.slot}: ${Object.keys(ColorMap).find((k) => ColorMap[k as ColorName] === m.color)}`,
      ),
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Color Puzzle</h1>
      <div style={{ marginTop: "20px" }}>
        <h2>Target Color</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: ColorHex[target],
              border: "1px solid #000",
            }}
          />
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value as ColorName)}
            style={{ padding: "5px" }}
          >
            {Object.keys(ColorMap).map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <h2>Slots</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {slots.map((color, idx) => (
            <select
              key={idx}
              value={color}
              onChange={(e) => {
                const newSlots = [...slots];
                newSlots[idx] = e.target.value as ColorName;
                setSlots(newSlots);
              }}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: ColorHex[color],
                border: "1px solid #000",
              }}
            >
              {Object.keys(ColorMap).map((colorOption) => (
                <option key={colorOption} value={colorOption}>
                  {colorOption}
                </option>
              ))}
            </select>
          ))}
          <button onClick={() => setSlots([...slots, "Black"])}>
            Add Slot
          </button>
          {slots.length > 1 && (
            <button onClick={() => setSlots(slots.slice(0, -1))}>
              Remove Slot
            </button>
          )}
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Inventory</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {Object.entries(inventory).map(
            ([colorValue, count]) =>
              count && (
                <div
                  key={colorValue}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor:
                        ColorHex[
                          Object.keys(ColorMap).find(
                            (k) =>
                              ColorMap[k as ColorName] ===
                              (parseInt(colorValue) as ColorValueEnum),
                          ) as ColorName
                        ],
                      border: "1px solid #000",
                    }}
                  />
                  <input
                    type="number"
                    min="0"
                    value={count || 0}
                    onChange={(e) =>
                      setInventory({
                        ...inventory,
                        [parseInt(colorValue) as ColorValueEnum]: Math.max(
                          0,
                          parseInt(e.target.value) || 0,
                        ),
                      })
                    }
                    style={{ width: "40px", textAlign: "center" }}
                  />
                </div>
              ),
          )}
        </div>
      </div>

      <button onClick={handleSolve} style={{ marginTop: "20px" }}>
        Solve
      </button>
      {solution && (
        <div style={{ marginTop: "20px" }}>
          <h2>Solution</h2>
          <ol>
            {solution.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
