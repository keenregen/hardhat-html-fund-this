import { abi, contractAddress } from "./constants.js";
import { ethers } from "./ethers-5.1.esm.min.js";

const connectButton = document.getElementById("connectButton");
const withdrawButton = document.getElementById("withdrawButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");

const connect = async () => {
     if (typeof window.ethereum !== "undefined") {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log("Connected to your MetaMask!");
          connectButton.innerHTML = "Connected";
     } else {
          console.log(
               "It seems like you do not have metamask! You should install it first."
          );
          connectButton.innerHTML =
               "It seems like you do not have metamask installed!";
     }
};

const fund = async () => {
     const ethAmount = "0.1";
     console.log(`Funding ${ethAmount}`);
     if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner(); //account connected to the web page
          const contract = new ethers.Contract(contractAddress, abi, signer);
          try {
               const transactionResponse = await contract.fund({
                    value: ethers.utils.parseEther(ethAmount),
               });
               await listenForTransactionMine(transactionResponse, provider);
               console.log("Done");
          } catch (error) {
               console.log(error);
          }
     } else {
          fundButton.innerHTML = "Please install MetaMask";
     }
};

function listenForTransactionMine(transactionResponse, provider) {
     console.log(`Mining ${transactionResponse.hash}`);
     return new Promise((resolve, reject) => {
          try {
               provider.once(transactionResponse.hash, (transactionReceipt) => {
                    console.log(
                         `Completed with ${transactionReceipt.confirmations} confirmations. `
                    );
                    resolve();
               });
          } catch (error) {
               reject(error);
          }
     });
}

connectButton.onclick = connect;
fundButton.onclick = fund;
// withdrawButton.onclick = withdraw;
// balanceButton.onclick = getBalance;
