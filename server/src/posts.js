const express = require('express');

const router = express.Router();

const User = require('./user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

const JWT_SECRET = 'feioafioae;ifKAeifo83u714ikpo0[eq9pdfenkl,bhanjmkl;/duioy'

const Web3 = require('web3');

const web3Provider = new Web3('https://mainnet.infura.io/v3/83782f0d2c51432d91dad838e29f9b28');

const Tx = require('ethereumjs-tx').Transaction;


router.post('/api/signup', async ( req, res ) => {

      const { username, password: plainTextPassword } = req.body

      const user = await User.findOne({ username }).lean()
      if(user) {
            return res.json({ status: 'error', error: 'Username already exists'})
      }

      if(!username || typeof username !== 'string') {
            return res.json({ status: 'error', error: 'Invalid username'})
      }
     
      if(!plainTextPassword || typeof plainTextPassword !== 'string') {
            return res.json({ status: 'error', error: 'Invalid Password'})
      }

      if(plainTextPassword.length < 6) {
            return res.json({ status: 'error', error: 'Password too short. Minimum 7 characters'})
      }

      // Hashing the password
      const password = await bcrypt.hash(plainTextPassword, 10)

      const account = web3Provider.eth.accounts.create();
      console.log(account)

      const response = await User({
            username,
            password,
            address: account.address,
            privateKey: account.privateKey
      })

      try {
        const savedPost = await response.save();
      } catch (err) {
        console.log(err)
        if(err.code === 11000) {
            return res.json({ status: 'error', error: 'Username already exists'})
        } else {
            return res.json({status: 'error', error: 'There was an error'})
        }
        throw err;
      }

      res.json({ status: 'ok' })
});

router.post('/api/login', async ( req, res ) => {

      const { username, password } = req.body

      const user = await User.findOne({ username }).lean()
      if(!user) {
            return res.json({ status: 'error', error: 'Invalid email/password'})
      }

      if(await bcrypt.compare(password, user.password)) {
            // the email & password pair is correct

            const token = jwt.sign({ 
                  id: user._id, 
                  email: user.email 
            }, JWT_SECRET)

            return res.json({ status: 'ok', data: token})
      }
      
      res.json({ status: 'error', error: 'Invalid password'})
});

router.post('/api/profile', async ( req, res ) => {
      
    const { token } = req.body

    try{
          const user = jwt.verify(token, JWT_SECRET)
          const username = user.username;

          const profile = await User.findOne({ username }, {address: 1, _id: 0}).lean()
          res.json({ status: 'ok', data: {profile}})

      } catch(error) {
          res.json({status: 'error', error: 'Please login'})
    }
});
// router.post('/api/ethBalance', async ( req, res ) => {
      
//     const { token } = req.body

//     try{
//           const user = jwt.verify(token, JWT_SECRET)
//           const username = user.username;

//           const profile = await User.findOne({ username }, { address: 1, _id: 0}).lean()
//           const balance =
//           res.json({ status: 'ok', data: { balance }})

//       } catch(error) {
//           res.json({status: 'error', error: 'Please login'})
//     }
// });

router.post('/api/balance/:contractId', async ( req, res ) => {
      
    const { token } = req.body
    
    const tokenAddress = req.params.contractId

    try{
          const user = jwt.verify(token, JWT_SECRET)
          const username = user.username;

          const response = await fetch(`https://api.etherscan.io/api?module=contract&action=getabi&address=${tokenAddress}`)
          const json = response.json()
          const abi = json.result;

          const contract = new web3Provider.eth.contract(abi, tokenAddress)

          const profile = await User.findOne({ username }, { address: 1, _id: 0}).lean()
          const balance = await contract.methods.balanceOf(profile.address).call();
          const symbol = await contract.methods.symbol().call();
          
          res.json({ status: 'ok', data: { balance, symbol }})

      } catch(error) {
          res.json({status: 'error', error: 'Please login'})
    }
});

// router.post('/api/transaction', async ( req, res ) => {
      
//       const { token, receiver, amount, contractAddress } = req.body

//       try{
//             const user = jwt.verify(token, JWT_SECRET)
//             const username = user.username;

//             const data = await User.findOne({ username }).lean()

//             const contract = new web3Provider.eth.contract(abi, contractAddress)
//             const pubKey = data.address
//             var gasLimit = 3000000;
        
//             // Get User's Number of Transactions
//             var count = await web3Provider.eth.getTransactionCount(pubKey);
//             const numberOfTransactions = `Number transactions so far: ${count}`
        
//             var chainId = 1; // Chain ID for OBS Mainnet
//             // Formulate the Transaction
//             var rawTransaction = {
//                 "from": pubKey,
//                 "nonce": "0x" + count.toString(16),
//                 "gasPrice": web3Provider.utils.toHex(gasPriceGwei * 1e9),
//                 "gasLimit": web3Provider.utils.toHex(gasLimit),
//                 "to": contractAddress,
//                 "value": "0x0",
//                 "data": contract.methods.transfer(receiver, amount).encodeABI(),
//                 "chainId": chainId
//             };
        
//             // Log the transaction's data
//             const transactionRaw = `Raw of Transaction: \n${JSON.stringify(rawTransaction, null, '\t')}\n------------------------`
        
//             // Get the User's private key to sign the transaction
//             const privkey1 = data.privateKey.replace("0x", "")
//             const privKey = new Buffer.from(privkey1, 'hex');
//             var tx = new Tx(rawTransaction, { common: obsCommon });
//             tx.sign(privKey);
//             var serializedTx = tx.serialize();
            
//             const signedTx = `Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`
        
//             // Print the transaction's receipt
//             var receipt = await web3Provider.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
//             const receiptInfo = `Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`

//             res.json({ status: 'ok', data: {numberOfTransactions, transactionRaw, signedTx, receiptInfo} })
//       } catch(error) {
//             res.json({status: 'error', error: 'Invalid receiver.'})
//       }       
// });


module.exports = router;