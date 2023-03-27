import { useEffect, useState } from "react"
import { XpGainedData } from "../service/GetXpGainedData"

import ChartistGraph from "react-chartist";

type XpGainedGraphProps = {
    login: string
}

const XpGainedGraph: React.FunctionComponent<XpGainedGraphProps> = ({ login }) => {
    const [keys, setKeys] = useState<string[]>([])
    const [values, setValues] = useState<number[]>([])

    useEffect(() => {
        const getData = async () => {
            const transactions = await fetchLevelOverTimeInfo(login)
            setKeys(Array.from(transactions!.keys()))
            setValues(Array.from(transactions!.values()))
        }
        getData()
    }, [login])

    const fetchLevelOverTimeInfo = async (userLogin: string) => {
        const res = await XpGainedData(userLogin)
        return res
    }

    var dataChartist = {
        labels: keys,
        series: values,
    };   
    var chartistOptions = {
        width: "1000px",
        height: "1000px",
        donut: true,
        donutWidth: 400,
    }

    return (
        <div className="mt-4 w-100">
            <b className="text-dark">XP gained in Div_01</b>
            <ChartistGraph data={dataChartist} options={chartistOptions} type={"Pie"} />
        </div>
    )
}

export default XpGainedGraph;
