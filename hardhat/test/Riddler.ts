import { expect } from "chai";
import { ethers, hardhatArguments } from "hardhat";
import { BigNumber } from "ethers";

describe("Riddler", function () {

    async function deployRiddlerContract() {
        const riddlerFactory = await ethers.getContractFactory('Riddler');
        const riddler = await riddlerFactory.deploy();
        return riddler;
    }

    it('should be able to create a riddle', async () => {
        //deploy riddler contract
        const riddler = await deployRiddlerContract();
        await riddler.createRiddle('crane', 'juice');
    });

    it('should only let the owner create a riddle', async () => {
        //deploy riddler contract
        const riddler = await deployRiddlerContract();
        const signers = await ethers.getSigners();
        const anotherSigner = signers[1];
        await expect(riddler.connect(anotherSigner).createRiddle('crane', 'juice'))
            .to.be.revertedWith('only owner can do that thang')
    });

    it('should be able to create a riddle, then display the riddles', async () => {
        //deploy riddler contract
        const riddler = await deployRiddlerContract();
        await riddler.createRiddle('crane', 'juice');
        const riddles = await riddler.getRiddles();
        expect(riddles.length).to.be.eq(1);
        console.log('riddles', riddles);
        expect(riddles[0].question).to.be.eq('crane');
        const wantPacked = ethers.utils.solidityPack(['string'], ['juice']);
        const wantHashed = ethers.utils.solidityKeccak256(['bytes'], [wantPacked])
        expect(riddles[0].answer).to.be.eq(wantHashed);
    });

    it('requires a minimum deposit to guess', async () => {
        //deploy riddler contract
        const riddler = await deployRiddlerContract();
        await riddler.createRiddle('crane', 'juice');
        const minAmount = await riddler.getMinDepositAmount();

        await expect(riddler.guess(0, 'juice', {
            value: minAmount
        })).not.to.be.reverted

    })

    it('should be able to tell whether the guess is correct', async () => {
        //deploy riddler contract
        const riddler = await deployRiddlerContract();
        const minAmount = await riddler.getMinDepositAmount();


        await riddler.createRiddle('crane', 'juice');
        await expect(riddler.guess(0, 'juice', {
            value: minAmount
        })).to.emit(riddler, 'correctGuess');

    });
    // throw error on wrong answer------------------
    it('should be able to tell whether the guess is wrong', async () => {
        //deploy riddler contract
        const riddler = await deployRiddlerContract();
        const minAmount = await riddler.getMinDepositAmount();

        await riddler.createRiddle('crane', 'juice');
        await expect(riddler.guess(0, 'wrongo', {
            value: minAmount
        })).not.to.emit(riddler, 'correctGuess')

    });
    it('should be able to only solve unsolved riddles', async () => {
        //deploy riddler contract
        const riddler = await deployRiddlerContract();
        const minAmount = await riddler.getMinDepositAmount();

        await riddler.createRiddle('crane', 'juice');
        await expect(riddler.guess(0, 'juice', {
            value: minAmount
        })).not.to.be.reverted;
        await expect(riddler.guess(0, "juice", {
            value: minAmount
        })).to.be.revertedWith('riddle already solved')
    });

    it('should allow owner to withdraw money', async () => {
        //deploy riddler contract
        const riddler = await deployRiddlerContract();
        //send 1 wei in on riddle creation
        await riddler.createRiddle('crane', 'juice', {
            value: BigNumber.from(1) 
        });
// expect the contract's value to be 1 wei
        expect(await ethers.provider.getBalance(riddler.address)).to.be.eq(1);

        // expect(riddler.withdraw()).not.to.be.reverted
        await riddler.withdraw();
        expect (await ethers.provider.getBalance(riddler.address)).to.be.eq(0);
        const signers = await ethers.getSigners();
        const signer = signers[0];
        const signerAddress = await signer.getAddress();
        expect (await ethers.provider.getBalance(signerAddress)).to.be.gt(0);

        // expect (await (await ethers.connect(anotherSigner)).getBalance()).to.be.eq(1)
    });

    it('should deny non owner withdraw', async () => {

        //deploy riddler contract
        const riddler = await deployRiddlerContract();
        await riddler.createRiddle('crane', 'juice', {
            value: ethers.BigNumber.from(1) 
        });
        // expect the contract's value to be 1 wei
        expect(await ethers.provider.getBalance(riddler.address)).to.be.eq(1);

        const signers = await ethers.getSigners();
        const anotherSigner = signers[1];
        await expect(riddler.connect(anotherSigner).withdraw())
            .to.be.revertedWith('only owner can do that thang')
    })

});
