import algosdk, {
    ABIContract,
    AtomicTransactionComposer,
    Transaction
} from "algosdk";
import abiRaw from "./abi.json";
import dotenv from "dotenv";
import { useEffect } from "react";

dotenv.config();

const algodClient = new algosdk.Algodv2(
    "",
    "https://testnet-api.algonode.cloud",
    ""
);

const factoryAppId = 741185304;

// Hardcoded trigger app IDs - add your trigger app IDs here
const triggerAppIds = {
    default: 741185305, // Replace with your actual trigger app ID
    personal: 741185306, // Replace with another trigger app ID
    business: 741185307, // Replace with another trigger app ID
};

// Get sender from localStorage with fallback
function getSenderFromStorage(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
        const sender = localStorage.getItem('algorand_sender');
        if (!sender) {
            throw new Error('No sender address found in localStorage. Please set "algorand_sender" key.');
        }
        return sender;
    }
    throw new Error('localStorage not available');
}

const signer = async (txns: Transaction[]): Promise<Uint8Array[]> => {
    const { sk } = algosdk.mnemonicToSecretKey(process.env.DEPLOYER_MNEMONIC!);
    return txns.map((txn) => txn.signTxn(sk));
};

function getABIContract(name: string): ABIContract {
    const contractDef = (abiRaw as any).contracts.find((c: any) => c.name === name);
    if (!contractDef) throw new Error(`Contract ${name} not found in ABI`);
    return new algosdk.ABIContract(contractDef);
}

async function callMethod(
    appId: number,
    methodName: string,
    args: any[] = [],
    sender?: string,
    signerFn: typeof signer = signer
): Promise<any> {
    const actualSender = sender || getSenderFromStorage();

    const method = getABIContract(appId === factoryAppId ? "TriggerFactory" : "Trigger").getMethodByName(methodName);
    const atc = new AtomicTransactionComposer();

    const params = await algodClient.getTransactionParams().do();
    const suggestedParams = {
        ...params,
        fee: 1000,
        flatFee: true
    };

    atc.addMethodCall({
        appID: appId,
        method,
        methodArgs: args,
        sender: actualSender,
        suggestedParams,
        signer: signerFn,
    });

    const result = await atc.execute(algodClient, 4);
    return result.methodResults[0].returnValue;
}

export async function createTriggerInstance(sender?: string) {
    return callMethod(factoryAppId, "create_trigger_instance", [], sender);
}

export async function getInstanceCount(sender?: string) {
    return callMethod(factoryAppId, "get_instance_count", [], sender);
}

export async function getInstanceByIndex(index: number, sender?: string) {
    return callMethod(factoryAppId, "get_instance_by_index", [index], sender);
}

export async function getFactoryOwner(sender?: string) {
    return callMethod(factoryAppId, "get_factory_owner", [], sender);
}

export async function hello(appId: number, name: string, sender?: string) {
    return callMethod(appId, "hello", [name], sender);
}

export async function deposit(appId: number, amount: number, sender?: string) {
    const actualSender = sender || getSenderFromStorage();

    const params = await algodClient.getTransactionParams().do();
    const suggestedParams = {
        ...params,
        fee: 1000,
        flatFee: true
    };

    const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: actualSender,
        to: algosdk.getApplicationAddress(appId),
        amount,
        suggestedParams,
    } as any);

    const method = getABIContract("Trigger").getMethodByName("deposit");

    const atc = new AtomicTransactionComposer();
    atc.addMethodCall({
        appID: appId,
        method,
        methodArgs: [{ txn: payTxn, signer }],
        sender: actualSender,
        suggestedParams,
        signer,
    });

    const result = await atc.execute(algodClient, 4);
    return result.methodResults[0].returnValue;
}

export async function triggerPayment(appId: number, recipient: string, amount: number, sender?: string) {
    return callMethod(appId, "trigger_payment", [recipient, amount], sender);
}

export async function withdraw(appId: number, amount: number, sender?: string) {
    return callMethod(appId, "withdraw", [amount], sender);
}

export async function withdrawAll(appId: number, sender?: string) {
    return callMethod(appId, "withdraw_all", [], sender);
}

export async function getBalance(appId: number, sender?: string) {
    return callMethod(appId, "get_balance", [], sender);
}

export async function getCreator(appId: number, sender?: string) {
    return callMethod(appId, "get_creator", [], sender);
}

export async function getContractAddress(appId: number, sender?: string) {
    return callMethod(appId, "get_contract_address", [], sender);
}

export async function getInstanceInfo(appId: number, sender?: string) {
    return callMethod(appId, "get_instance_info", [], sender);
}

export function setSenderInStorage(address: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('algorand_sender', address);
    }
}

export function getSenderFromStorageOrNull(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('algorand_sender');
    }
    return null;
}

export function clearSenderFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('algorand_sender');
    }
}

export function saveTriggerAppId(appId: number, name?: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        const existingAppIds = getTriggerAppIds();
        const newEntry = {
            appId,
            name: name || `Trigger ${appId}`,
            createdAt: new Date().toISOString()
        };

        const existingIndex = existingAppIds.findIndex(entry => entry.appId === appId);
        if (existingIndex >= 0) {
            existingAppIds[existingIndex] = newEntry;
        } else {
            existingAppIds.push(newEntry);
        }

        localStorage.setItem('trigger_app_ids', JSON.stringify(existingAppIds));
    }
}

export function getTriggerAppIds(): Array<{ appId: number, name: string, createdAt: string }> {
    if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('trigger_app_ids');
        return stored ? JSON.parse(stored) : [];
    }
    return [];
}

export function getDefaultTriggerAppId(): number | null {
    const appIds = getTriggerAppIds();
    return appIds.length > 0 ? appIds[0].appId : null;
}

export function removeTriggerAppId(appId: number): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        const existingAppIds = getTriggerAppIds();
        const filtered = existingAppIds.filter(entry => entry.appId !== appId);
        localStorage.setItem('trigger_app_ids', JSON.stringify(filtered));
    }
}

export function clearAllTriggerAppIds(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('trigger_app_ids');
    }
}

export async function createAndSaveTriggerInstance(name?: string, sender?: string): Promise<number> {
    const appId = await createTriggerInstance(sender);
    saveTriggerAppId(appId, name);
    return appId;
}

export async function quickDeposit(amount: number, sender?: string) {
    const appId = getDefaultTriggerAppId();
    if (appId === null) throw new Error("No default trigger app ID found.");
    return deposit(appId, amount, sender);
}

export async function quickTriggerPayment(recipient: string, amount: number, sender?: string) {
    const appId = getDefaultTriggerAppId();
    if (appId === null) throw new Error("No default trigger app ID found.");
    return triggerPayment(appId, recipient, amount, sender);
}

export async function quickWithdraw(amount: number, sender?: string) {
    const appId = getDefaultTriggerAppId();
    if (appId === null) throw new Error("No default trigger app ID found.");
    return withdraw(appId, amount, sender);
}

export async function quickWithdrawAll(sender?: string) {
    const appId = getDefaultTriggerAppId();
    if (appId === null) throw new Error("No default trigger app ID found.");
    return withdrawAll(appId, sender);
}

export async function quickGetBalance(sender?: string) {
    const appId = getDefaultTriggerAppId();
    if (appId === null) throw new Error("No default trigger app ID found.");
    return getBalance(appId, sender);
}