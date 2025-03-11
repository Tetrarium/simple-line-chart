import { curveCatmullRom, line as d3Line } from "d3-shape";
import { Line } from "recharts";
import { LinePointItem } from "recharts/types/cartesian/Line";

import { getZScores } from "../utils/scores";

type TZscore = number | undefined;
type TSegment = {
  points: LinePointItem[];
  color: string;
};

class ZScoresLine extends Line {
  private getColor(zScore: TZscore, defaultColor: string) {
    return zScore !== undefined && Math.abs(zScore) >= 1 ? "red" : defaultColor;
  }

  render() {
    const { points = [], stroke = "#8884d8" } = this.props;
    if (!points || points.length < 2) return <></>;

    const values = points.map((p) => p.value);
    const zScores = getZScores(values);

    const segments: TSegment[] = [];
    let currentSegment: LinePointItem[] = [];
    let currentColor = this.getColor(zScores[0], stroke);

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const zScore = zScores[i];
      const color = this.getColor(zScore, stroke);
      currentSegment.push(point);

      const aboveThreshold = zScore && Math.abs(zScore) >= 1;


      if (i < points.length - 1) {
        const nextPoint = points[i + 1];
        const nextZScore = zScores[i + 1];
        const nextAboveThreshold = nextZScore && Math.abs(nextZScore) > 1;

        if (zScore && nextZScore && aboveThreshold !== nextAboveThreshold) {
          const ratio = (1 - Math.abs(zScore)) / (Math.abs(nextZScore) - Math.abs(zScore));
          const intersectX = point.x + ratio * (nextPoint.x - point.x);
          const intersectY = point.y + ratio * (nextPoint.y - point.y);
          const intersectPoint = { x: intersectX, y: intersectY };

          currentSegment.push(intersectPoint);
          segments.push({ points: currentSegment, color });

          currentSegment = [intersectPoint];
          currentColor = this.getColor(nextZScore, stroke);
        }
      }
    }

    if (currentSegment.length > 1) {
      segments.push({ points: currentSegment, color: currentColor });
    }

    const lineGenerator = d3Line<LinePointItem>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveCatmullRom.alpha(0.5));

    return (
      <>
        {segments.map((segment, index) => {
          const path = lineGenerator(segment.points);
          return (
            <g key={index}>
              <path
                key={index}
                d={path || undefined}
                stroke={segment.color}
                fill="none"
                strokeWidth={2}
              />
            </g>
          );
        })}
        {/* Точки сегмента */}
        {points.map((point, idx) => {
          const color = this.getColor(zScores[idx], stroke);
          return (
            <circle
              key={idx}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={color}
              stroke="#fff"
              strokeWidth={1}
            />
          );
        })}
      </>
    );
  }
}

export default ZScoresLine;