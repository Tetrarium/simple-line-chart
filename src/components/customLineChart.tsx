import { curveMonotoneX, line as d3Line } from "d3-shape";
import {
    CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { LinePointItem } from "recharts/types/cartesian/Line";

import { data } from "../data/data";
import { calculateMean, calculateStandardDeviation, getZScores } from "../utils/scores";

const CustomLineChart = () => {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        <Line type="monotone" dataKey="amt" stroke="#82ca9d" />
        <CustomLine type="monotone" dataKey="pv" stroke="#6bd895" />
        <CustomLine type="monotone" dataKey="uv" stroke="#6bd895" />
        <CustomLine type="basis" dataKey="amt" stroke="#6bd895" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;

class CustomLine extends Line {
  render() {
    const { points, stroke } = this.props;
    if (!points || points.length < 2) return <></>;

    const zScores = getZScores(points.map(point => point.value));

    // Рассчитываем z-оценки
    const values = points.map((p) => p.value);
    const mean = calculateMean(values);
    const stdDev = calculateStandardDeviation(values);

    const segments = [];
    let currentSegment: LinePointItem[] = [];
    const currentAbove = zScores[0] && Math.abs(zScores[0]) > 1;
    let currentColor = currentAbove ? "red" : stroke || "#8884d8";

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const zScore = zScores[i];
      const aboveThreshold = zScore && Math.abs(zScore) >= 1;
      const color = aboveThreshold ? "red" : stroke || "#8884d8";

      currentSegment.push(point);

      if (i < points.length - 1) {
        const nextPoint = points[i + 1];
        const nextZScore = zScores[i + 1];
        const nextAboveThreshold = nextZScore && Math.abs(nextZScore) > 1;

        if (zScore && nextZScore && aboveThreshold !== nextAboveThreshold) {
          // Найти точку пересечения
          const ratio = (1 - Math.abs(zScore)) / (Math.abs(nextZScore) - Math.abs(zScore));
          const intersectX = point.x + ratio * (nextPoint.x - point.x);
          const intersectY = point.y + ratio * (nextPoint.y - point.y);
          const intersectPoint = { x: intersectX, y: intersectY, value: mean + stdDev * (nextAboveThreshold ? 1 : -1) };

          currentSegment.push(intersectPoint);
          segments.push({ points: currentSegment, color });

          // Начать новый сегмент
          currentSegment = [intersectPoint];
          currentColor = nextAboveThreshold ? "red" : stroke || "#8884d8";
        }
      }
    }

    if (currentSegment.length > 1) {
      segments.push({ points: currentSegment, color: currentColor });
    }

    const lineGenerator = d3Line<LinePointItem>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveMonotoneX);

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
          const zScore = zScores[idx];
          const aboveThreshold = zScore && Math.abs(zScore) >= 1;
          const color = aboveThreshold ? "red" : stroke || "#8884d8";
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
