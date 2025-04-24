// import React, { useContext, createContext } from 'react';
// import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
// import { ethers } from 'ethers';
// import CrowdFundingABI from '../abi/CrowdFunding.json';

// // Create Context
// const StateContext = createContext();

// // State Context Provider
// export const StateContextProvider = ({ children }) => {
//     const contractAddress = '0x1074a2a49482dc6e933531179c12aaae109a1c07'; // Contract address
//     const { contract, isLoading, error } = useContract(contractAddress, CrowdFundingABI);
//     const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
    
//     const address = useAddress();
//     const connect = useMetamask();

//     // Publish Campaign function
//     const publishCampaign = async (form) => {
//         try {
//             //const parsedTarget = ethers.utils.parseEther(form.target.toString());
//            // const parsedDeadline = Math.floor(new Date(form.deadline).getTime() / 1000);
//             console.log("Target entered by user: ", form.target);
//             const data = await createCampaign({
//                 args: [
//                     address,
//                     form.title,
//                     form.description,
//                     form.target,
//                     //parsedTarget,
//                    // parsedDeadline,
//                    form.deadline,
//                     form.image
//                 ]
//             });
    
//             console.log("Contract call success", data);
//         } catch (error) {
//             console.log("Contract call failure", error);
//         }
//     };
    

//     const getCampaigns = async () => {
//         const campaigns = await contract.call('getCampaigns');

//         const parsedCampaigns = campaigns.map((campaign, i) => 
//         ({
//             owner: campaign.owner,
//             title: campaign.title,
//             description: campaign.description,
//             target: ethers.utils.formatEther(campaign.target.toString()),
//             deadline: campaign.deadline.toNumber(),
//             amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
//             image: campaign.image,
//             pId: i
//         }));

//         return parsedCampaigns;
//     }


//     return (
//         <StateContext.Provider
//             value={{
//                 address,
//                 contract,
//                 connect,
//                 createCampaign: publishCampaign, // Exposing the function to the provider
//                 getCampaigns,
//             }}
//         >
//             {children}
//         </StateContext.Provider>
//     );
// };

// // Custom hook for accessing context values
// export const useStateContext = () => useContext(StateContext);


import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';
import CrowdFundingABI from '../abi/CrowdFunding.json';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const contractAddress = '0x1074a2a49482dc6e933531179c12aaae109a1c07'; // Contract address
    const { contract, isLoading, error } = useContract(contractAddress, CrowdFundingABI);
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address,
          form.title,
          form.description,
          form.target,
          Math.floor(new Date(form.deadline).getTime() / 1000),
          form.image,
        ],
      });
  
      console.log("contract call success", data);
    } catch (error) {
      console.error("contract call failure", error);
    }
  };
  

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);