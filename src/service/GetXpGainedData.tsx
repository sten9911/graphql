import { GetProgressData, GetXpData } from "./GetBasicData";

export const XpGainedData = async (login: string) => {

    const isDoneProjectsMap = await GetProgressData(login);
    const allTransactions = await GetXpData(login);

    allTransactions.forEach((transaction) => {
        if (isDoneProjectsMap.has(transaction.path!)) {
            isDoneProjectsMap.set(transaction.path!, transaction.amount);
        }
    });

    return isDoneProjectsMap
}


