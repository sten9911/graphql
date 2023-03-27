import { LEVEL_OVER_TIME_INFO } from '../service/GetLevelOverTimeData';
import ChartistGraph from 'react-chartist';

import { useEffect, useState } from 'react';

interface LevelOverTimeGraphProps {
    login: string
}

const LevelOverTimeGraph: React.FunctionComponent<LevelOverTimeGraphProps> = ({ login }) => {
    const [keys, setKey] = useState<string[]>([])
    const [values, setValues] = useState<number[]>([])

    useEffect(() => {
        const getData = async () => {
            const transactions = await fetchLevelOverTimeInfo(login)
            setKey(Array.from(transactions!.keys()))
            setValues(Array.from(transactions!.values()))
            
        }
        getData()
    }, [login])

    const fetchLevelOverTimeInfo = async (userLogin: string) => {
        const res = await LEVEL_OVER_TIME_INFO(userLogin)
        return res
    }

    var chartistOptions = {
        high: Math.max(...values)-3,
        low: 0,
    };
    var dataChartist = {
        labels: keys,
        series: [values],
    };     

    return (
        <div className="mt-4 w-100">
             <>
                <b className='text-dark mb-3'>Levels over time</b>
                <ChartistGraph data={dataChartist} options={chartistOptions} type={"Line"} />
            </>
        </div>
    )
}



export default LevelOverTimeGraph