import {
    CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import { data } from "../data/data";
import ZScoresLine from "./zScoresLine";

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
        <ZScoresLine type="monotone" dataKey="pv" stroke="#6bd895" />
        <ZScoresLine type="monotone" dataKey="uv" stroke="#6bd895" />
        <ZScoresLine type="basis" dataKey="amt" stroke="#6bd895" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
