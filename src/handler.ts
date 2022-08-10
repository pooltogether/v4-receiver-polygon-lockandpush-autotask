import { Relayer } from 'defender-relay-client'
import { receiverDrawLockAndNetworkTotalSupplyPush } from '@pooltogether/v4-autotask-lib'
import {mainnet as mainnetContractList } from '@pooltogether/v4-pool-data'

export async function handler(event: any) {
  const relayer = new Relayer(event);
  const config = {
    beaconChain: {
      chainId: 1,
      providerUrl: event.secrets.ethereumMainnetProviderURL,
    },
    receiverChain: {
      chainId: 137,
      providerUrl: event.secrets.polygonMainnetProviderURL,
    },
    allPrizePoolNetworkChains: [
      {
        chainId: 1,
        providerUrl: event.secrets.ethereumMainnetProviderURL,
      },
      {
        chainId: 137,
        providerUrl: event.secrets.polygonMainnetProviderURL,
      },
      {
        chainId: 10,
        providerUrl: event.secrets.optimismMainnetProviderURL,
      }
    ]
  }

  try {
    const transactionPopulated = await receiverDrawLockAndNetworkTotalSupplyPush(mainnetContractList, config)
    if (transactionPopulated) {
      // Execute Transaction to push the Draw struct and TotalNetworkSupply to Ethereum Mainnet
      let transactionSentToNetwork = await relayer.sendTransaction({
        data: transactionPopulated.data,
        to: transactionPopulated.to,
        gasLimit: 500000,
        speed: 'fast'
      });

      console.log('TransactionHash:', transactionSentToNetwork.hash)
    } else {
      throw new Error('ReceiverTimelockTrigger: Waiting to push the Draw struct and TotalNetworkSupply to Polygon Mainnet')
    }
  } catch (error) {
    console.log(error)
  }
}
