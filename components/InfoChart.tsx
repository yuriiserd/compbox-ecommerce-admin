import { Chart, registerables } from "chart.js";
import { useEffect, useRef, useState } from "react";

Chart.register(...registerables);

function getDaysInMonth(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date).getDate());
    date.setDate(date.getDate() + 1);
  }
  return days;
}

type InfoChartProps = {
  period?: string,
  id: string,
  data: {},
  color?: string,
  bg?: string,
  label: string,
  step?: number

}

export default function InfoChart({period, id, data: initialData, color, bg, label, step}: InfoChartProps) {

  const thisWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const thisYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const thisMonth = getDaysInMonth(new Date().getMonth(), new Date().getFullYear());

  const [infoPeriod, setInfoPeriod] = useState(thisWeek);

  useEffect(() => {
    if (period === "week") {
      setInfoPeriod(thisWeek)
    } else if (period === "month") {
      setInfoPeriod(thisMonth)
    } else if (period === "year") {
      setInfoPeriod(thisYear)
    }
  }, [period])
  
  const data = {
    datasets: [
      {
        label: label,
        backgroundColor:  bg || "rgba(51, 200, 99, .1)",
        fill: true,
        borderColor: color || "#33c863",
        data: initialData,
        tension: 0.2,
      },
    ],
  };
  const chartRef = useRef(null);

  useEffect(() => {
    const canvasId = document.getElementById(id) as HTMLCanvasElement;
    const ctx = canvasId.getContext("2d");
    chartRef.current = new Chart(ctx, {
        type: "line",
        data,
        options: {
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false,
                axis: "x",
            },
            plugins: {
                tooltip: {
                    enabled: true,
                },
                legend: {
                    display: false,
                },
            },
            
            scales: {
                y: {
                  grid: {
                      color: "#dddfe5",
                  },
                  ticks: {
                      color: "#929292",
                      font: {
                          family: "'Mulish', sans-serif",
                          size: "16px",
                      },
                      beginAtZero: step === 1 ? true : false,
                      stepSize: step || false,
                  },
                },
                x: {
                    grid: {
                        drawBorder: false,
                        borderDash: [6],
                        color: "#dddfe5",
                        border: false,
                    },
                    ticks: {
                        color: "#929292",
                        font: {
                            family: "'Mulish', sans-serif",
                            size: "16px",
                        },
                    },
                },
            },
        },
    });

    return () => chartRef.current.destroy();
  }, [id, period]);

  return (
    <canvas id={id}></canvas>
  )
}