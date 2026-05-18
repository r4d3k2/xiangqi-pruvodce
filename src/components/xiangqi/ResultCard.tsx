import { Stars } from "./Stars";
import { Pill } from "./Pill";

interface ResultCardProps {
  variantName: string;
  variantZh: string;
  mistakes: number;
  stars: number;
  hasRecommendation: boolean;
  onRetry: () => void;
  onWeakSpot: () => void;
}

const PRAISE: Record<number, string> = {
  3: "Skvěle! Bez jediné chyby.",
  2: "Dobře! Pár chyb, ale držíš se.",
  1: "Není to zlé — zkus to znovu, půjde to lépe.",
};

export function ResultCard({
  variantName,
  variantZh,
  mistakes,
  stars,
  hasRecommendation,
  onRetry,
  onWeakSpot,
}: ResultCardProps) {
  return (
    <div
      className="surface"
      style={{
        padding: "20px 18px",
        textAlign: "center",
        marginBottom: 16,
      }}
    >
      <div
        className="app-title-zh"
        style={{ marginBottom: 6, fontSize: 12, color: "var(--accent)" }}
      >
        {variantZh}
      </div>
      <h2 className="font-display" style={{ margin: "0 0 12px", fontSize: 22 }}>
        {variantName}
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <Stars count={stars} size={28} />
      </div>

      <p
        style={{
          margin: "0 0 4px",
          color: "var(--text-soft)",
          fontSize: 16,
        }}
      >
        {PRAISE[stars] ?? ""}
      </p>
      <p
        style={{
          margin: "0 0 16px",
          color: "var(--text-muted)",
          fontSize: 14,
        }}
      >
        Chyb v tomto pokusu:{" "}
        <span className="font-mono" style={{ color: "var(--text-soft)" }}>
          {mistakes}
        </span>
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <Pill onClick={onRetry}>Zkusit znovu</Pill>
        {hasRecommendation && (
          <Pill active onClick={onWeakSpot}>
            Pokračovat na slabé místo →
          </Pill>
        )}
      </div>
    </div>
  );
}
