import axios from "axios";
import { Transaction } from "../models/user.info";
import { GRAPHQL_URL } from "./GraphqlUrl";

const AuditDataQuery = async (login: string, offset: number, upOrDown: string) => {
    const AUDIT_QUERY = `
    query UserAudit
    {
      transaction(
        where: {
          user: { login: { _eq: ${login} } }
          type: { _eq: ${upOrDown} }
        }
        offset: ${offset}
        order_by: { createdAt: desc }
      ) {
        amount
        createdAt
        path
      }
    }
    `

    return await axios.post(
        GRAPHQL_URL,
        JSON.stringify({
            query: AUDIT_QUERY,
        })
    );
}


const GetAuditRatioData = async (login: string, upOrDown: string) => {
    let fullDataFetched = false;
    let offset = 0;
    let transactions: Array<Transaction> = []

    const FETCH_AUDITS = async (offset: number) => {
        const res = await AuditDataQuery(login, offset, upOrDown);

        if (res.data.data.transaction) {
            res.data.data.transaction.forEach((transaction: Transaction) =>
                transactions.push(transaction)
            );
        } else {
            fullDataFetched = true
        }
    };
    while (!fullDataFetched) {
        await FETCH_AUDITS(offset);
        if (transactions.length % 50 === 0) {
            offset += 50;
        } else {
            fullDataFetched = true;
        }
    }

    return transactions;
}


export const GetAuditRatio = async (login: string) => {
    const downAuditAmount = (await GetAuditRatioData(login, "down")).map(function (transaction) { return transaction.amount }).reduce((acc, val) => acc + val, 0)
    const upAuditAmount = (await GetAuditRatioData(login, "up")).map(function (transaction) { return transaction.amount }).reduce((acc, val) => acc + val, 0)

    return (upAuditAmount / downAuditAmount).toFixed(1)
}
