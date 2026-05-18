import { moveLabel, moveSide } from "../../lib/xiangqi";

interface MoveTokenProps {
  index: number;
  active: boolean;
  onClick?: () => void;
}

export function MoveToken({ index, active, onClick }: MoveTokenProps) {
  const side = moveSide(index);
  return (
    <button
      type="button"
      className={`move-token ${active ? "is-active" : ""}`}
      onClick={onClick}
      title={`Tah ${moveLabel(index)}`}
    >
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: side === "red" ? "#c83030" : "#1d2a1d",
          border: side === "red" ? "1px solid #6a0000" : "1px solid #060d06",
        }}
      />
      {moveLabel(index)}
    </button>
  );
}
