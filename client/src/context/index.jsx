import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import CrowdFundingABI from '../abi/CrowdFunding.json';

// Create Context
const StateContext = createContext();

// State Context Provider
export const StateContextProvider = ({ children }) => {
    const contractAddress = '0x1074a2a49482dc6e933531179c12aaae109a1c07'; // Contract address
    const { contract, isLoading, error } = useContract(contractAddress, CrowdFundingABI);
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
    
    const address = useAddress();
    const connect = useMetamask();

    // Publish Campaign function
    const publishCampaign = async (form) => {
        try {
            // Parsing target as Ether
            const parsedTarget = ethers.utils.parseEther(form.target.toString());
            // Parsing deadline to UNIX timestamp
            const parsedDeadline = Math.floor(new Date(form.deadline).getTime() / 1000);

            // Contract call
            const data = await createCampaign({
                args: [
                    address,          // user address
                    form.title,       // title of campaign
                    form.description, // description
                    parsedTarget,     // target value in Ether
                    parsedDeadline,   // deadline in UNIX timestamp
                    form.image        // image URL
                ]
            });

            console.log("Contract call success", data);
        } catch (error) {
            console.log("Contract call failure", error);
        }
    };

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign, // Exposing the function to the provider
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

// Custom hook for accessing context values
export const useStateContext = () => useContext(StateContext);
