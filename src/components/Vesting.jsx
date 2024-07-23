import React, { useState } from 'react';
import { Flex, Text, Button } from "@radix-ui/themes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useVestingContract, useAddStakeholder, useClaimTokens, useWithdrawTokens } from "../hooks/useVesting";
import { ethers } from 'ethers';

const VestingComponent = () => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { vestingContract, signer } = useVestingContract();

  const addStakeholder = useAddStakeholder(vestingContract, signer);
  const claimTokens = useClaimTokens(vestingContract, signer);
  const withdrawTokens = useWithdrawTokens(vestingContract, signer);

  const [stakeholderAddress, setStakeholderAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const handleAddStakeholder = async () => {
    if (!chainId || !walletProvider) {
      return toast.error("Connect your wallet first");
    }

    if (!ethers.isAddress(stakeholderAddress)) {
      return toast.error("Invalid stakeholder address");
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return toast.error("Invalid amount");
    }

    const releaseTime = Math.floor(new Date(releaseDate).getTime() / 1000);

    if (isNaN(releaseTime) || releaseTime <= Date.now() / 1000) {
      return toast.error("Invalid release time");
    }

    try {
      await addStakeholder(stakeholderAddress, amount, releaseTime);
    } catch (error) {
      console.error('Failed to add stakeholder:', error);
      console.log(error)
    }
  };

  const handleClaimTokens = async () => {
    if (!chainId || !walletProvider) {
      return toast.error("Connect your wallet first");
    }

    try {
      await claimTokens();
    } catch (error) {
      toast.error("Failed to claim tokens");
    }
  };

  const handleWithdrawTokens = async () => {
    if (!chainId || !walletProvider) {
      return toast.error("Connect your wallet first");
    }

    try {
      await withdrawTokens();
    } catch (error) {
      toast.error("Failed to withdraw tokens");
    }
  };

  return (
    <main className="mt-6">
      <Flex direction="column" gap="4" wrap="wrap">
        <Flex direction="column" gap="4">
          <Text size="2xl">Add Stakeholder</Text>
          <input
            placeholder="Stakeholder Address"
            value={stakeholderAddress}
            onChange={(e) => setStakeholderAddress(e.target.value)}
          />
          <input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            placeholder="Release Date"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
          <Button onClick={handleAddStakeholder}>Add Stakeholder</Button>
        </Flex>
        <Flex direction="column" gap="4">
          <Text size="2xl">Claim Tokens</Text>
          <Button onClick={handleClaimTokens}>Claim</Button>
        </Flex>
        <Flex direction="column" gap="4">
          <Text size="2xl">Withdraw Unvested Tokens</Text>
          <Button onClick={handleWithdrawTokens}>Withdraw</Button>
        </Flex>
      </Flex>
      <ToastContainer />
    </main>
  );
};

export default VestingComponent;
