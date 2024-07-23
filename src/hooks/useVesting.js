import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { getProvider } from '../constant/provider';
import { getVestingContract } from '../constant/contract';
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";

export const useVestingContract = () => {
    const { provider } = useWeb3ModalProvider();
    const [signer, setSigner] = useState(null);
    const [vestingContract, setVestingContract] = useState(null);
  
    useEffect(() => {
      if (provider) {
        const readWriteProvider = getProvider(provider);
        readWriteProvider.getSigner().then((signer) => {
          setSigner(signer);
          const contract = getVestingContract(signer);
          setVestingContract(contract);
        }).catch((error) => {
          console.error("Error getting signer:", error);
          toast.error("Failed to get contract or signer");
        });
      }
    }, [provider]);
  
    return { vestingContract, signer };
  };

export const useAddStakeholder = (address, amount, releaseTime) => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(async () => {
        if (!vestingContract) return toast.error("Vesting contract is not initialized");
        if (!isSupportedChain(chainId)) return toast.error("Wrong network");
        if (!ethers.utils.isAddress(address)) return toast.error("Invalid address");
        
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
        const contract = getVestingContract(signer);

        try {
            const tx = await contract.addStakeholder(address, ethers.utils.parseUnits(amount, 18), releaseTime);
            await tx.wait();
            toast.success('Stakeholder added successfully');
        } catch (error) {
            console.error('Failed to add stakeholder:', error);
            toast.error('Failed to add stakeholder');
        }
    }, [address, amount, releaseTime, chainId, walletProvider]);
};

export const useClaimTokens = () => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(async () => {
        if (!vestingContract) return toast.error("Vesting contract is not initialized");
        if (!isSupportedChain(chainId)) return toast.error("Wrong network");

        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
        const contract = getVestingContract(signer);

        try {
            const tx = await contract.claimTokens();
            await tx.wait();
            toast.success('Tokens claimed successfully');
        } catch (error) {
            console.error('Failed to claim tokens:', error);
            toast.error('Failed to claim tokens');
        }
    }, [chainId, walletProvider]);
};

export const useWithdrawTokens = () => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(async () => {
        if (!vestingContract) return toast.error("Vesting contract is not initialized");
        if (!isSupportedChain(chainId)) return toast.error("Wrong network");

        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
        const contract = getVestingContract(signer);

        try {
            const tx = await contract.withdraw();
            await tx.wait();
            toast.success('Unvested tokens withdrawn successfully');
        } catch (error) {
            console.error('Failed to withdraw unvested tokens:', error);
            toast.error('Failed to withdraw unvested tokens');
        }
    }, [chainId, walletProvider]);
};
