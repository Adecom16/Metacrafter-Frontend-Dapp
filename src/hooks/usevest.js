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
    const { walletProvider } = useWeb3ModalProvider();
    const [signer, setSigner] = useState(null);
    const [vestingContract, setVestingContract] = useState(null);

    useEffect(() => {
        const initContract = async () => {
            if (walletProvider) {
                try {
                    const provider = getProvider(walletProvider);
                    console.log('Provider:', provider);
                    const signer = await provider.getSigner();
                    console.log('Signer:', signer);
                    const contract = getVestingContract(signer);
                    console.log('Vesting Contract:', contract);
                    setSigner(signer);
                    setVestingContract(contract);
                } catch (error) {
                    console.error("Error getting signer:", error);
                    toast.error("Failed to get contract or signer");
                }
            }
        };

        initContract();
    }, [walletProvider]);

    return { vestingContract, signer };
};

export const useAddStakeholder = (vestingContract, signer) => {
    const { chainId } = useWeb3ModalAccount();

    return useCallback(async (address, amount, releaseTime) => {
        if (!vestingContract) return toast.error("Vesting contract is not initialized");
        if (!ethers.utils.isAddress(address)) return toast.error("Invalid address");

        try {
            const tx = await vestingContract.addStakeholder(address, ethers.utils.parseUnits(amount, 18), releaseTime);
            await tx.wait();
            toast.success('Stakeholder added successfully');
        } catch (error) {
            console.error('Failed to add stakeholder:', error);
            toast.error('Failed to add stakeholder');
        }
    }, [vestingContract, chainId]);
};

export const useClaimTokens = (vestingContract, signer) => {
    const { chainId } = useWeb3ModalAccount();

    return useCallback(async () => {
        if (!vestingContract) return toast.error("Vesting contract is not initialized");

        try {
            const tx = await vestingContract.claimTokens();
            await tx.wait();
            toast.success('Tokens claimed successfully');
        } catch (error) {
            console.error('Failed to claim tokens:', error);
            toast.error('Failed to claim tokens');
        }
    }, [vestingContract, chainId]);
};

export const useWithdrawTokens = (vestingContract, signer) => {
    const { chainId } = useWeb3ModalAccount();

    return useCallback(async () => {
        if (!vestingContract) return toast.error("Vesting contract is not initialized");

        try {
            const tx = await vestingContract.withdraw();
            await tx.wait();
            toast.success('Unvested tokens withdrawn successfully');
        } catch (error) {
            console.error('Failed to withdraw unvested tokens:', error);
            toast.error('Failed to withdraw unvested tokens');
        }
    }, [vestingContract, chainId]);
};
