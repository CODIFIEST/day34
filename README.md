### Day34 homework:
- copy my video! make a Riddler/Trivia game smart contract, with tests, in hard hat!

next lesson will be the UI and deployment of the game, but oyu actually know how to do that already... 
# Riddler
## what are we making

We are making a smart contact and UI-based game where 
we create a series of riddles, put in Goerli ETH into our contract, and if you know the answer to the riddle, you can submit it and win the ETH.

Example:
'crane _________' <-- we want the user to type the word 'juice' into the box, submit it to our contract, 
verify if it is the answer or not, and hten pay out the user if so. if not, we take the users' money as wrong answer fee. The payout for the right answer includes all the wrong answer fees.

## UI
The UI will be a simple form, and the current riddle, as well as an option to see another riddle.

## Contract
The contract should be able to:
-have multiple ongoing riddles
-keep track of how many wrong answers (or the fees) are for each riddle
-close a riddle after a correct answer
-and SECURELY store the riddle answer, so people can't inspect the contract and just see the word 'juice'
-functionality to add other riddles
-functionality to et all current riddles