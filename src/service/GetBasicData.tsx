import axios from "axios";
import { GRAPHQL_URL } from "./GraphqlUrl";
import { Transaction, Progress, UserInfo } from "../models/user.info";
import { GetAuditRatio } from "./GetAuditData";

const LevelDataQuery = async (login: string) => {
    const LevelQuery = `
    query UserLevel
    {
      transaction(
        where: {
          user: { login: { _eq: ${login} } }
          type: { _eq: "level" }
        }
        limit: 1
        order_by: { amount: desc }
      ) {
        userId
        amount
      }
    }`

    return await axios.post(
        GRAPHQL_URL,
        JSON.stringify({
            query: LevelQuery,
        })
    );
}

const ProgressDataQuery = async (login: string, offset: number) => {
    const ProgoressQuery = `
    query UserProgress{
        user(where: {login: {_eq: ${login}}})
        {
          progresses(
            where: {
                isDone: {_eq: true}, 
                path: {_niregex: "/johvi/div-01/piscine-js-2|/johvi/div-01/piscine-js|/johvi/onboarding/|/johvi/piscine-go|/johvi/div-01/rust"}
              }
            offset: ${offset}
              order_by: {path: asc})
          {
            createdAt
            isDone
            path
          }
        }
          
      }
  `;

    return await axios.post(
        GRAPHQL_URL,
        JSON.stringify({
            query: ProgoressQuery,
        })
    );
};

const XpDataQuery = async (login: string, offset: number) => {
    const XP_QUERY = `
        query UserXpForAllTransactions
          {
            user(where: { login: { _eq: ${login} } }) {
              login
              transactions(
                offset: ${offset}
                order_by: { amount: asc }
                where: {
                  type: { _eq: "xp" }
                  path: {_niregex: "/johvi/div-01/piscine-js-2|/johvi/div-01/piscine-js|/johvi/onboarding/|/johvi/piscine-go|/johvi/div-01/rust"}
                }
              ) {
                amount
                object {
                  name
                }
                type
                path
              }
            }
          }
        `;

    return await axios.post(
        GRAPHQL_URL,
        JSON.stringify({
            query: XP_QUERY,
        })
    );
};

export const GetProgressData = async (login: string) => {
    let isDoneProjectsMap = new Map<string, number>();
    let fullDataFetched = false;
    let offset = 0;

    const GetProgress = async (login: string, offset: number) => {
        const res = await ProgressDataQuery(login, offset);
        if (res.data.data.user[0]?.progresses) {
            res.data.data.user[0]?.progresses.forEach((isDoneProject: Progress) => {
                isDoneProjectsMap.set(isDoneProject.path, 0);
            });
        } else {
            fullDataFetched = true
        }
    };

    while (!fullDataFetched) {
        await GetProgress(login, offset);
        if (isDoneProjectsMap.size % 50 === 0) {
            offset += 50;
        } else {
            fullDataFetched = true;
        }
    }

    return isDoneProjectsMap;
};

export const GetXpData = async (login: string) => {
    let fullDataFetched = false;
    let transactions: Array<Transaction> = [];
    let offset = 0;

    const GetXp = async (login: string, offset: number) => {
        const res = await XpDataQuery(login, offset);
        if (res.data.data.user[0]?.transactions) {
            res.data.data.user[0]?.transactions.forEach((transaction: Transaction) =>
                transactions.push(transaction)
            );
        } else {
            fullDataFetched = true
        }
    };

    while (!fullDataFetched) {
        await GetXp(login, offset);
        if (transactions.length % 50 === 0) {
            offset += 50;
        } else {
            fullDataFetched = true;
        }
    }

    return transactions;
};

const GetIdAndLevel = async (login: string) => {

    const GetLevelData = async (login: string) => {
        let idLevelInfo: UserInfo = {
            login: "",
        };
        try {
            const res = await LevelDataQuery(login);
            if (res.data.data.transaction[0]) {
                idLevelInfo.id = res.data.data.transaction[0].userId
                idLevelInfo.level = res.data.data.transaction[0].amount
                idLevelInfo.login = login
                return idLevelInfo
            }
            return idLevelInfo
        } catch(error) {
            return undefined
        }
        

    };
    let idLevelInfo = await GetLevelData(login)
    return idLevelInfo;
}

export const GetBasicData = async (login: string) => {

    const PISCINE_JS = 70000;
    //const PISCINE_RUST_XP = 390000;

    const userIdandLevelEtc = await GetIdAndLevel(login)
    if(userIdandLevelEtc !== undefined) {
        
        if (userIdandLevelEtc.login !== "") {
            const DoneProjectsMap = await GetProgressData(login);
            const allTransactions = await GetXpData(login);
            console.log(allTransactions);
            console.log(DoneProjectsMap);
            
            
            const auditRatio = await GetAuditRatio(login)
    
            allTransactions.forEach((transaction) => {
                if (DoneProjectsMap.has(transaction.path!)) {
                    DoneProjectsMap.set(transaction.path!, transaction.amount);
                }
            });
    
            let userInfo: UserInfo = {
                login: login,
                id: userIdandLevelEtc.id,
                level: userIdandLevelEtc.level,
                auditRatio: auditRatio,
                xp: Math.round(
                    (Array.from(DoneProjectsMap.values()).reduce((acc, val) => acc + val, 0) +
                        PISCINE_JS)
                )
            };
            return userInfo
        }
    }
    return userIdandLevelEtc;
};
