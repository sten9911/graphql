import { useEffect, useState } from 'react'
import { UserInfo } from '../models/user.info';
import { GetBasicData } from '../service/GetBasicData';

type BasicInformationProps = {
    login: string,
    setValidLogin: Function,
    getValidLogin: boolean
}

const BasicInformation: React.FunctionComponent<BasicInformationProps> = ({ login, setValidLogin, getValidLogin }) => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const getData = async () => {
            const basicInfo = await fetchBasicInfo(login)
            if(basicInfo !== undefined) {
                setUserInfo(basicInfo);
                setValidLogin(true)
            } else {
                setValidLogin(false)
            }
        }
        getData()
    }, [login, setValidLogin])

    const fetchBasicInfo = async (userLogin: string) => {
        const res = await GetBasicData(userLogin)
        return res
    }

    return (
        <>
            <div className="bg-light p-2 rounded w-50">
                <div className="card-container">
                    <div className="card-title"><b>{login}</b></div>
                    {getValidLogin ? <>
                        <div className="card-info"> {userInfo &&
                        <div className="d-flex justify-content-between">
                            <div>
                                id: <br />
                                level: <br />
                                xp: <br />
                                audit ratio: 
                            </div>
                            <div>
                                {userInfo.id} <br />
                                {userInfo.level} <br />
                                {userInfo.xp} <br />
                                {userInfo.auditRatio}
                            </div>
                        </div>
                        }
                        </div>
                    </> : 
                        <div className="card-info">
                            Sorry. This user does not exist. Try typing in a new username please.
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default BasicInformation