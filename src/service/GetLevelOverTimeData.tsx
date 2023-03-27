import axios from "axios";
import { GRAPHQL_URL } from "./GraphqlUrl";
import { Transaction } from "../models/user.info";

const LevelDataQuery = async (login: string, offset: number) => {
  const LEVEL_QUERY = `
    query UserLevelOverTime
    {
      transaction(
        where: {
          user: { login: { _eq: ${login} } }
          type: { _eq: "level" }
          object: { type: { _regex: "project" } }
        }
        offset: ${offset}
        order_by: { createdAt: asc }
      ) {
        amount
        createdAt
        path
        object{
          name
          type
        }
      }
    }`

  return await axios.post(
    GRAPHQL_URL,
    JSON.stringify({
      query: LEVEL_QUERY,
    })
  );
}

const GetLevelData = async (login: string) => {
  let fullDataFetched = false;
  let transactions: Array<Transaction> = [];
  let offset = 0;

  const GetXpData = async (login: string, offset: number) => {
    const res = await LevelDataQuery(login, offset);
    if (res.data.data.transaction) {
      res.data.data.transaction.forEach((transaction: Transaction) =>
        transactions.push(transaction)
      );
    } else {
      fullDataFetched = true
      console.log("no results");
    }
  };

  while (!fullDataFetched) {
    await GetXpData(login, offset);
    if (transactions.length === 50) {
      offset += 50;
    } else {
      fullDataFetched = true;
    }
  }

  return transactions;
};

export const LEVEL_OVER_TIME_INFO = async (login: string) => {
  let levelTimeMap = new Map<string, number>()
  let arr: Transaction[] = (await GetLevelData(login))
  arr.forEach(transaction => levelTimeMap.set(transaction.createdAt.split("T")[0], transaction.amount))

  return levelTimeMap;
}
