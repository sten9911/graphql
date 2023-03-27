import LevelOverTimeChart from './LevelOverTimeGraph';
import XpGainedChart from './XpGainedGraph';

interface GraphsProps {
    login: string
}

const Graphs: React.FunctionComponent<GraphsProps> = ({ login }) => {

    return (
        <div className='w-100 p-2'>
            <LevelOverTimeChart login={login} />
            <XpGainedChart login={login} />
        </div>
    )
}

export default Graphs;
